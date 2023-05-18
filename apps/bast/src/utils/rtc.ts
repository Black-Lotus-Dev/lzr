import { waitForLzrGuest } from "ggpo/utils";
import { waitForUserAuth } from "./user";
import { LZRGuestCb } from "ggpo/types";

export const waitForLZRRoom = (name: string, cb: LZRGuestCb) =>
  waitForUserAuth(name, (userId: string) => waitForLzrGuest(userId, cb));
