import _ from "lodash";
import { open } from "@tauri-apps/api/shell";
import authScopes from "./auth-scopes.json";

function getAuthUrl(state: string) {
  return (
    `https://id.twitch.tv/oauth2/authorize` +
    `?response_type=code` +
    `&force_verify=true` +
    `&client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}` +
    `&redirect_uri=${import.meta.env.VITE_AUTH_REDIRECT_URI}` +
    `&scope=${encodeURI(authScopes.join("+"))}` +
    `&state=${state}`
  );
}

export default async function twitchAuthLogin(state: string) {
  const authUrl = getAuthUrl(state);
  open(authUrl);
}
