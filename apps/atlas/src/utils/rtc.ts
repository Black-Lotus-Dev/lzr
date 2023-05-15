import { LZRHostCb, waitForLzrHost } from "@black-lotus-dev/ggpo";
import { waitForUserAuth } from "./user";

export function waitForLzrRoom(name: string, cb: LZRHostCb) {
  waitForUserAuth(name, (userId: string) => waitForLzrHost(userId, cb));
}
