import { BaseReduxState } from "./base";

// create  lzr store type
interface LzrReduxSlice extends BaseReduxState {
  isLoading: boolean;
}

export default LzrReduxSlice;
