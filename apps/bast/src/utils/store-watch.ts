import { reduxStore } from "@redux/store";
import watch from "redux-watch";

type FieldPath = string | number | Array<string | number>;
type WatchCallback<PT> = (
  newVal: PT,
  oldVal: PT,
  objectPath?: FieldPath
) => void;
export default function storeWatch<PT>(
  callback: WatchCallback<PT>,
  objectPath?: string,
  customCompare?: (a: any, b: any) => boolean
) {
  const w = watch(reduxStore.getState, objectPath, customCompare);
  return reduxStore.subscribe(
    w((newVal, oldVal, objectPath) => {
      callback(newVal, oldVal, objectPath);
    })
  );
}
