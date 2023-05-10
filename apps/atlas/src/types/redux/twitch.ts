import { BaseReduxState } from "./base";

type TwitchLZRAccountDto = {
  id: string;
  email: string;
  description: any;
  display_name: any;
  profile_image_url: any;
  offline_image_url: any;
  view_count: any;
  broadcaster_type: any;
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

interface TwitchReduxSlice extends BaseReduxState {
  mainIsReady: boolean;
  botIsReady: boolean;
  mainIsConnected: boolean;
  botIsConnected: boolean;
}

export type { TwitchReduxSlice, TwitchLZRAccountDto };
