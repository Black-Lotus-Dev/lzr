import { CommandHandlerProps } from ".";
import { getChatClient } from "../../client";

export function listDiscord({ channel, user }: CommandHandlerProps) {
  const chatClient = getChatClient("bot");
  const discordLink = "https://discord.gg/uyb4hTCZWA";
  chatClient.say(channel, `@${user} Join the discord at ${discordLink}`);
}

export function listYoutube({ channel, user }: CommandHandlerProps) {
  const chatClient = getChatClient("bot");
  const youtubeLink =
    "https://www.youtube.com/channel/UCzaq91FM3Z7_JV2_wyL8Saw";
  chatClient.say(
    channel,
    `@${user} Sub to the Youtube my nigga ${youtubeLink}`
  );
}
