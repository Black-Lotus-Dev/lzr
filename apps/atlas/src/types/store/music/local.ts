import {
  BaseLocalAlbum,
  BaseLocalTrack,
  BaseLocalArtist,
  BasePlaylist,
} from "../../music/local/base";

interface LocalMusicLZRSlice {
  musicDirs: string[];
  albums: BaseLocalAlbum[];
  tracks: BaseLocalTrack[];
  artists: BaseLocalArtist[];
  playlists: BasePlaylist[];
}

export default LocalMusicLZRSlice;
