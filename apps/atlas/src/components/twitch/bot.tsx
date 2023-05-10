import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore, useDispatch } from "react-redux";
import { ReduxRootState, ReduxDispatch } from "@redux/store";
import { storeWatch } from "@utils/storeWatch";

import { botTwitchClient } from "@lzrClients/twitch/client";
import chroma from "chroma-js";

export default function TwitchBot() {
  const store = useStore<ReduxRootState>();
  const dispatch = useDispatch<ReduxDispatch>();
  const [isConnected, setIsConnected] = useState(
    store.getState().twitch.botIsConnected
  );

  const { botIsReady } = store.getState().twitch;
  const [isReady] = useState(botIsReady);

  function watchIsConnected() {
    const callback = (newVal, oldVal) => {
      setIsConnected(newVal);
    };

    return storeWatch<boolean>(callback, "twitch.botIsConnected");
  }

  useEffect(() => {
    const watchConnectedSub = watchIsConnected();

    return () => {
      watchConnectedSub();
    };
  }, []);

  function linkBotAccount() {
    dispatch.twitch.login("bot");
  }

  if (!isReady) return <div>LOADING</div>;

  if (!isConnected)
    return (
      <motion.div className="flex flex-1 flex-col items-center justify-center bg-white">
        <motion.button
          onClick={linkBotAccount}
          className=" rounded-xl p-3"
          style={{
            backgroundColor: chroma("black").alpha(0.5).hex(),
          }}
        >
          LINK YOUR BOT ACCOUNT
        </motion.button>
      </motion.div>
    );

  const { account } = botTwitchClient;
  return (
    <motion.div
      layout
      className="flex flex-1 flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        layout
        className="flex flex-col items-center justify-center relative z-10"
      >
        <motion.div layout className="text-2xl font-bold">
          {account.displayName}
        </motion.div>
        <motion.div layout className="text-xl font-bold">
          {account.name}
        </motion.div>
      </motion.div>

      <motion.img
        layout
        src={account.profilePictureUrl}
        className="h-full w-full object-cover absolute z-0 opacity-80"
      />

      <motion.div
        layout
        className="absolute bottom-4 right-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* popover button for sign out */}
        <button
          className="bg-white px-4 py-2 rounded-md"
          onClick={() => {
            botTwitchClient.freshLogin();
          }}
        >
          🖕🏾
        </button>
      </motion.div>
    </motion.div>
  );
}
