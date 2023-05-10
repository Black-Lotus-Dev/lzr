import { PrivateUser } from 'spotify-web-api-ts/types/types/SpotifyObjects';

type SpotifyUser = Omit<
  PrivateUser,
  'explicit_content' | 'followers' | 'type' | 'external_urls'
>;

export default SpotifyUser;
