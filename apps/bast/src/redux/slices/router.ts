/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { RootModel } from "../models";

interface RouterState {
	attemptedRoute?: string;
}

const initialState: RouterState = {};

const routerSlice = () =>
	createModel<RootModel>()({
		name: "router",
		state: initialState,
		reducers: {
			setAttemptedRoute(state, attemptedRoute: string) {
				return { ...state, attemptedRoute };
			},
		},
		effects: (dispatch) => ({}),
	});

export default routerSlice;
