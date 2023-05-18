import { LZRHostCb } from "ggpo/types";
import { waitForLzrHost } from "ggpo/utils";
import { waitForUserAuth } from "./user";

export function waitForLZRRoom(name: string, cb: LZRHostCb) {
  waitForUserAuth(name, (userId: string) => waitForLzrHost(userId, cb));
}
