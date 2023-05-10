import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { models, RootModel } from "./models";

export const reduxStore = init({
  models,
});

export type ReduxStore = typeof reduxStore;
export type ReduxDispatch = RematchDispatch<RootModel>;
export type ReduxRootState = RematchRootState<RootModel>;
