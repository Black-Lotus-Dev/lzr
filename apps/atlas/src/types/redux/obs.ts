import { OBSClient } from "@lzrClients/obs/client";
import { BaseReduxState } from "./base";

type OBSReduxSlice = BaseReduxState & {
  client: OBSClient;
};

export type { OBSReduxSlice };
