import { TwitchCommand } from "../commandHandler";
import { getChatClient } from "../../client";
import { musicClient } from "@lzrClients/music/client";
import { CommandHandlerProps } from ".";

export async function songSearch({
  channel,
  command,
  user,
}: CommandHandlerProps) {
  const chatClient = getChatClient("bot");
  const song = await musicClient.songSearch(command.args.join(" "));

  chatClient.say(
    channel,
    `@${user} ayo i found this: ${song.name} by ${song.artists.join(", ")}`
  );
}

export async function songRequest({
  channel,
  command,
  user,
}: CommandHandlerProps) {
  const chatClient = getChatClient("bot");
  const songRes = await musicClient.songSearch(command.args.join(" "));
  musicClient.addSongToQueue(songRes, user);

  chatClient.say(
    channel,
    `@${user} requested ${songRes.name} by ${songRes.artists.join(", ")}`
  );
}

export function getCurrentSong({ channel, user }: CommandHandlerProps) {
  const chatClient = getChatClient("bot");
  const currentSong = musicClient.state.currentSong;
  if (currentSong) {
    chatClient.say(
      channel,
      `@${user} the current song is ${
        currentSong.name
      } by ${currentSong.artists.join(", ")}`
    );
  } else {
    chatClient.say(channel, `@${user} there is no song playing`);
  }
}

export function getNextSongInQueue({ channel, user }: CommandHandlerProps) {
  const chatClient = getChatClient("bot");
  const queue = musicClient.state.queue;
  if (queue.length > 0) {
    const nextSong = queue[0];
    chatClient.say(
      channel,
      `@${user} the next song is ${nextSong.name} by ${nextSong.artists.join(
        ", "
      )}`
    );
  } else {
    chatClient.say(channel, `@${user} there is no song in the queue`);
  }
}

export function getSongHistory({ channel, user }: CommandHandlerProps) {
  const chatClient = getChatClient("bot");
  const history = musicClient.state.history;
  if (history.length > 0) {
    const allSongs = history.map((song) => {
      return `${song.name} by ${song.artists.join(", ")}`;
    });

    chatClient.say(
      channel,
      `@${user} the last songs played were: ${allSongs.join(", ")}`
    );
  } else {
    chatClient.say(channel, `@${user} there is no song in the history`);
  }
}

export function getSongQueue({ channel, user }: CommandHandlerProps) {
  const chatClient = getChatClient("bot");

  const queue = musicClient.state.queue;
  if (queue.length > 0) {
    const allSongs = queue.map((song) => {
      return `${song.name} by ${song.artists.join(", ")}`;
    });
    chatClient.say(
      channel,
      `@${user} the next songs in the queue are: ${allSongs.join(", ")}`
    );
  } else {
    chatClient.say(channel, `@${user} there is no song in the queue`);
  }
}