import LzrStore from "@/lzrStore/lzrStore";
import { createLzrStore } from "@/utils/lzrStore";
import { waitForLZRRoom } from "@/utils/rtc";
import { StreamerbotClient, type StreamerbotAction } from "@streamerbot/client";
import toast from "react-hot-toast";
import { BehaviorSubject, pairwise, switchMap, of } from "rxjs";

const port = 6969;
interface WebSocketConfig {
  host: string;
  endpoint: string;
  port: number;
}

interface StreamerBotClientStore {
  wsConfig: WebSocketConfig;
}

interface StreamerBotClientState {
  isConnected: boolean;
  wsConfig: WebSocketConfig;
  actions: StreamerbotAction[];
}

export class StreamerBotClient {
  public wsSubscribers: any[] = [];
  public store: LzrStore<StreamerBotClientStore>;
  public client = new StreamerbotClient({
    immediate: false,
  });

  public isReady = false;
  public state: StreamerBotClientState;

  //state$ uses rxjs to subscribe to state changes
  public state$: BehaviorSubject<StreamerBotClientState>;

  //this var handles the polling for the connection state
  public connectionPoll: NodeJS.Timer;

  constructor() {
    createLzrStore("obs", {
      wsConfig: {
        host: "127.0.0.1",
        endpoint: "/",
        port,
      },
    }).then((store) => {
      this.store = store as LzrStore<StreamerBotClientStore>;
      this.configureClient();
    });
  }

  configureClient() {
    this.state = {
      isConnected: false,
      wsConfig: this.store.state.wsConfig,
      actions: [],
    };

    this.state$ = new BehaviorSubject<StreamerBotClientState>(this.state);

    this.startup();
  }

  async startup() {
    toast("Starting streamerbot client...");
    const { isConnected } = await this.state;
    if (isConnected) this.client.disconnect();

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

    if (!!this.store.state.wsConfig) {
      this.connect();
    }
  }

  async notifyWsSubscribers() {
    this.wsSubscribers.forEach((subscriber) => {
      subscriber();
    });
  }

  async connect(wsConfig?: WebSocketConfig) {
    const { endpoint, port, host } = wsConfig || this.store.state.wsConfig;

    this.client = new StreamerbotClient({
      host: host,
      port: port,
      endpoint: endpoint,
      subscribe: "*",
    });

    //@ts-ignore
    await this.client.on("*", (data) => {
      console.log("Any Event Data", data);
    });

    const { actions } = await this.client.getActions();

    //update state
    this.state$.next({
      ...this.state,
      isConnected: true,
      actions,
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
}

//export the obsClient as a singleton
export const sbClient = new StreamerBotClient();

export const getStreamerBotClient = () => sbClient;
