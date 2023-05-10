/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { RootModel } from "../models";

export interface TwitchState {}

const initialState: TwitchState = {};
const twitchSlice = () =>
	createModel<RootModel>()({
		name: "twitch",
		state: initialState,
		reducers: {},
		effects: (dispatch) => ({}),
	});

export default twitchSlice;
