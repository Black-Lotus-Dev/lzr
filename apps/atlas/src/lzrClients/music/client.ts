import { BehaviorSubject, of, pairwise, switchMap } from "rxjs";
import { reduxStore } from "@redux/store";
import LZRLocalClient from "./local";
import LZRSpotifyClient, { LZRSpotifySong } from "./spotify";
import _ from "lodash";
import { getUserId } from "@utils/user";
import { extractColors } from "extract-colors";
import { FinalColor } from "extract-colors/lib/types/Color";
import { LZRChannel, LZRHost } from "ggpo";
import toast from "react-hot-toast";
import { waitForLzrRoom } from "@/utils/rtc";

export interface BaseSong {
  name: string;
  artists: string[];
  album: {
    name: string;
    images: string[];
  };
  duration: number;
  progress: number;
}

interface LZRLocalSong extends BaseSong {
  path: string;
  itemType: "local";
}

export type LZRSongItem = LZRLocalSong | LZRSpotifySong;
export type LZRQueueItem = LZRSongItem & {
  id: string;
  requestedAt: Date;
  requestedBy: string;
};

export interface LZRMusicState {
  currentSong?: LZRSongItem;
  autoPlay: boolean;
  queue: LZRQueueItem[];
  history: LZRQueueItem[];
  currentIndex: number;
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

class LZRMusicClient {
  public local: LZRLocalClient = new LZRLocalClient();
  public spotify: LZRSpotifyClient = new LZRSpotifyClient();

  public state: LZRMusicState = {
    autoPlay: true,
    queue: [],
    history: [],
    currentIndex: -1,
  };

  public songProgressBuffer = 5000;
  public songQueueBuffer = 3000;
  public sendSongRtc: LZRChannel<CurrentSong>["send"];

  public state$ = new BehaviorSubject<LZRMusicState>(this.state);

  public playNextSongListener = null;

  public async currentSongUpdater(isPlaying: boolean, newSong: LZRSongItem) {
    if (!isPlaying) {
      //stop playing songs
      this.playNextSongListener = null;
      clearTimeout(this.playNextSongListener);
    } else {
      //check if songs are different
      const { currentSong } = this.state;
      const isSameSong = currentSong?.name === newSong?.name;
      if (isSameSong) {
        //if same song then update the listener with
      }
    }

    if (!this.sendSongRtc) return;
    await this.sendCurrentSong(isPlaying, newSong);
    this.state$.next({
      ...this.state,
      currentSong: newSong,
    });
  }

  handleSongQueue = (): LZRQueueItem => {
    const { queue } = this.state;
    if (queue.length === 0) return null;
    const nextSong = queue[0];

    if (nextSong.itemType === "spotify") {
      this.spotify.api.player.addToQueue(nextSong.uri);
      const newQueue = queue.slice(1);
      this.state$.next({
        ...this.state,
        queue: newQueue,
      });
    }

    return queue[0];
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
    toast("updated song");
  };

  playSong = async (song: LZRSongItem): Promise<void> => {
    let duration = 0;
    const { itemType } = song;
    if (itemType === "spotify") {
      duration = song.duration;
      await this.spotify.addToQueueThenPlay(song.uri);
    }

    this.playNextSongListener = setTimeout(() => {
      this.playNextSongInQueue();
    }, duration - this.songQueueBuffer);
  };

  playNextSongInQueue = async () => {
    if (this.state.queue.length > 0) {
      const nextSong = this.state.queue[0];
      await this.playSong(nextSong);
    }
  };

  songSearch = async (data: string): Promise<LZRSongItem> => {
    if (this.spotify.state.isConnected) {
      return await this.spotify.songSearch(data);
    }
  };

  //create uuidv4

  addSongToQueue = async (song: LZRSongItem, user: string) => {
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

  createCurrentSongAction = (lzrRoom: LZRHost) => {
    const currentSongAction = lzrRoom.createChannel<CurrentSong>("currentSong");
    this.sendSongRtc = currentSongAction.send;
  };

  async startup() {
    waitForLzrRoom("currentSong", this.createCurrentSongAction.bind(this));

    this.state$
      .pipe(
        pairwise(),
        switchMap(([oldResult, newResult]) => {
          reduxStore.dispatch.music.updateClientState(newResult);

          const oldState = structuredClone(oldResult);
          const newState = structuredClone(newResult);

          this.state = newResult;

          //check if queues are different
          if (oldState.queue.length !== newState.queue.length) {
            if (this.state.autoPlay) {
              if (oldState.queue.length < newState.queue.length) {
                //song was added to the queue
                if (!oldState.currentSong || oldState.currentSong == null)
                  this.playNextSongInQueue();
              } else if (oldState.queue.length > newState.queue.length) {
                //song was removed from the queue
                // this.playNextSongInQueue();
              }
            }
          }

          return of(null);
        })
      )
      .subscribe();

    // await this.local.startup();
    await this.spotify.startup(
      this.currentSongUpdater.bind(this),
      this.handleSongQueue.bind(this)
    );
  }
}

const musicClient = new LZRMusicClient();
export { musicClient };
