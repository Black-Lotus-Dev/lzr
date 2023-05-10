/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";

import { RootModel } from "../models";
import { TwitchReduxSlice } from "@lzrTypes/redux/twitch";
import { TwitchAccountType } from "@lzrTypes/twitch";
import _ from "lodash";
import { mainTwitchClient, botTwitchClient } from "@lzrClients/twitch/client";

const sliceName = "twitch";
const initialState: TwitchReduxSlice = {
  isReady: false,
  mainIsReady: false,
  mainIsConnected: false,
  botIsReady: false,
  botIsConnected: false,
};

export default () =>
  createModel<RootModel>()({
    name: sliceName,
    state: initialState,
    reducers: {
      setIsReady(state) {
        return {
          ...state,
          isReady: true,
        };
      },
      setClientIsConnected(state, type: string) {
        return {
          ...state,
          [`${type}IsConnected`]: true,
        };
      },
      setClientIsReady(state, type: string) {
        return {
          ...state,
          [`${type}IsReady`]: true,
        };
      },
      setVal(state, payload: Partial<TwitchReduxSlice>) {
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
      async startup() {
        await mainTwitchClient
          .startup()
          .then(() => botTwitchClient.startup())
          .finally(() => {
            dispatch.twitch.setIsReady();
          });
      },
      async login(accType: TwitchAccountType, state) {
        if (accType === "main") mainTwitchClient.freshLogin();
        else botTwitchClient.freshLogin();
      },
    }),
  });
