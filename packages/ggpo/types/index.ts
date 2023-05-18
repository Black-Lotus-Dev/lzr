import LZRHost from "../host";
import LZRGuest from "../guest";
import { ActionProgress, ActionReceiver, ActionSender } from "trystero";

type SendFuncType<T> = (data: T) => void;
export interface Peer {
  name: string;
  id: string;
  channels: string[];
}

export type ChannelEvent = {
  channel: string;
  data: any;
};

export type LZRChannel<T> = {
  send: SendFuncType<T>;
  _send: ActionSender<T>;
  get: ActionReceiver<T>;
  progress: ActionProgress;
};

export type LZRHostCb = (host: LZRHost) => void;
export type LZRGuestCb = (guest: LZRGuest) => void;
