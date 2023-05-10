import { ReduxRootState } from "@redux/store";
import { reduxStore } from "@redux/store";
import _ from "lodash";

import {
  // src/useKeyPathWatcher.ts
  useEffect,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { get } from "lodash";

type WatchCallback<PT> = (newVal: PT, oldVal: PT, objectPath?: string) => void;
export function storeWatch<PT>(
  callback: WatchCallback<PT>,
  objectPath?: string
) {
  const oldState = _.get(reduxStore.getState(), objectPath);
  return reduxStore.subscribe(() => {
    const newState = _.get(reduxStore.getState(), objectPath);
    if (!_.isEqualWith(newState, oldState)) {
      callback(newState, oldState, objectPath);
    }
  });
}

export const useStoreWatch = <T>(
  keyPath: string,
  callback: (
    prevValue: T | undefined,
    nextValue: T | undefined
  ) => void = () => {}
) => {
  const value = useSelector(
    (state: ReduxRootState) => get(state, keyPath) as T | undefined
  );
  const prevValueRef = useRef<T | undefined>();

  useEffect(() => {
    const prevValue = prevValueRef.current;

    if (prevValue !== value) {
      callback(prevValue, value);
      prevValueRef.current = value;
    }
  }, [value, callback]);

  return value;
};
