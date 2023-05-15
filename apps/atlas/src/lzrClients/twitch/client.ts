import { ApiClient, HelixPrivilegedUser } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import {
	AccessToken,
	RefreshingAuthProvider,
	exchangeCode,
} from "@twurple/auth";
import createRandString from "@utils/createRandString";
import twitchAuthLogin from "@api/twitch/login";
import { TwitchAccountType } from "@lzrTypes/twitch/index";

import { reduxStore } from "@redux/store";
import twitchChatHandler from "./chat/commandHandler";
import toast from "react-hot-toast";
import { hostLzrRoom, LZRHost } from "@black-lotus-dev/ggpo";
import { handleFreshUserLogin, handleNewUserAccount } from "@api/user/user";
import LzrStore from "@/lzrStore/lzrStore";
import { createLzrStore } from "@/utils/lzrStore";
import { getUserId } from "@/utils/user";
import { waitForLzrRoom } from "@/utils/rtc";

interface TwitchStore {
  accessToken: string;
  refreshToken: string;
  userId: string;
  state: string;
  account: HelixPrivilegedUser;
}

class TwitchClient {
  public store: LzrStore<TwitchStore>;
  public authProvider: RefreshingAuthProvider = new RefreshingAuthProvider({
    clientId: import.meta.env.VITE_TWITCH_CLIENT_ID,
    clientSecret: import.meta.env.VITE_TWITCH_CLIENT_SECRET,
    onRefresh: this.refreshAuth.bind(this),
  });

  public isConnected: boolean = false;

  public channelName: string = "";
  public chatListenerTimeout: NodeJS.Timeout;

  public api: ApiClient = new ApiClient({
    authProvider: this.authProvider,
  });

  public chat: ChatClient = new ChatClient({
    authProvider: this.authProvider,
  });

  public eventWs: EventSubWsListener;

  public account: HelixPrivilegedUser;

  constructor(private readonly accType: TwitchAccountType) {}

  async startup() {
    this.store = await createLzrStore(`twitch-${this.accType}`);
    await this.autoLogin().finally(() => {
      reduxStore.dispatch.twitch.setClientIsReady(this.accType);
    });
  }

  public getMainChannelLogin = () => {
    return mainTwitchClient.account.name;
  };

  private async refreshAuth(userId: string, token: AccessToken) {
    if (!this.account) return;

    const { accessToken, refreshToken } = token;
    this.store.update({ accessToken, refreshToken, userId });

    this.authProvider.addUserForToken(token, ["chat"]);

    this.api = new ApiClient({ authProvider: this.authProvider });
    this.eventWs = new EventSubWsListener({
      apiClient: this.api,
    });

    const channel = this.getMainChannelLogin();
    this.chat = new ChatClient({
      authProvider: this.authProvider,
      channels: [channel],
    });
  }

  private async autoLogin() {
    if (!this.store.state) return;
    const { accessToken, refreshToken, userId } = this.store.state;

    if (accessToken && refreshToken) {
      try {
        await this.authProvider.addUserForToken(
          {
            accessToken,
            refreshToken,
            expiresIn: 0,
            obtainmentTimestamp: 0,
          },
          ["chat"]
        );

        this.isConnected = true;
      } catch (e) {
        return;
      }

      this.api = new ApiClient({ authProvider: this.authProvider });
      this.eventWs = new EventSubWsListener({
        apiClient: this.api,
      });

      const twitchUser = await this.api.users.getAuthenticatedUser(
        userId,
        true
      );

      this.account = twitchUser;
      this.store.update({ account: twitchUser });

      const channel =
        this.accType === "main"
          ? this.account.name
          : this.getMainChannelLogin();
      this.chat = new ChatClient({
        authProvider: this.authProvider,
        channels: [channel],
      });

      reduxStore.dispatch.twitch.setVal({
        [`${this.accType}IsConnected`]: true,
      });
    }
  }

  private listenToAuth(state: string) {
    const authHost = hostLzrRoom("auth", state);

    const lzrAuthChannel = authHost.createChannel<string>("auth");

    lzrAuthChannel.get(async (code) => {
      toast("code received: " + code);

      const tokenData = await exchangeCode(
        import.meta.env.VITE_TWITCH_CLIENT_ID,
        import.meta.env.VITE_TWITCH_CLIENT_SECRET,
        code,
        import.meta.env.VITE_AUTH_REDIRECT_URI
      );

      const userId = await this.authProvider.addUserForToken(tokenData, [
        "chat",
      ]);

      const { accessToken, refreshToken } = tokenData;

      this.api = new ApiClient({ authProvider: this.authProvider });

      this.account = await this.api.users.getAuthenticatedUser(userId, true);

      this.store.update({
        accessToken,
        refreshToken,
        userId,
        account: this.account,
      });

      this.chat = new ChatClient({
        authProvider: this.authProvider,
        channels: [this.account.name],
      });

      //if this is the main account then login to firebase
      if (this.accType === "main") {
        const token = await handleNewUserAccount();
        lzrAuthChannel.send(token);
        handleFreshUserLogin(token);
      } else {
        reduxStore.dispatch.lzr.setIsLoading(false);

        toast.success("Bot account connected!", {
          icon: "🤖",
          style: {
            backgroundColor: "#00ea5e",
            fontWeight: "bold",
          },
        });
      }

      this.isConnected = true;
      reduxStore.dispatch.twitch.setVal({
        [`${this.accType}IsConnected`]: true,
      });

      setTimeout(() => {
        authHost.closeRoom();
      }, 1000);
    });
  }

  async freshLogin() {
    reduxStore.dispatch.lzr.setIsLoading(true);
    const state = createRandString();

    await this.store.update({ state });

    this.listenToAuth(state);
    twitchAuthLogin(state);
  }
}

const mainTwitchClient = new TwitchClient("main");
const botTwitchClient = new TwitchClient("bot");

const getTwitchClient = (accType: TwitchAccountType = "main") =>
  accType === "main" ? mainTwitchClient : botTwitchClient;

function getTwitchAccountName(accType: TwitchAccountType = "main"): string {
  if (accType === "bot" && !botTwitchClient.account)
    return mainTwitchClient.account.name;

  if (accType === "main") return mainTwitchClient.account.name;
  if (accType === "bot") return botTwitchClient.account.name;
}

function getApiClient(accType: TwitchAccountType = "main"): ApiClient {
  if (accType === "bot" && !botTwitchClient.account)
    return mainTwitchClient.api;

  if (accType === "main") return mainTwitchClient.api;
  if (accType === "bot") return botTwitchClient.api;
}

function getChatClient(accType: TwitchAccountType = "bot"): ChatClient {
  if (accType === "bot" && !botTwitchClient.account)
    return mainTwitchClient.chat;

  if (accType === "main") return mainTwitchClient.chat;
  if (accType === "bot") return botTwitchClient.chat;
}

export {
  getTwitchClient,
  getTwitchAccountName,
  mainTwitchClient,
  botTwitchClient,
  getApiClient,
  getChatClient,
  type TwitchClient,
};
