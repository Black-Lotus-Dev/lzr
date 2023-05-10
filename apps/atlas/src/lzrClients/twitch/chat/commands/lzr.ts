import { startWtpGame } from "../../../../games/wtp/wtp";
import { getChatClient } from "../../client";
import { TwitchCommand } from "../commandHandler";

const allCommands = [
  {
    commands: ["youtube", "yt"],
    examples: [],
  },
  {
    commands: ["discord", "disc"],
    examples: [],
  },
  {
    commands: ["sh", "shist"],
    examples: [],
  },
  {
    commands: ["sq", "squeue"],
    examples: [],
  },
  {
    commands: ["sr", "songrequest"],
    examples: ["!sr crust", "!songrequest gimmie the loot biggie smalls"],
  },
  {
    commands: ["song"],
    examples: [],
  },
  {
    commands: ["ss", "songsearch"],
    examples: ["!ss crust", "!songsearch gimmie the loot biggie smalls"],
  },
];

export function lzrCommandHandler(command: TwitchCommand) {
  const channel = command.msg.target.value.split("#")[1];
  const user = command.user;

  const chatClient = getChatClient("bot");

  function listCommands() {
    let responseText = "";
    allCommands.forEach((command) => {
      responseText += `${command.commands.join(", ")}: ${command.examples.join(
        ", "
      )}`;
    });

    chatClient.say(
      channel,
      `@${user} the available commands are: ${responseText}`
    );
  }

  function listDiscord() {
    const discordLink = "https://discord.gg/uyb4hTCZWA";
    chatClient.say(channel, `@${user} Join the discord at ${discordLink}`);
  }

  function listYoutube() {
    const youtubeLink =
      "https://www.youtube.com/channel/UCzaq91FM3Z7_JV2_wyL8Saw";
    chatClient.say(
      channel,
      `@${user} Sub to the Youtube my nigga ${youtubeLink}`
    );
  }

  const commands = {
    discord: {
      commands: ["discord", "disc"],
      handler: listDiscord,
    },
    youtube: {
      commands: ["youtube", "yt"],
      handler: listYoutube,
    },
    listCommands: {
      commands: ["com", "commands"],
      handler: listCommands,
    },
    wtp: {
      commands: ["wtp"],
      handler: startWtpGame,
    },
  };

  //get command key based on the command name
  const commandKey = Object.keys(commands).find((key) =>
    commands[key].commands.includes(command.name)
  );

  if (!commandKey) return;

  //get command handler based on the command key
  const commandHandler = commands[commandKey].handler;

  //run the command handler
  commandHandler();
}
