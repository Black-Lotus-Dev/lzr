import { BaseLocalTrack } from "./base";

interface LocalTrack extends BaseLocalTrack {
  artist: string;
  album: string;
  imgs: string[];
  duration: number;
}
interface LocalAlbum {
  imgs: string[];
  totalTracks: number;
  tracks: LocalTrack[];
}
interface LocalArtist {
  albums: LocalAlbum[];
  tracks: LocalTrack[];
}

interface LocalPlaylist {
  tracks: LocalTrack[];
}

interface LocalMusicClient {
  musicDirs: string[];
  albums: LocalAlbum[];
  tracks: LocalTrack[];
  artists: LocalArtist[];
  playlists: LocalPlaylist[];
}

export type { LocalMusicClient, LocalTrack, LocalAlbum, LocalArtist, LocalPlaylist};
