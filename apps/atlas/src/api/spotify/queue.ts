/// <reference path="../../../node_modules/@types/spotify-api/index.d.ts" />
import axios from "axios";

export default async function getSongQueue(
  access_token: string
): Promise<SpotifyApi.UsersQueueResponse> {
  return axios.get("https://api.spotify.com/v1/me/player/queue", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
}
