import { ActionProgress, ActionReceiver, ActionSender, Room } from "trystero";

type SendFuncType = (data: string) => void;

type ChannelEvent = {
  event: string;
  data: any;
  requestId: string;
  origin: string;
};

class LZRChannel {
  public name: string;
  private send: SendFuncType;
  private room: Room;
  private _send: ActionSender<string>;
  private get: ActionReceiver<string>;
  private progress: ActionProgress;

  private globalSubscribers: ((data: string) => void)[] = [];
  private eventSubscribers: { [key: string]: ((data: string) => void)[] } = {};

  constructor(room: Room, name: string) {
    this.name = name;
    this.room = room;
    this.setupDataActions();
  }

  public unSubscribeAll() {
    this.globalSubscribers = [];
    this.eventSubscribers = {};
  }

  private unSubEvent(event: string, requestId: string) {
    if (this.eventSubscribers[event]) {
      this.eventSubscribers[event] = this.eventSubscribers[event].filter(
        (subscriber) => subscriber.name !== requestId
      );
    }
  }

  setupDataActions() {
    const [sendData, getData, dataProgress] =
      this.room.makeAction<string>("myData");

    this.send = sendData;
    this.get = getData;
    this.progress = dataProgress;

    this.get((data, peerId) => {
      this.globalSubscribers.forEach((subscriber) => {
        subscriber(data);
      });

      this.eventSubHandler(data, peerId);
    });
  }

  // Subscribe to all events
  private eventSubHandler = (data: string, peerId: string) => {
    const { event, data: eventData } = JSON.parse(data) as ChannelEvent;

    // If there are subscribers to this event, call them with the event data
    if (this.eventSubscribers[event]) {
      this.eventSubscribers[event].forEach((subscriber) => {
        subscriber(eventData);
      });
    }
  };

  public eventSub = (event: string, cb: (data: any) => void) => {
    if (!this.eventSubscribers[event]) {
      this.eventSubscribers[event] = [];
    }

    this.eventSubscribers[event].push(cb);
  };

  async demand(event: string, data?: any) {
    return new Promise((resolve) => {
      // Generate a unique ID for this demand event
      const requestId = `\${event}-\${Date.now()}-\${Math.random()}`;

      // Send data with the event name and requestId
      const emitData: ChannelEvent = {
        event,
        requestId,
        data,
      };
      this._send(JSON.stringify(emitData));

      // Subscribe to the response
      this.eventSub(event, (data) => {
        if (data.requestId === requestId) {
          resolve(data);
        }
      });
    });
  }

  async emit(event: string, data?: any) {
    const emitData = {
      event,
      data,
    };
    this._send(JSON.stringify(emitData));
  }
}
