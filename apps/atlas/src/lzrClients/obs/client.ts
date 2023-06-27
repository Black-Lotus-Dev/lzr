import LzrStore from "@/lzrStore/lzrStore";
import { createLzrStore } from "@/utils/lzrStore";
import { waitForLZRRoom } from "@/utils/rtc";
import OBSWebSocket from "obs-websocket-js";
import toast from "react-hot-toast";
import { BehaviorSubject, pairwise, switchMap, of } from "rxjs";

interface WebSocketConfig {
  password: string;
  ip: string;
  port: number;
}
interface ObsStore {
  wsConfig: WebSocketConfig;
  connectOnStartup: boolean;
}

interface ObsState {
  isConnected: boolean;
  wsConfig: WebSocketConfig;
  connectOnStartup: boolean;
}

export class OBSClient {
  public wsSubscribers: any[] = [];
  public store: LzrStore<ObsStore>;
  public obsWs: OBSWebSocket = new OBSWebSocket();
  public state: ObsState;

  public isReady = false;

  //state$ uses rxjs to subscribe to state changes
  public state$: BehaviorSubject<ObsState>;

  //this var handles the polling for the connection state
  public connectionPoll: NodeJS.Timer;
  constructor() {
    createLzrStore("obs", {
      wsConfig: {
        ip: "192.168.1.224",
        password: "",
        port: 4455,
      },
      connectOnStartup: false,
    }).then((store) => {
      this.store = store as LzrStore<ObsStore>;
      this.configureClient();
    });
  }

  configureClient() {
    this.state = {
      isConnected: false,
      connectOnStartup: this.store.state.connectOnStartup,
      wsConfig: this.store.state.wsConfig,
    };

    this.state$ = new BehaviorSubject<ObsState>(this.state);
    this.startup();
  }

  async startup() {
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

    this.state.connectOnStartup && this.connect();
  }

  async notifyWsSubscribers() {
    this.wsSubscribers.forEach((subscriber) => {
      subscriber();
    });
  }

  async connect(wsConfig?: WebSocketConfig) {
    this.state.isConnected && this.obsWs.disconnect();
    const { ip, password, port } = wsConfig || this.store.state.wsConfig;

    this.obsWs.connect(`ws://${ip}:${port}`, password).catch((err) => {
      console.debug(err);
      toast.error("OBS failed to connect");

      //if the connection fails, try again in 30 seconds
      setTimeout(() => {
        this.connect();
      }, 30000);

      this.state$.next({
        ...this.state,
        isConnected: false,
      });
    });
  }

  public toggleConnectOnStartup() {
    const { connectOnStartup } = this.store.state;
    const newConnectOnStartup = !connectOnStartup;

    this.store.update({ connectOnStartup: newConnectOnStartup })
    .then(() => {
      this.state$.next({
        ...this.state,
        connectOnStartup: newConnectOnStartup,
      });

      newConnectOnStartup && !this.state.isConnected && this.connect();
    });
  }

  public getWsConfig() {
    return this.store.state.wsConfig;
  }

  public async updateWsConfig(wsConfig: WebSocketConfig) {
    this.store.update({ wsConfig }).then(() => {
      this.connect();
    });
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


