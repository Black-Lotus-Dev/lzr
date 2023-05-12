import { _ } from "shared/utils";
import { joinRoom, Room, selfId } from "trystero";
import { LZRChannel } from "./channel";

const config = { appId: "https://logoszr-bot-default-rtdb.firebaseio.com" };

interface Peer {
  name: string;
  id: string;
  channels: string[];
}

type ChannelEvent = {
  channel: string;
  data: any;
};

class Guest {
  //details about the guest
  public name: string;
  public id: string;
  public isConnected: boolean = false;

  //details about the room
  private room: Room; //the webrtc connection to the room
  public roomId: string;
  public roomName: string;

  //details about the host
  private hostId?: string;

  public channels: {
    [key: string]: LZRChannel<any>;
  } = {};

  public queuedEvents: ChannelEvent[] = [];
  public closeLzrRoom: () => void = () => {};
  public notifySubscribers: (roomId: string) => void = () => {};
  public channelSub: LZRChannel<any> = {} as LZRChannel<any>;

  constructor(name: string, roomId: string) {
    this.name = name;
    this.roomName = name;
    this.roomId = roomId;
    this.id = selfId;

    this.room = joinRoom(config, this.roomId);
    this.connectToHost();
  }

  private connectToHost() {
    const auth = this.createChannel<Peer>("room-auth");
    const kickPeerAction = this.createChannel<0>("kick-peer");
    this.channelSub = this.createChannel<string>("channel");

    //this handles the auth details received from guests
    auth.get((host: Peer, hostId: string) => {
      //if guests ids dont match, ignore them
      if (host.id !== hostId || this.hostId) return;

      this.isConnected = true;
      this.hostId = hostId;
      auth.send({
        name: this.name,
        id: this.id,
        channels: Object.keys(this.channels),
      });

      this.notifySubscribers(this.roomId);

      //call queued events
      this.runQueuedEvents();
    });

    //listen for the host to disconnect
    this.room.onPeerLeave((id) => {
      this.isConnected = false;
      if (this.hostId === id) {
        this.hostId = undefined;
      }
    });

    kickPeerAction.get(() => {
      this.room.leave();
    });
  }

  private runQueuedEvents() {
    Object.keys(this.queuedEvents).forEach((channel) => {
      const queuedChannelEvents = this.queuedEvents.filter(
        (x) => x.channel === channel
      );

      queuedChannelEvents.forEach((event) => {
        this.channels[channel].send(event.data);
      });
    });
  }

  public setCloseHostFunc = (cb: () => void) => {
    this.closeLzrRoom = cb;
  };

  public disconnect() {
    this.room.leave();
    this.closeLzrRoom();
  }

  private handleSendAction = <T>(channel: string, data: T) => {
    //check if action still exists
    if (!this.channels[channel]) return;

    //check if the host is connected
    if (!this.hostId) {
      //if not queue the event
      this.queuedEvents.push({ channel, data });
      return;
    }

    //send to the host that are still connected
    this.channels[channel]._send(data, this.hostId);
  };

  public createChannel<T>(channel: string): LZRChannel<T> {
    if (!this.channels[channel]) {
      const [send, get, progress] = this.room.makeAction<T>(channel);

      const lzrSendAction = (data: T) => this.handleSendAction(channel, data);
      this.channels[channel] = {
        send: lzrSendAction,
        _send: send,
        get,
        progress,
      };

      //if the host is connected, send the channel name to the host
      if (this.hostId) {
        this.channelSub.send(channel);
      }
    }

    return this.channels[channel];
  }
}

export default Guest;
