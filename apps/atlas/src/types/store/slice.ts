import PrefsLZRSlice from "./prefs";
import MusicLZRSlice from "./music";
import { TwitchLZRSlice } from "./twitch";
import UserLZRSlice from "./user";
import slices from "@constants/store/slices";

type SliceName = typeof slices[number];

type LZRSliceType =
  | PrefsLZRSlice
  | MusicLZRSlice
  | TwitchLZRSlice
  | UserLZRSlice;

export type { LZRSliceType, SliceName };
