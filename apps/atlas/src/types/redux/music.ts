import { LZRMusicState } from "@lzrClients/music/client";
import { SpotifyState } from "@lzrClients/music/spotify";
import { BaseReduxState } from "./base";

interface MusicReduxSlice extends BaseReduxState {
  isLocalReady: boolean;
  isSpotifyReady: boolean;
  clientState: LZRMusicState;
  spotifyState: SpotifyState;
}

export type { MusicReduxSlice };
