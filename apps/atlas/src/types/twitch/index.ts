export type TwitchAccountType = "main" | "bot";
export interface TwitchAccount {
  id: string;
  email: string;
  id_token: string;
  access_token: string;
  refresh_token: string;
  login: string;
  display_name: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
}