import { LZRGuestCb, waitForLzrGuest } from "@black-lotus-dev/ggpo";
import { waitForUserAuth } from "./user";

export const waitForLzrRoom = (name: string, cb: LZRGuestCb) =>
  waitForUserAuth(name, (userId: string) => waitForLzrGuest(userId, cb));
