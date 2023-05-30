import { getChatClient } from "../../client";
import { TwitchCommand } from "../commandHandler";
import { startWtpGame } from "../../../../games/wtp/wtp";
import { listDiscord, listYoutube } from "./lzr";
import {
  getSongHistory,
  getSongQueue,
  songRequest,
  getCurrentSong,
  songSearch,
} from "./music";

export type CommandHandlerProps = {
  channel: string;
  command: TwitchCommand;
  user: string;
};

export type CommandHandler = (props: CommandHandlerProps) => void;

export interface Command {
  commands: string[];
  examples?: string[];
  needsMusic?: boolean;
  needsTwitch?: boolean;
  handler: CommandHandler;
}

export const commands: Command[] = [
  {
    commands: ["discord", "disc"],
    handler: listDiscord,
  },
  {
    commands: ["youtube", "yt"],
    handler: listYoutube,
  },
  {
    commands: ["com", "commands"],
    handler: listCommands,
  },
  {
    commands: ["wtp"],
    handler: startWtpGame,
  },
  {
    commands: ["shist", "sh"],
    handler: getSongHistory,
  },
  {
    commands: ["squeue", "sq"],
    handler: getSongQueue,
  },
  {
    commands: ["songrequest", "sr"],
    examples: ["!sr crust", "!songrequest gimmie the loot biggie smalls"],
    handler: songRequest,
  },
  {
    commands: ["song", "s"],
    handler: getCurrentSong,
  },
  {
    commands: ["songsearch", "ss"],
    examples: ["!ss crust", "!songsearch gimmie the loot biggie smalls"],
    handler: songSearch,
  },
];

function listCommands({ channel, user }: CommandHandlerProps) {
  const chatClient = getChatClient("bot");
  let responseText = "";
  commands.forEach((command) => {
    responseText += `${command.commands.join(", ")}: ${command.examples.join(
      ", "
    )}`;
  });

  chatClient.say(
    channel,
    `@${user} the available commands are: ${responseText}`
  );
}
