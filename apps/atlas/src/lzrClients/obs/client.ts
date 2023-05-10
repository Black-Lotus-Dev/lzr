import LzrStore from "@/lzrStore/lzrStore";
import { createLzrStore } from "@/utils/lzrStore";
import { waitForLzrRoom } from "@/utils/rtc";
import OBSWebSocket from "obs-websocket-js";
import toast from "react-hot-toast";
import { BehaviorSubject, pairwise, switchMap, of } from "rxjs";

interface ObsStore {
  wsPassword: string;
  wsIp: string;
  wsPort: string;
}

export class OBSClient {
  public wsSubscribers: any[] = [];
  public store: LzrStore<ObsStore>;
  public obsWs: OBSWebSocket = new OBSWebSocket();

  public state = {
    isConnected: false,
  };

  public isReady = false;

  //state$ uses rxjs to subscribe to state changes
  public state$ = new BehaviorSubject<typeof this.state>(this.state);

  async startup() {
    this.store = await createLzrStore("obs");
    const { isConnected } = await this.state;
    if (isConnected) this.obsWs.disconnect();

    //create a listener for when the connection state changes
    this.obsWs.on("ConnectionOpened", async () => {
      this.obsWs.on("Identified", () => {
        this.state$.next({ isConnected: true });
      });
    });

    this.obsWs.on("ConnectionClosed", () => {
      this.state$.next({ isConnected: false });
    });

    this.state$
      .pipe(
        pairwise(),
        switchMap(([oldResult, newResult]) => {
          this.state = newResult;

          if (oldResult.isConnected !== newResult.isConnected) {
            if (newResult.isConnected) {
              toast.success("OBS Connected");
              this.notifyWsSubscribers();
            } else {
              toast.error("OBS Disconnected");
            }
          }
          return of(null);
        })
      )
      .subscribe();

    if (!!this.store.state.wsPassword) {
      //connect to obs if the password is already set
      const { wsPassword, wsIp, wsPort } = this.store.state;
      this.connect(wsIp, wsPort, wsPassword);
    }
  }

  async notifyWsSubscribers() {
    this.wsSubscribers.forEach((subscriber) => {
      subscriber();
    });
  }

  public restartConnection() {
    const { wsPassword, wsIp, wsPort } = this.store.state;
    return this.connect(wsIp, wsPort, wsPassword);
  }

  async connect(wsIp: string, wsPort: string, wsPass: string) {
    try {
      await this.obsWs.connect(`ws://${wsIp}:${wsPort}`, wsPass);
      return true;
    } catch (e) {
      if (e.code !== 1006) return false;
      return -1;
    }
  }

  public getObsWsSettings() {
    const { wsIp, wsPort, wsPassword } = this.store.state;
    return { wsIp, wsPort, wsPassword };
  }

  public async updateObsWsSettings(
    wsIp: string,
    wsPort: string,
    wsPassword: string
  ) {
    this.store.update({
      wsIp,
      wsPort,
      wsPassword,
    });

    return await this.connect(wsIp, wsPort, wsPassword);
  }

  public async getCurrentScene() {
    const scene = (await this.obsWs.call("GetCurrentProgramScene"))
      .currentProgramSceneName;
    return scene;
  }

  public async isStreaming() {
    const streamStatus = await this.obsWs.call("GetStreamStatus");
    return streamStatus;
  }
}

//export the obsClient as a singleton
export const obsClient = new OBSClient();

export const getObsClient = () => obsClient;
export const getObsWs = () => obsClient.obsWs;
export function waitForObsClient(cb: any) {
  //wait for client to be ready
  if (obsClient.isReady) return cb();
  obsClient.wsSubscribers.push(cb);
}


