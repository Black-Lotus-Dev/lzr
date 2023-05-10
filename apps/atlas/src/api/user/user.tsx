import { auth } from "@configs/firebase";
import { fetchApi } from "@utils/fetchApi";
import { signInWithCustomToken } from "firebase/auth";
import { mainTwitchClient } from "@lzrClients/twitch/client";
import toast from "react-hot-toast";
import { reduxStore } from "@/redux/store";

export const getUserInfo = () =>
  fetchApi({
    path: "user/getUserInfo",
  });

export const getUserToken = () =>
  fetchApi<string>({
    path: "user/getToken",
    includeUserId: true,
  });
interface NewUser {
  id: string;
  email: string;
  img: string;
  displayName: string;
}
export async function handleNewUserAccount() {
  const newUser: NewUser = {
    id: mainTwitchClient.account.id,
    email: mainTwitchClient.account.email,
    img: mainTwitchClient.account.profilePictureUrl,
    displayName: mainTwitchClient.account.displayName,
  };

  try {
    const token = await fetchApi<string>({
      path: "auth/login",
      includeUserId: true,
      data: { newUser },
    });

    return token;
  } catch (err) {
    console.log(err);
  }
}

export async function handleFreshUserLogin(userToken?: string) {
  const currentUser = auth.currentUser;

  //check if user exists
  if (currentUser) auth.signOut();

  //if no token is provided, get one
  if (!userToken) userToken = await getUserToken();

  signInWithCustomToken(auth, userToken)
    .then((userCredential) => {
      const user = userCredential.user;
      toast.success(`Welcome back ${user.displayName}!`, { icon: "👋" });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast(errorCode + "|" + errorMessage, { icon: "🔥" });
    })
    .finally(() => {
      reduxStore.dispatch.lzr.setIsLoading(false);
    });
}
