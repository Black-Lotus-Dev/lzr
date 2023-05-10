import { GetRefreshableUserTokensResponse } from 'spotify-web-api-ts/types/types/SpotifyAuthorization';

type SpotifyTokenRes = Omit<
  GetRefreshableUserTokensResponse,
  'token_type' | 'scope' | 'expires_in'
>;

export default SpotifyTokenRes;
