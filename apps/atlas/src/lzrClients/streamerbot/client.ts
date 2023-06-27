import LzrStore from "@/lzrStore/lzrStore";
import { createLzrStore } from "@/utils/lzrStore";
import { waitForLZRRoom } from "@/utils/rtc";
import { StreamerbotClient, type StreamerbotAction } from "@streamerbot/client";
import { BehaviorSubject, pairwise, switchMap, of } from "rxjs";

const port = 6969;
export interface StreamerBotWebSocketConfig {
  host: string;
  endpoint: string;
  port: number;
}

export interface StreamerBotClientStore {
  wsConfig: StreamerBotWebSocketConfig;
  connectOnStartup: boolean;
}

type ConnectionStates = "startup" | "connecting" | "connected" | "disconnected";
export interface StreamerBotClientState {
  connectOnStartup: boolean;
  connectionState: ConnectionStates;
  isConnected: boolean;
  wsConfig: StreamerBotWebSocketConfig;
  actions: StreamerbotAction[];
}

export class StreamerBotClient {
  public wsSubscribers: any[] = [];
  public store: LzrStore<StreamerBotClientStore>;
  public client: StreamerbotClient;

  public isReady = false;
  public state: StreamerBotClientState;

  //state$ uses rxjs to subscribe to state changes
  public state$: BehaviorSubject<StreamerBotClientState>;

  //this var handles the polling for the connection state
  public connectionPoll: NodeJS.Timer;

  constructor() {
    createLzrStore("streamerbot", {
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
      connectionState: "startup",
      wsConfig: this.store.state.wsConfig,
      connectOnStartup: this.store.state.connectOnStartup,
      actions: [],
    };

    this.state$ = new BehaviorSubject<StreamerBotClientState>(this.state);

    this.startup();
  }

  async startup() {
    await this.state$
      .pipe(
        pairwise(),
        switchMap(([oldResult, newResult]) => {
          this.state = newResult;
          const newConnectionState = newResult.isConnected;
          const oldConnectionState = oldResult.isConnected;
          const conStateHasChanged = newConnectionState !== oldConnectionState;

          if(conStateHasChanged){
            newResult.isConnected && this.notifyWsSubscribers();
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

  public async handleWsConnection(data: any){
    const { actions } = await this.client.getActions();
    this.state$.next({
      ...this.state,
      isConnected: true,
      connectionState: "connected",
      actions,
    });

    this.client.on("Application.*", async (data) => {
      const {actions} = await this.client.getActions();
      this.state$.next({
        ...this.state,
        actions,
      });
    });

    //@ts-ignore
    await this.client.on("*", (data) => {
      console.debug("Any Event Data", data);
    });
  }

  public async handleWsOnData(data: any){

  }

  async connect(wsConfig?: StreamerBotWebSocketConfig) {
    this.state.isConnected && this.client.disconnect();
    const { endpoint, port, host } = wsConfig || this.store.state.wsConfig;

    this.client = this.client || new StreamerbotClient({
      host: host,
      port: port,
      endpoint: endpoint,
      subscribe: "*",
      retries: 0,
      autoReconnect: false,
      immediate: false,
      onConnect: this.handleWsConnection.bind(this),
      onData: this.handleWsOnData.bind(this),
      onDisconnect: () => {
        this.retryConnection();
        this.state$.next({
          ...this.state,
          isConnected: false,
          connectionState: "disconnected",
        });
      },
      onError: (err) => {
        console.error("Streamer.bot Client Error", err);
      },
    });

    this.state$.next({
      ...this.state,
      connectionState: "connecting",
    });

    this.client.connect();
  }

  public async retryConnection() {
    this.connectionPoll = setTimeout(async () => {
      const { isConnected, connectOnStartup,  } = this.state;

      //if connecting skip
      if (this.state.connectionState === "connecting") {
        return;
      }

      //if not connected and connect on startup is true, try to connect
      if (!isConnected && connectOnStartup) {
        await this.connect();
      } else {
        clearTimeout(this.connectionPoll);
      }
    }, 5000);
  }

  public toggleConnectOnStartup() {
    const { connectOnStartup } = this.store.state;
    const newConnectOnStartup = !connectOnStartup;

    this.store.update({ connectOnStartup: newConnectOnStartup }).then(() => {
      this.store.save();
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

  public async updateWsConfig(wsConfig: StreamerBotWebSocketConfig) {
    this.store.update({ wsConfig }).then(() => {
      this.connect();
    });
  }

  public async getActions() {
    return this.state.actions;
  }
}

//export the streamerbot Client as a singleton
export const sbClient = new StreamerBotClient();

export const getStreamerBotClient = () => sbClient;
