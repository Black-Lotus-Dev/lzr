import { User } from "firebase/auth";
import { LZRUser } from "../user";
import { BaseReduxState } from "./base";

type UserReduxSlice = BaseReduxState & {
  auth: User;
  lzrUser: LZRUser | null;
};

export type { LZRUser, UserReduxSlice };
