import { GetServerSideProps } from "next";
import { useAuth } from "reactfire";
import { useEffect, useRef } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ReduxDispatch, ReduxRootState } from "../redux/store";
import { useDispatch, useStore } from "react-redux";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	return {
		props: { ...ctx.query },
	};
};

export default function Login() {
	const dispatch = useDispatch<ReduxDispatch>();
	const store = useStore<ReduxRootState>();
	const auth = useAuth();
	const router = useRouter();
	const tokenRef = useRef<string>();
	const forcedLogin = useRef(false);
	const user = useRef(auth.currentUser);

	const [attemptedRoute, setAttemptedRoute] = useState(
		store.getState().router.attemptedRoute
	);

	function login() {
    const broadcastChannel = new BroadcastChannel("login");
    const token = tokenRef.current;

    if (!token) {
      toast.error("No token provided");
      return;
    }

    signInWithCustomToken(auth, token)
      .then((userCredential) => {
        user.current = userCredential.user;
        dispatch.user.setUser(userCredential.user);
        if (attemptedRoute) router.push(attemptedRoute);
        // console.log();
        // broadcastChannel.postMessage("🎷 Logged In!");
      })
      .catch((error) => {
        // broadcastChannel.postMessage("🔥 BAD!");
        console.log(error);
      });
  }

  useEffect(() => {
    if (attemptedRoute) {
      forcedLogin.current = true;
    }
  }, []);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    tokenRef.current = e.target.value;
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center bg-white">
      <input
        onChange={handleTextChange}
        type="text"
        placeholder="Token"
        className="input input-bordered input-primary w-full max-w-xs mb-4"
      />
      <button className="btn" onClick={login}>
        Relinquish Control
      </button>
    </div>
  );
}
