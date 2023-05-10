/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { RootModel } from "../models";
import { FinalColor } from "extract-colors/lib/types/Color";

export type BaseSong = {
	name: string;
	artists: string[];
	album: {
		name: string;
		images: string[];
		colorPalette: FinalColor[];
	};
	duration: number;
	progress: number;
};
export interface LZRSpotifySong extends BaseSong {
	uri: string;
	is_local: boolean;
	itemType: "spotify";
}
export interface LZRLocalSong extends BaseSong {
	path: string;
	itemType: "local";
}
export type LZRSongItem = LZRLocalSong | LZRSpotifySong;

export type MusicState = {
	isPlaying: boolean;
	song?: BaseSong;
	albumArtColorPalette?: FinalColor[];
};

const initialState: MusicState = {
	isPlaying: false,
};

const musicSlice = () =>
	createModel<RootModel>()({
		name: "music",
		state: initialState,
		reducers: {
			updateCurrentSong(state, mState: MusicState) {
				return {
					...state,
					...mState,
				};
			},
		},
		effects: (dispatch) => ({}),
	});

export default musicSlice;
