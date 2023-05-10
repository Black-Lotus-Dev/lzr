import {
  SpotifyImage,
  Track,
} from 'spotify-web-api-ts/types/types/SpotifyObjects';

export type SpotifyPlaylist = {
  id: string;
  name: string;
  imgs: SpotifyImage[];
  totalTracks: number;
  href: string;
  uri: string;
  collaborative: boolean;
  public: boolean | null;
  tracks?: Track[];
};
