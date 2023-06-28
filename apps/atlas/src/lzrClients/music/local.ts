/* eslint-disable import/no-cycle */
import { LocalMusicClient } from "@lzrTypes/music/local/props";

class LZRLocalMusicClient {
  private static instance: LZRLocalMusicClient;
  
  public static getInstance(): LZRLocalMusicClient {
    if (!LZRLocalMusicClient.instance) {
      LZRLocalMusicClient.instance = new LZRLocalMusicClient();
    }
    return LZRLocalMusicClient.instance;
  }

  // public dispatch?: Dispatch;

  public settings: LocalMusicClient = {
    musicDirs: [],
    albums: [],
    tracks: [],
    artists: [],
    playlists: [],
  };

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function
  constructor() {}
}


const getLocalMusicClient = () => LZRLocalMusicClient.getInstance();
export { getLocalMusicClient, type LZRLocalMusicClient  };
