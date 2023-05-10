/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { RootModel } from "../models";

export interface RtcReduxSlice {
	peerId?: string;
}

const initialState: RtcReduxSlice = {};
const rtcSlice = () =>
	createModel<RootModel>()({
		name: "rtc",
		state: initialState,
		reducers: {
			setVal(state, payload: Partial<RtcReduxSlice>) {
				return {
					...state,
					...payload,
				};
			},
			default(state) {
				return state;
			},
		},
		effects: (dispatch) => ({
			isConnected(_, state): boolean {
				return state.rtc.peerId !== undefined;
			},
		}),
	});

export default rtcSlice;
