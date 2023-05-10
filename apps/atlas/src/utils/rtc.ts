import { LZRHostCb, waitForLzrHost } from "ggpo";
import { waitForUserAuth } from "./user";

export function waitForLzrRoom(name: string, cb: LZRHostCb) {
  waitForUserAuth(name, (userId: string) => waitForLzrHost(userId, cb));
}
