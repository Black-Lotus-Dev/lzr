import { LZRGuestCb, waitForLzrGuest } from "ggpo";
import { waitForUserAuth } from "./user";

export const waitForLzrRoom = (name: string, cb: LZRGuestCb) =>
  waitForUserAuth(name, (userId: string) => waitForLzrGuest(userId, cb));
