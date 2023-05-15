import LzrStore from "@/lzrStore/lzrStore";
import { SpotifyWebApi } from "spotify-web-api-ts";
import {
  CurrentlyPlaying,
  Device,
  Track,
} from "spotify-web-api-ts/types/types/SpotifyObjects";
import _ from "lodash";
import createRandString from "@utils/createRandString";
import { open } from "@tauri-apps/api/shell";
import SpotifyUser from "@lzrTypes/music/spotify/user";
import axios from "axios";
import { BehaviorSubject, of, pairwise, switchMap } from "rxjs";
import { reduxStore } from "@redux/store";
import { BaseSong, LZRSongItem } from "./client";
import { hostLzrRoom } from "@black-lotus-dev/ggpo";
import { fetchApi } from "@utils/fetchApi";
import { GetRefreshableUserTokensResponse } from "spotify-web-api-ts/types/types/SpotifyAuthorization";
import { createLzrStore } from "@/utils/lzrStore";

type DevicesResult = {
  devices: Device[];
};

export interface LZRSpotifySong extends BaseSong {
  uri: string;
  is_local: boolean;
  itemType: "spotify";
}

export type SpotifyState = {
  isPlaying: boolean;
  isConnected: boolean;
  account: SpotifyUser;
  currentSong?: LZRSpotifySong;
};

interface SpotifyStoreState {
  access_token: string;
  refresh_token: string;
  state: string;
  default_device_id?: string;
}

class LZRSpotifyClient {
  public store: LzrStore<SpotifyStoreState>;
  public access_token: string;
  public refresh_token: string;
  public currentSongListener = null;
  public musicQueueListener = null;
  public parentCurrentSongUpdater: (
    isPlaying: boolean,
    newSong: LZRSongItem
  ) => void;
  public handleNextQueueSong: () => void;

  public state: SpotifyState = {
    isPlaying: false,
    isConnected: false,
    account: undefined,
  };

  public currentSongPollTimer = 5000;
  public currentSongOffsetBuffer = 2500;

  //use rxjs to listen to changes in the state
  public state$ = new BehaviorSubject<SpotifyState>(this.state);

  public api = new SpotifyWebApi({
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
    redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI,
  });

  async startup(
    currentSongUpdater: typeof this.parentCurrentSongUpdater,
    handleNextQueueSong: typeof this.handleNextQueueSong
  ) {
    this.store = await createLzrStore<SpotifyStoreState>("spotify");
    this.parentCurrentSongUpdater = currentSongUpdater;
    this.handleNextQueueSong = handleNextQueueSong;

    this.state$
      .pipe(
        pairwise(),
        switchMap(([oldResult, newResult]) => {
          try {
            reduxStore.dispatch.music.updateSpotifyState(newResult);
          } catch (e) {
            //redux store might not be ready yet
            console.log(e);
          }

          this.parentCurrentSongUpdater(
            newResult.isPlaying,
            newResult.currentSong
          );

          this.state = newResult;

          return of(null);
        })
      )
      .subscribe();

    this.autoLogin();
  }

  async currentSongHandler(currentApiSong: CurrentlyPlaying) {
    const { currentSong: currStateSong } = this.state;

    const isPlaying = currentApiSong.is_playing;
    let currentSong = undefined;

    if (isPlaying) {
      const newSong = this.convertToBaseSong(
        currentApiSong.item as Track,
        currentApiSong.progress_ms
      );

      const sameSong =
        currStateSong !== undefined
          ? _.isEqual(currStateSong?.uri, newSong?.uri)
          : false;
      if (sameSong) {
        //check buffer difference
        const assumedOffset =
          currStateSong.progress + this.currentSongPollTimer;
        const extraOffset = currentApiSong.progress_ms - assumedOffset;

        const progressOffset = Math.abs(extraOffset);

        //if the progress is offset by more than our buffer then we should update the song
        const progressBuffer =
          this.currentSongPollTimer + this.currentSongOffsetBuffer;
        if (progressOffset > progressBuffer) {
          currentSong = newSong;
        } else {
          return;
        }
      } else {
        //if the songs are different then update the song
        currentSong = newSong;
      }
    }

    this.state$.next({
      ...this.state,
      isPlaying,
      currentSong,
    });
  }

  startCurrentSongListener() {
    clearInterval(this.currentSongListener);
    this.currentSongListener = null;

    this.currentSongListener = setInterval(async () => {
      if (!this.state.isConnected) return;

      //spotify specific code
      const currentSpotifySong =
        await this.api.player.getCurrentlyPlayingTrack();

      //if for some reason were playing but theres no current song then skip
      if (
        typeof currentSpotifySong === "string" ||
        currentSpotifySong.item === undefined
      ) {
        //somehow we stopped playing so update our state
        if (this.state.isPlaying) {
          this.state$.next({
            ...this.state,
            isPlaying: false,
            currentSong: undefined,
          });
        }
        return;
      }

      const remainingTime =
        currentSpotifySong.item.duration_ms - currentSpotifySong.progress_ms;

      if (this.musicQueueListener !== null)
        clearTimeout(this.musicQueueListener);
      this.musicQueueListener = setTimeout(async () => {
        if (this.musicQueueListener !== null)
          clearTimeout(this.musicQueueListener);
        this.handleNextQueueSong();
      }, remainingTime - 2000);

      //if we're playing and the song is different then update our state
      this.currentSongHandler(currentSpotifySong);
    }, this.currentSongPollTimer);
  }

