/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { defaultPrefsStore } from "@constants/store/prefs";
import { PrefsReduxSlice } from "@lzrTypes/redux/prefs";
import PrefsLZRSlice from "@lzrTypes/store/prefs";

import { RootModel } from "../models";

const sliceName = "prefs";

export default () =>
  createModel<RootModel>()({
    name: sliceName,
    state: { ...defaultPrefsStore, isReady: false } as PrefsReduxSlice,
    reducers: {
      setVal(state, payload: Partial<PrefsReduxSlice>) {
        return {
          ...state,
          ...payload,
        };
      },
      mergeFromStore(state, payload: PrefsLZRSlice) {
        return {
          ...state,
        };
      },
      default(state) {
        return state;
      },
    },
    effects: (dispatch) => ({
      async updateFromStore() {
        // const { prefs } = (await window.lzrApi.lzrStore.getState()) as LZRState;
        // dispatch.prefs.mergeFromStore(prefs);
      },
    }),
  });
