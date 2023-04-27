import { ActionProgress, ActionReceiver, ActionSender } from "trystero";

type SendFuncType<T> = (data: T) => void;
export interface LZRChannel<T> {
  send: SendFuncType<T>;
  _send: ActionSender<T>;
  get: ActionReceiver<T>;
  progress: ActionProgress;
}