  async autoLogin() {
    const { access_token, refresh_token } = this.store.state;

    this.access_token = access_token;
    this.refresh_token = refresh_token;

    if (this.access_token) {
      this.api = new SpotifyWebApi({
        clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
        redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI,
        accessToken: this.access_token,
      });

      this.refreshToken().finally(() => {
        reduxStore.dispatch.music.setClientISReady("Spotify");
      });
    }
  }

  listenToAuth(state) {
    const authHost = hostLzrRoom("auth", state);
    const lzrAuthChannel = authHost.createChannel<string>("auth");

    lzrAuthChannel.get(async (code) => {
      console.log(code);

      const { access_token, refresh_token } =
        await fetchApi<GetRefreshableUserTokensResponse>({
          path: "auth/spotify",
          data: { code },
        });

      if (access_token) {
        this.store.update({ access_token, refresh_token });

        this.api.setAccessToken(access_token);
        const account: SpotifyUser = await this.api.users.getMe();

        this.state$.next({
          ...this.state,
          isConnected: true,
          account,
        });
      }

      setTimeout(() => {
        authHost.closeRoom();
      }, 1000);
    });
  }

  async login() {
    const state = createRandString();
    this.store.update({ state });

    this.listenToAuth(state);
    const authUrl = this.getAuthUrl(state);
    open(authUrl);
  }

  getAuthUrl(state: string) {
    return this.api.getRefreshableAuthorizationUrl({
      scope: [
        "ugc-image-upload",
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "app-remote-control",
        "streaming",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-follow-modify",
        "user-follow-read",
        "user-read-playback-position",
        "user-top-read",
        "user-read-recently-played",
        "user-library-modify",
        "user-library-read",
        "user-read-email",
        "user-read-private",
      ],
      state,
    });
  }

  async refreshToken() {
    // eslint-disable-next-line promise/always-return
    try {
      const apiUrl = import.meta.env.VITE_API_URL + "/spotify/refreshToken";
      const refreshedAccessToken = await axios.post(apiUrl, {
        refreshToken: this.refresh_token,
      });

      const { access_token, refresh_token, expires_in } =
        refreshedAccessToken.data;

      this.access_token = access_token;
      this.api.setAccessToken(access_token);
      this.store.update({ access_token: access_token });

      this.state$.next({
        ...this.state,
        isConnected: true,
        account: await this.api.users.getMe(),
      });
      this.startCurrentSongListener();

      setTimeout(() => {
        this.refreshToken();
      }, expires_in * 1000);
    } catch (e) {
      console.log(e);
    }
  }

  async addToQueueThenPlay(uri: string) {
    const res =
      (await this.api.player.getMyDevices()) as unknown as DevicesResult;

    const computerDevices = res.devices.filter(
      (device) => device.type === "Computer"
    );

    const firstComputerDevice = computerDevices[0];
    await this.api.player.addToQueue(uri, {
      device_id: firstComputerDevice.id,
    });
    this.play();
  }

  play() {
    this.api.player.play();
  }

  pause() {
    this.api.player.pause();
  }

  previous() {
    this.api.player.skipToPrevious();
  }

  skip() {
    this.api.player.skipToNext();
  }

  async getCurrentSong() {
    const currentSong = await this.api.player.getCurrentlyPlayingTrack();
    return currentSong !== "" ? (currentSong as CurrentlyPlaying) : undefined;
  }

  async getAllUserPlaylists() {
    const spotPlaylists = await this.api.playlists.getMyPlaylists();
    const playlistIds = spotPlaylists.items.map((playlist) => playlist.id);
  }

  async songSearch(data: string) {
    const result = await this.api.search.searchTracks(data);
    return this.convertToBaseSong(result.items[0]);
  }

  convertToBaseSong(spotifySong: Track | null, progress = 0): LZRSpotifySong {
    if (spotifySong === null) return null;

    return {
      uri: spotifySong.uri,
      name: spotifySong.name,
      artists: spotifySong.artists.map((a) => a.name),
      album: {
        name: spotifySong.album.name,
        images: spotifySong.album.images.map((i) => i.url),
      },
      is_local: spotifySong.is_local,
      duration: spotifySong.duration_ms,
      progress: progress,
      itemType: "spotify",
    };
  }
}

export default LZRSpotifyClient;
