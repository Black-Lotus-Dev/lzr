import { auth } from "@configs/firebase";
import { signInWithCustomToken } from "firebase/auth";
import router from "next/router";
import toast from "react-hot-toast";

export async function loginUser(token: string, route?: string) {
  const userCredentials = await signInWithCustomToken(auth, token).catch(
    (error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast(errorMessage, { icon: "🔥" });
      return;
    }
  );

  if (userCredentials) {
    const { user } = userCredentials;
    toast.success(`Welcome back ${user.displayName}!`, { icon: "👋" });
    if (route) router.push(route);
    router.push("/hub");
    return user;
  }
}