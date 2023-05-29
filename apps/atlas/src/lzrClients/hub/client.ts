import LzrStore from "@/lzrStore/lzrStore";
import { HubEventHandler } from "./actions";
import ObsAction from "./action";
import { waitForLZRRoom } from "@/utils/rtc";
import toast from "react-hot-toast";
import { createLzrStore } from "@/utils/lzrStore";
import OBSWebSocket from "obs-websocket-js";
import {
  OBSClient,
  getObsClient,
  getObsWs,
  waitForObsClient,
} from "../obs/client";
import { BehaviorSubject, of, pairwise, switchMap } from "rxjs";
import {
  getChatClient,
  getTwitchClient,
  mainTwitchClient,
} from "../twitch/client";
import { ChatClient } from "@twurple/chat/lib";
import twitchChatHandler from "../twitch/chat/commandHandler";
import { LZRHost } from "ggpo";

interface ObsScenes {
  sceneIndex: number;
  sceneName: string;
  sources: ObsSources[];
}

interface ObsSources {
  sourceIndex: number;
  sourceName: string;
  sceneName: string;
}

interface HubStore {
  scenes: ObsScenes[];
  sources: ObsSources[];
  actions: string[];
}

class LZRHub {
  public store: LzrStore<HubStore>;
  public lzrRoom: LZRHost;
  public obsClient: OBSClient;

  public viewerCountListener: NodeJS.Timer;
  public viewerCount: number = 0;
  public followCount: number = 0;
  public scenes: ObsScenes[] = [];
  public sources: ObsSources[] = [];
  public actions: ObsAction[] = [];
  public chat: ChatClient;

  public state = {
    obsIsConnected: false,
    hubIsConnected: false,
  };

  //state$ uses rxjs to subscribe to state changes
  public state$ = new BehaviorSubject<typeof this.state>(this.state);

  public async startup() {
    this.store = await createLzrStore("hub");
    this.startLzrHub();

    //start twitch chat listener
    this.startTwitchBot();

    this.actions = this.store.state.actions?.map((savedAction) =>
      new ObsAction().loadAction(savedAction)
    );

    this.state$
      .pipe(
        pairwise(),
        switchMap(([oldResult, newResult]) => {
          this.state = newResult;

          if (oldResult.obsIsConnected !== newResult.obsIsConnected) {
            if (newResult.obsIsConnected) {
              this.startObsBot();
            }
          }

          if (oldResult.hubIsConnected !== newResult.hubIsConnected) {
            if (newResult.hubIsConnected) {
              toast.success("LZR Hub Connected");
            } else {
              toast.error("LZR Hub Disconnected");
            }
          }

          //check if any connection states have changed.
          //if any changes any both are true then

          return of(null);
        })
      )
      .subscribe();
  }

  async startObsBot() {
    this.getScenesAndSources();
  }

  startLzrHub() {
    waitForObsClient(() => {
      if (this.state.obsIsConnected) return;

      this.obsClient = getObsClient();
      this.state$.next({ ...this.state, obsIsConnected: true });
    });

    //wait for the obs hub to connect
    waitForLZRRoom("hub", (room) => {
      this.lzrRoom = room;
      const hubChannel = room.createChannel<string>("hub");

      this.getFollowerCount();
      this.startViewerCountListener();

      hubChannel.get(async (res) => {
        const { event, data } = JSON.parse(res);

        if (event === "connect-request") {
          this.state$.next({ ...this.state, hubIsConnected: true });

          hubChannel.send(JSON.stringify({ event: "connect-request" }));

          if (this.state.obsIsConnected) return;

          this.obsClient = getObsClient();

          this.state$.next({ ...this.state, obsIsConnected: true });
        }
        if (event === "obs-get-settings") {
          // const { wsIp, wsPort, wsPassword } = this.store.state;
          // const settings = { wsIp, wsPort, wsPassword };
          // hubChannel.send(
          //   JSON.stringify({ event: "obs-get-settings", settings })
          // );
        } else {
          HubEventHandler(event as string, data);
        }
      });

      hubChannel.send(JSON.stringify({ event: "connect-request", data: "" }));
    });
  }

  async getScenesAndSources() {
    if (!this.state.obsIsConnected) return;

    this.scenes = (await this.obsClient.obsWs.call("GetSceneList"))
      .scenes as unknown as ObsScenes[];

    this.getSourcesForScenes();
  }

  private async getSourcesForScenes() {
    //make a list of promises to get all the sources for each scene
    const sceneSources = this.scenes.map(async (scene) => {
      try {
        const sources = await this.obsClient.obsWs.call("GetSceneItemList", {
          sceneName: scene.sceneName,
        });
        this.sources[scene.sceneName] =
          sources.sceneItems as unknown as ObsSources[];
      } catch (error) {
        console.error(
          `An error occurred when trying to get sources for ${scene.sceneName} scene`
        );
      }
    });

    //wait for all the promises to resolve
    await Promise.allSettled(sceneSources);
  }

  public async saveActions() {
    this.store.update({
      actions: this.actions.map((action) => action.saveAction()),
    });
  }

  //twitch functions
  public startTwitchBot() {
    this.startChatListener();
  }

  private startTwitchObsActions() {}

  startChatListener() {
    //pause for 3 seconds to allow the obs bot to connect
    setTimeout(() => {
      this.chat = getChatClient();
      this.chat.quit();
      this.chat.connect().then(() => {
        this.chat.onMessage(twitchChatHandler);
      });
    }, 1000);
  }

  async startViewerCountListener() {
    const viewerCountAction = this.lzrRoom.createChannel<number>("viewerCount");
    this.viewerCountListener = setInterval(async () => {
      const twitchChannelId = mainTwitchClient.account.id;
      let viewerCount = 0;
      const stream = await mainTwitchClient.api.streams.getStreamByUserId(
        twitchChannelId
      );

      if (stream !== null) viewerCount = stream.viewers;

      if (this.viewerCount === viewerCount) return;

      toast("Viewer count: " + viewerCount);
      this.viewerCount = viewerCount;
      viewerCountAction.send(viewerCount);
    }, 10000);
  }

  private stopViewerCountListener() {
    this.viewerCountListener && clearInterval(this.viewerCountListener);
  }

  async getFollowerCount(lastCount: number = 0) {
    const followerChannel = this.lzrRoom.createChannel<number>("followCount");
    const twitchChannelId = mainTwitchClient.account.id;
    const follows = await mainTwitchClient.api.channels.getChannelFollowers(
      twitchChannelId,
      twitchChannelId
    );
    const { total } = follows;

    if (lastCount === total) return;
    followerChannel.send(total);

    //recall every 5 minutes
    setTimeout(() => {
      this.getFollowerCount(total);
    }, 300000);
  }
}

const hub = new LZRHub();

export { hub, type LZRHub };
