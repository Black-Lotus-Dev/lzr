/* eslint-disable import/no-cycle */
import { createModel } from "@rematch/core";
import { RootModel } from "../models";
import { MusicReduxSlice } from "@lzrTypes/redux/music";
import MusicLZRSlice from "@lzrTypes/store/music";
import { getMusicClient, type LZRMusicState } from "@lzrClients/music/client";
import { SpotifyState } from "@lzrClients/music/spotify";

const musicClient = getMusicClient();
const initialState: MusicReduxSlice = {
  isReady: false,
  isLocalReady: false,
  isSpotifyReady: false,
  clientState: musicClient.state,
  spotifyState: musicClient.spotify.state,
};

export default () => {
  return createModel<RootModel>()({
    name: "music",
    state: initialState,
    reducers: {
      setIsReady(state) {
        return {
          ...state,
          isReady: true,
        };
      },
      setClientISReady(state, client: "Local" | "Spotify") {
        const keyOfClient = `is${client}Ready` as keyof MusicReduxSlice;

        // check if all other clients are ready
        // ignore the client that just became ready
        // and ignore the isReady key, since it is the key of the whole slice
        const checkAllOtherClientsAreReady = () => {
          const otherClients = Object.keys(state).filter(
            (key) =>
              key.includes("is") &&
              key.includes("Ready") &&
              key !== keyOfClient &&
              key !== "isReady"
          );

          return otherClients.every(
            (key) => state[key as keyof MusicReduxSlice]
          );
        };

        return {
          ...state,
          [`is${client}Ready`]: true,
          isReady: checkAllOtherClientsAreReady(),
        };
      },
      setVal(state, payload: MusicLZRSlice) {
        return {
          ...state,
        };
      },
      updateClientState(state, payload: LZRMusicState) {
        return {
          ...state,
          clientState: {
            ...state.clientState,
            ...payload,
          },
        };
      },
      updateSpotifyState(state, payload: SpotifyState) {
        return {
          ...state,
          spotifyState: {
            ...state.spotifyState,
            ...payload,
          },
        };
      },
      default(state) {
        return state;
      },
    },
    effects: (dispatch) => ({
      startup: async () => musicClient.startup(),
      spotifyLogin: () => musicClient.spotify.login(),
    }),
  });
};
