import axios from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";
import { apiUrl } from "@configs/auth";
import { joinLZRRoom } from "ggpo/utils";
import toast from "react-hot-toast";
import { useAuth, useFirebaseApp } from "reactfire";
import { signInWithCustomToken } from "firebase/auth";
import { loginUser } from "@utils/auth";

interface AuthProps {
  code: string;
  state: string;
  token: string;
  route?: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: { ...ctx.query },
  };
};

export default function Auth(props: any) {
  const app = useFirebaseApp();
  const auth = useAuth();
  const { code, state, token, route } = props;

  async function handleLogin() {
    if (!token) sendAuthData();
    else loginUser(token, route);
  }

  async function sendAuthData() {
    const room = joinLZRRoom("auth", app, state);
    const authChannel = room.createChannel<string>("auth");

    authChannel.get(async (token) => {
      const user = await loginUser(token);
      if (user) room.disconnect();
    });

    setTimeout(() => {
      authChannel.send(code);
    }, 1000);
  }

  useEffect(() => {
    handleLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Auth</h1>
    </div>
  );
}
