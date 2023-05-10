/* eslint-disable import/no-cycle */
import { TwitchPrivateMessage } from "@twurple/chat/lib/commands/TwitchPrivateMessage";
import { twitchMusicCommandHandler } from "./commands/music";
import { lzrCommandHandler } from "./commands/lzr";
import { reduxStore } from "@redux/store";
import {
  getChatClient,
  botTwitchClient,
  getTwitchAccountName,
} from "../client";
import ChatOverlayHandler from "./chat-overlay";

export type TwitchCommand = {
  name: string;
  args: string[];
  msg: TwitchPrivateMessage;
  user: string;
};

// function isReplyToBot(msg: TwitchPrivateMessage, chatClient: ChatClient) {
//   const replyToBot = msg.replyTo === chatClient._userId;
//   return replyToBot;
// }

var chatOverlayHandler: ChatOverlayHandler;
export default async function twitchChatHandler(
  channel: string,
  user: string,
  message: string,
  msg: TwitchPrivateMessage
) {
  const chatClient = getChatClient("bot");

  const isBot =
    user.toLowerCase() === getTwitchAccountName("bot").toLowerCase();

  // const isReply = isReplyToBot(msg, chatClient);

  if (message.startsWith("!")) {
    const { twitch } = reduxStore.getState();
    //ignore messages from the bot
    if (
      botTwitchClient.account &&
      user.toLowerCase() === botTwitchClient.account.name.toLowerCase()
    )
      return;

    const commandParts = message
      .slice(1)
      .split(" ")
      .map((part) => part.trim());
    const commandName = commandParts[0];
    const commandArgs = commandParts.slice(1);

    const command: TwitchCommand = {
      name: commandName,
      args: commandArgs,
      msg,
      user,
    };

    //use list of command handlers to create a list of promises to run in parallel
    const commandHandlers = [twitchMusicCommandHandler, lzrCommandHandler];
    const commandHandlerPromises = commandHandlers.map((handler) =>
      handler(command)
    );
    await Promise.all(commandHandlerPromises);
  } else if (!isBot) {
    if (!chatOverlayHandler) {
      chatOverlayHandler = new ChatOverlayHandler();
    }

    chatOverlayHandler.addMessage(msg);
  }
}
