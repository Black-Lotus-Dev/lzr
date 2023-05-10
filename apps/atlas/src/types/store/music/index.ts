import { BaseLZRSlice } from '../base';
import LocalMusicLZRSlice from './local';
import { SpotifyLZRSlice } from './spotify';

interface MusicLZRSlice extends BaseLZRSlice {
  spotify: SpotifyLZRSlice;
  local: LocalMusicLZRSlice;
}

export default MusicLZRSlice;
