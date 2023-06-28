import { BehaviorSubject, of, pairwise, switchMap } from "rxjs";
import { reduxStore } from "@redux/store";
import {getLocalMusicClient, type LZRLocalMusicClient} from "./local";
import LZRSpotifyClient, { LZRSpotifySong } from "./spotify";
import _ from "lodash";
import { getUserId } from "@utils/user";
import { extractColors } from "extract-colors";
import { FinalColor } from "extract-colors/lib/types/Color";
import { LZRChannel } from "ggpo/types";
import toast from "react-hot-toast";
import { waitForLZRRoom } from "@/utils/rtc";
import LzrStore from "@/lzrStore/lzrStore";
import { createLzrStore } from "@/utils/lzrStore";

export interface BaseSong {
  name: string;
  artists: string[];
  album: {
    name: string;
    images: string[];
  };
  duration: number;
  progress: number;
  id: string;
}

interface LZRLocalSong extends BaseSong {
  path: string;
  itemType: "local";
}

export type LZRSongItem = LZRLocalSong | LZRSpotifySong | undefined;
export type LZRQueueItem = LZRSongItem & {
  id: string;
  requestedAt: Date;
  requestedBy: string;
};

interface LZRMusicState {
  currentSong?: LZRSongItem;
  songIsQueued: boolean;
  queuedSong?: LZRQueueItem;
  autoPlay: boolean;
  queuePaused: boolean;
  queue: LZRQueueItem[];
  history: LZRQueueItem[];
}

type CurrentSong =
  | {
      isPlaying: false;
      updatedAt: Date;
    }
  | {
      albumArtColorPalette: FinalColor[];
      song?: BaseSong;
      isPlaying?: true;
      updatedAt: Date;
    };

interface MusicStoreState {
  queuePaused: boolean;
  autoPlay: boolean;
  queue: LZRQueueItem[];
  history: LZRQueueItem[];
}

class LZRMusicClient {
  public store: LzrStore<MusicStoreState>;
  public local: LZRLocalMusicClient = getLocalMusicClient();
  public spotify: LZRSpotifyClient = new LZRSpotifyClient();
  public state: LZRMusicState;
  public state$: BehaviorSubject<LZRMusicState>;
  public sendSongRtc: LZRChannel<CurrentSong>["send"];
  public songQueueTimer = null;
  public songQueueInterval = 5000;
  private static instance: LZRMusicClient;
  
  public static getInstance(): LZRMusicClient {
    if (!LZRMusicClient.instance) {
      LZRMusicClient.instance = new LZRMusicClient();
    }
    return LZRMusicClient.instance;
  }

  constructor() {
    createLzrStore<MusicStoreState>("LZRmusic", {
      queuePaused: false,
      autoPlay: false,
      queue: [],
      history: []
    }).then((store) => {
      this.store = store;
      this.configureClient();
    });
  }

  configureClient() {
    this.state = {
      ...this.store.state,
      currentSong: undefined,
      songIsQueued: false,
      queuedSong: undefined,
    };

    this.state$ = new BehaviorSubject<LZRMusicState>(this.state);

    this.startup();

    waitForLZRRoom("currentSong", (room) => {
      
      const currentSongAction = room.createChannel<CurrentSong>("currentSong");
      this.sendSongRtc = currentSongAction.send;
    });
  }
  
  startup = async () => {
    this.state$
      .pipe(
        pairwise(),
        switchMap(([_, newResult]) => {
          reduxStore.dispatch.music.updateClientState(newResult);
          this.state = newResult;
          return of(null);
        })
      )
      .subscribe();

    // await this.local.startup();
    await this.spotify.startup(
      this.currentSongUpdater.bind(this),
    );

    setInterval(this.handleSongQueue, this.songQueueInterval);
  };

  public async currentSongUpdater(isPlaying: boolean, newSong: LZRSongItem) {

    //check if theres a song currently queued
    const { queuedSong, queue } = this.state;
    const shouldRefreshQueuedSong = queuedSong && queuedSong.id === newSong?.id;

    this.state$.next({
      ...this.state,
      currentSong: newSong,
      songIsQueued: shouldRefreshQueuedSong ? false : this.state.songIsQueued,
      queuedSong: shouldRefreshQueuedSong ? undefined : this.state.queuedSong,
    });

    this.sendSongRtc && this.sendCurrentSong(isPlaying, newSong);
  }

  playSong = (song: LZRQueueItem): void => {
    const { itemType } = song;
    if (itemType === "spotify") {
      this.spotify.addToQueueThenPlay(song.uri);
      toast(`${song.name} Requested by ${song.requestedBy}`);
    }
  };

  queueSong = (song: LZRQueueItem) => {
    const { queue } = this.state;

    if (song.itemType === "spotify") {
      toast(`${song.name} Requested by ${song.requestedBy}`);
      this.spotify.api.player.addToQueue(song.uri);
    }

    const newQueue = _.filter(queue, (item) => item.id !== song.id);
    //remove song from queue
    this.state$.next({
      ...this.state,
      queue: newQueue,
      queuedSong: song,
      songIsQueued: true,
    });
  }

  handleSongQueue = async (): Promise<void> => {
    const { currentSong, queue } = this.state;
    //check if there is a song playing
    const isPlaying = currentSong !== undefined;
    const songsAreQueued = queue.length > 0;
    const queuedSong = queue[0];

    if(!isPlaying){
      //no song playing
      if(!songsAreQueued){
        //no songs in queue
        return;
      }

      //songs in queue so queue first song
      this.playSong(queuedSong);
      return;
    }

    if(currentSong === undefined){
      //no song but were playing so queue the next song
      this.queueSong(queuedSong);
      return;
    }

    //song is playing so check the remaining time
    const remainingTime = currentSong.duration - currentSong.progress;

    if(remainingTime <= (this.songQueueInterval)){
      //song is almost over so queue next song
      this.queueSong(queuedSong);
      return;
    }
  };

  sendCurrentSong = async (isPlaying: boolean, song: BaseSong) => {
    const { currentSong } = this.state;

    const isSameSong = currentSong?.name === song?.name;
    const isSong = song !== undefined;

    if (!isPlaying) {
      //stop playing songs
      if (!isSameSong || !isSong) {
        this.sendSongRtc({
          isPlaying: false,
          updatedAt: new Date(),
        });
      }
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    const albumArtColorPalette =
      song !== null && song.album.images.length > 0
        ? await extractColors(song.album.images[0], {
            crossOrigin: "anonymous",
          })
        : undefined;

    this.sendSongRtc({
      isPlaying,
      song: song,
      albumArtColorPalette,
      updatedAt: new Date(),
    });
  };

  songSearch = async (data: string): Promise<LZRSongItem> => {
    if (this.spotify.state.isConnected) {
      return await this.spotify.songSearch(data);
    }
  };

  addSongToQueue = async (song: LZRSongItem, user: string) => {
    toast(`${song.name} Queued by ${user}`);

    const newQueue = [
      ...this.state.queue,
      {
        id: _.uniqueId(`${song.itemType}`),
        ...song,
        requestedBy: user,
        requestedAt: new Date(),
      },
    ];

    this.state$.next({
      ...this.state,
      queue: newQueue,
    });
  };

  setAutoPlay = (data: boolean) => {
    this.state$.next({
      ...this.state,
      autoPlay: data,
    });
  };
}

const getMusicClient = () => LZRMusicClient.getInstance();
export { getMusicClient, type LZRMusicClient, type LZRMusicState };
