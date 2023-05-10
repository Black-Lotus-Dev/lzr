import { LZRUser } from "../user";
import { BaseLZRSlice } from "./base";

// Type for our electron store
interface UserLZRSlice extends LZRUser, BaseLZRSlice {
  password: string;
}

export default UserLZRSlice;
