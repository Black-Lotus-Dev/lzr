/* eslint-disable import/no-cycle */
import { Models } from "@rematch/core";

import lzrReduxSlice from "./slices/lzr";
import rtcReduxSlice from "./slices/rtc";
import obsReduxSlice from "./slices/obs";
import prefsReduxSlice from "./slices/prefs";
import musicReduxSlice from "./slices/music";
import twitchReduxSlice from "./slices/twitch";
import userReduxSlice from "./slices/user";

const lzr = lzrReduxSlice();
const rtc = rtcReduxSlice();
const obs = obsReduxSlice();
const prefs = prefsReduxSlice();
const music = musicReduxSlice();
const twitch = twitchReduxSlice();
const user = userReduxSlice();

export interface RootModel extends Models<RootModel> {
  lzr: typeof lzr;
  rtc: typeof rtc;
  obs: typeof obs;
  prefs: typeof prefs;
  user: typeof user;
  music: typeof music;
  twitch: typeof twitch;
}

export const models: RootModel = {
  lzr,
  rtc,
  obs,
  prefs,
  user,
  music,
  twitch,
};
