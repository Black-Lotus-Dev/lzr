/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { User } from "firebase/auth";
import { UserReduxSlice } from "@lzrTypes/redux/user";
import UserLZRSlice from "@lzrTypes/store/user";
import { RootModel } from "../models";

const sliceName = "user";
export default () =>
  createModel<RootModel>()({
    name: sliceName,
    state: { isReady: false } as UserReduxSlice,
    reducers: {
      setVal(state, payload: Partial<UserReduxSlice>) {
        return {
          ...state,
          ...payload,
        };
      },
      setAuthUser(state, authUser: User) {
        return {
          ...state,
          auth: authUser,
        };
      },
      default(state) {
        return state;
      },
    },
    effects: (dispatch) => ({
      async updateFromStore() {
        // const { user } = (await window.lzrApi.lzrStore.getState()) as LZRState;
        // dispatch.user.mergeFromStore(user);
      },
    }),
  });
