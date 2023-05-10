import { reduxStore } from "../redux/store";
var userAuthSubscribers: UserAuthSubCb[] = [];

export function getUserId() {
  try {
    const { user } = reduxStore.getState();
    return user.auth?.uid ?? null;
  } catch {
    return null;
  }
}

type SubCallBack = (userId: string) => void;
type UserAuthSubCb = {
  name: string;
  cb: SubCallBack;
};

export function runUserAuthSubscribers() {
  const userId = getUserId();
  if (userId === null) return;
  userAuthSubscribers.forEach((sub) => sub.cb(userId));

  //clear the subscribers
  userAuthSubscribers.length = 0;
}

//this function is used to store callbacks that need to be called after the user is authenticated
export function waitForUserAuth(name: string, cb: SubCallBack) {
  if (!userAuthSubscribers) userAuthSubscribers = [];
  const userId = getUserId();
  if (userId !== null) {
    cb(userId);
  } else {
    userAuthSubscribers.push({ name, cb });
  }
}