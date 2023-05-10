/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { obsClient } from "@lzrClients/obs/client";
import { OBSReduxSlice } from "@lzrTypes/redux/obs";
import { RootModel } from "../models";

export default () =>
  createModel<RootModel>()({
    name: "obs",
    state: {} as OBSReduxSlice,
    reducers: {
      default(state) {
        return state;
      },
    },
    effects: (dispatch) => ({
      startup: () => {
        obsClient.startup();
      },
      isStreaming: () => {
        obsClient.isStreaming();
      },
    }),
  });
