import PrefsLZRSlice from "../store/prefs";
import { BaseReduxState } from "./base";

type PrefsLZRSliceDto = PrefsLZRSlice;
interface PrefsReduxSlice extends PrefsLZRSliceDto, BaseReduxState {}

export type { PrefsLZRSliceDto, PrefsReduxSlice };
