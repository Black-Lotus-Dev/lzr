/* eslint-disable import/no-cycle */
import { LocalMusicProps } from "@lzrTypes/music/local/props";

class LZRLocalClient {
  // public dispatch?: Dispatch;

  public settings: LocalMusicProps = {
    musicDirs: [],
    albums: [],
    tracks: [],
    artists: [],
    playlists: [],
  };

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}
}

export default LZRLocalClient;
