interface BaseLocalMusicProps {
  id: string;
  name: string;
  location: string;
}

interface BaseLocalTrack extends BaseLocalMusicProps {
  duration: number;
}

interface BaseLocalAlbum extends BaseLocalMusicProps {
  img: string;
}

type BaseLocalArtist = BaseLocalMusicProps;

interface BasePlaylist extends BaseLocalMusicProps {
  img: string;
  tracks: BaseLocalTrack[];
}

export type {BaseLocalMusicProps, BaseLocalTrack, BaseLocalAlbum, BaseLocalArtist, BasePlaylist };