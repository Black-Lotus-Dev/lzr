import { TwitchCommand } from "../commandHandler";
import { getChatClient } from "../../client";
import { musicClient } from "@lzrClients/music/client";

export async function twitchMusicCommandHandler(command: TwitchCommand) {
  if (!musicClient.spotify.state.isConnected) {
    //if not connected then respond with a message saying so
    const chatClient = getChatClient("bot");
    const channel = command.msg.target.value.split("#")[1];
    const user = command.user;
    chatClient.say(
      channel,
      `@${user} i'm not connected to spotify apparently. Start bitching at me to fix it`
    );
  }
  const channel = command.msg.target.value.split("#")[1];
  const user = command.user;

  const chatClient = getChatClient("bot");
  const { songSearch: lzrSongSearch, addSongToQueue } = musicClient;

  async function songSearch() {
    const song = await lzrSongSearch(command.args.join(" "));

    chatClient.say(
      channel,
      `@${user} ayo i found this: ${song.name} by ${song.artists.join(", ")}`
    );
  }

  async function songRequest() {
    const songRes = await lzrSongSearch(command.args.join(" "));
    addSongToQueue(songRes, user);

    chatClient.say(
      channel,
      `@${user} requested ${songRes.name} by ${songRes.artists.join(", ")}`
    );
  }

  function getCurrentSong() {
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

  function getNextSongInQueue() {
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

  function getSongHistory() {
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

  function getSongQueue() {
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

  const commands = {
    history: {
      commands: ["shist", "sh"],
      handler: getSongHistory,
    },
    queue: {
      commands: ["squeue", "sq"],
      handler: getSongQueue,
    },
    request: {
      commands: ["songrequest", "sr"],
      handler: songRequest,
    },
    song: {
      commands: ["song", "s"],
      handler: getCurrentSong,
    },
    search: {
      commands: ["songsearch", "ss"],
      handler: songSearch,
    },
  };

  //create list of promises to run in parallel using the commands list in the commands object

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
