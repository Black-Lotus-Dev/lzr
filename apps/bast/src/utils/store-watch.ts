import { reduxStore } from "../redux/store";
import watch from "redux-watch";

type WatchCallback<PT> = (newVal: PT, oldVal: PT, objectPath?: string) => void;
export default function storeWatch<PT>(
  callback: WatchCallback<PT>,
  objectPath?: string,
  customCompare?: Function
) {
  const w = watch(reduxStore.getState, objectPath, customCompare);
  return reduxStore.subscribe(
    w((newVal, oldVal, objectPath) => {
      callback(newVal, oldVal, objectPath);
    })
  );
}
