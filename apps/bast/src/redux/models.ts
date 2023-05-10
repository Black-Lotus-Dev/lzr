/* eslint-disable import/no-cycle */
import { Models } from "@rematch/core";

import rtcReduxSlice from "./slices/rtc";
import routerReduxSlice from "./slices/router";
import prefsReduxSlice from "./slices/prefs";
import musicReduxSlice from "./slices/music";
import twitchReduxSlice from "./slices/twitch";
import userReduxSlice from "./slices/user";

const rtc = rtcReduxSlice();
const router = routerReduxSlice();
const prefs = prefsReduxSlice();
const music = musicReduxSlice();
const twitch = twitchReduxSlice();
const user = userReduxSlice();

export interface RootModel extends Models<RootModel> {
  rtc: typeof rtc;
  router: typeof router;
  prefs: typeof prefs;
  user: typeof user;
  music: typeof music;
  twitch: typeof twitch;
}

export const models: RootModel = {
  rtc,
  router,
  prefs,
  user,
  music,
  twitch,
};
