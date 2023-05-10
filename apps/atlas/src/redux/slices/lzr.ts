/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import LzrReduxSlice from "@lzrTypes/redux/lzr";

import { RootModel } from "../models";

const sliceName = "lzr";
const initState: LzrReduxSlice = {
  isLoading: true,
  isReady: false,
};
export default () =>
  createModel<RootModel>()({
    name: sliceName,
    state: initState,
    reducers: {
      setVal(state, payload: Partial<LzrReduxSlice>) {
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
      setIsLoading(isLoading: boolean) {
        dispatch.lzr.setVal({ isLoading });
      },
    }),
  });
