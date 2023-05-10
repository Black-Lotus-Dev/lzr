import { HelixPrivilegedUserData } from "@twurple/api/lib/interfaces/helix/user.external";
import { BaseLZRSlice } from "./base";

interface TwitchLZRSlice extends BaseLZRSlice {
  main: HelixPrivilegedUserData;
  bot: HelixPrivilegedUserData;
}

export type { TwitchLZRSlice };
