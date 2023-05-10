/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { RootModel } from "../models";

interface PrefsState {}

const initialState: PrefsState = {};
const prefsSlice = () =>
	createModel<RootModel>()({
		name: "prefs",
		state: initialState,
		reducers: {},
		effects: (dispatch) => ({}),
	});

export default prefsSlice;
