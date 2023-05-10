import { getApiClient } from "@lzrClients/twitch/client";
import { LZRChannel } from "ggpo";
import { TwitchPrivateMessage } from "@twurple/chat/lib/commands/TwitchPrivateMessage";
import { ApiClient, ChatEmote } from "@twurple/api/lib";
import chroma from "chroma-js";
import { waitForLzrRoom } from "@/utils/rtc";

export interface TwitchMsg {
  id: string;
  userId: string;
  userName: string;
  color: string;
  userImg: string;
  message: string;
  msg: TwitchPrivateMessage;
  timeStamp: number;
}
interface ParsedMessageEmotePart {
  type: "emote";
  position: number;
  length: number;
  id: string;
  name: string;
  displayInfo: ChatEmote;
}

class ChatOverlayHandler {
  public chatAction: LZRChannel<TwitchMsg>;
  public twitchApiClient: ApiClient;

  constructor() {
    this.waitForRoom();
  }

  //this function should try waiting for the room and if it fails it should try again
  private waitForRoom() {
    try {
      //try waiting for the room
      waitForLzrRoom("chat-overlay", (host) => {
        this.chatAction = host.createChannel<TwitchMsg>("chat");
      });
    } catch (e) {
      //if it fails, try again in 5 seconds
      setTimeout(() => {
        this.waitForRoom();
      }, 5000);
    }
  }

  private setApiClient() {
    if (!this.twitchApiClient) {
      this.twitchApiClient = getApiClient("main");
    }
  }

  private parseTwitchMessage(msg: TwitchPrivateMessage) {
    //use the message and replace all the emotes with the correct image
    let message = msg.content.value;
    const emotes = msg
      .parseEmotes()
      .filter((x) => x.type === "emote") as ParsedMessageEmotePart[];
    if (emotes.length > 0) {
      emotes.forEach((emote) => {
        const emoteUrl = emote.displayInfo.getUrl({
          size: "1.0",
          animationSettings: "default",
          backgroundType: "light",
        });

        message = message.replace(emote.name, `|%|${emoteUrl}|%%|`);
      });
    }

    return message;
  }

  async addMessage(msg: TwitchPrivateMessage) {
    if (!this.chatAction.send) return;

    this.setApiClient();
    const user = await this.twitchApiClient.users.getUserById(
      msg.userInfo.userId
    );
    const userColor = msg.userInfo.color
      ? msg.userInfo.color
      : chroma.random().hex();
    const userImg = user.profilePictureUrl;

    const message = this.parseTwitchMessage(msg);

    const twitchMsg: TwitchMsg = {
      id: msg.id,
      userId: msg.userInfo.userId,
      userName: msg.userInfo.displayName,
      color: userColor,
      userImg,
      message,
      msg,
      timeStamp: msg.date.getTime(),
    };

    this.chatAction.send(twitchMsg);
  }
}

export default ChatOverlayHandler;
