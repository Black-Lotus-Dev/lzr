import SpotifyTokenRes from "../../apiResponses/spotify/auth";
import SpotifyUser from "../../music/spotify/user";

type SpotifySettings = {
  playListIds: string[];
};
interface SpotifyLZRSlice {
  account: SpotifyUser;
  settings: SpotifySettings;
}

export type { SpotifyLZRSlice };
