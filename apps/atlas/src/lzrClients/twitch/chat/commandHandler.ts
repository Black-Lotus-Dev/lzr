/* eslint-disable import/no-cycle */
import { TwitchPrivateMessage } from "@twurple/chat/lib/commands/TwitchPrivateMessage";
import {
  getChatClient,
  botTwitchClient,
  getTwitchAccountName,
} from "../client";
import ChatOverlayHandler from "./chat-overlay";
import { commands } from "./commands";
import { getMusicClient } from "@/lzrClients/music/client";

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
  const musicClient = getMusicClient();
  const chatClient = getChatClient("bot");
  const isBot =
    user.toLowerCase() === getTwitchAccountName("bot").toLowerCase();

  // const isReply = isReplyToBot(msg, chatClient);

  if (message.startsWith("!")) {
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

    let matchingCommands = commands.filter((cmd) =>
      cmd.commands.includes(command.name)
    );

    if (matchingCommands.length === 0) return;

    const comNeedsMusicClient = matchingCommands.some((cmd) => cmd.needsMusic);

    if (comNeedsMusicClient && !musicClient.spotify.state.isConnected) {
      //if not connected then respond with a message saying so
      const channel = command.msg.target.value.split("#")[1];
      const user = command.user;
      chatClient.say(
        channel,
        `@${user} i'm not connected to spotify apparently. Start bitching at me to fix it`
      );

      //remove all commands that need the music client
      matchingCommands = matchingCommands.filter((cmd) => !cmd.needsMusic);
    }

    //run any commands that match in parallel
    await Promise.all(
      matchingCommands.map((cmd) => cmd.handler({ channel, command, user }))
    );
  } else if (!isBot) {
    if (!chatOverlayHandler) {
      chatOverlayHandler = new ChatOverlayHandler();
    }

    chatOverlayHandler.addMessage(msg);
  }
}
