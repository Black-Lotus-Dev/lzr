/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { RootModel } from "../models";

const sliceName = "rtc";
export interface RtcReduxSlice {
  peerId?: string;
}

export default () =>
  createModel<RootModel>()({
    name: sliceName,
    state: {} as RtcReduxSlice,
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
    effects: (dispatch) => ({}),
  });
