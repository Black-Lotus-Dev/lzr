import chroma from "chroma-js";
import { AnimatePresence, motion } from "framer-motion";
import { getMusicClient } from "@lzrClients/music/client";
import { ReduxRootState, ReduxDispatch } from "@/redux/store";
import { useRef, useState } from "react";
import { useStore, useDispatch } from "react-redux";
import { useStoreWatch } from "@/utils/storeWatch";
import { MusicReduxSlice } from "@/types/redux/music";
import { useAuth } from "reactfire";
import { Device } from "spotify-web-api-ts/types/types/SpotifyObjects";

function SpotifyLogin() {
  const musicClient = getMusicClient();
  function linkSpotifyAccount() {
    musicClient.spotify.login();
  }

  return (
    <motion.div
      className="
        w-full h-full
        rounded-xl z-10 shadow-xl
        justify-center items-center flex
        bg-white
      "
    >
      <motion.button
        onClick={linkSpotifyAccount}
        className="rounded-xl p-3"
        style={{
          backgroundColor: chroma("black").alpha(0.5).hex(),
        }}
      >
        LINK YOUR SPOTIFY ACCOUNT
      </motion.button>
    </motion.div>
  );
}

export default function MusicModal() {
  const auth = useAuth();
  const store = useStore<ReduxRootState>();
  const dispatch = useDispatch<ReduxDispatch>();
  const devices = useRef<Device[]>([]);

  const [loadingDevices, setLoadingDevices] = useState(true);

  const account = useStoreWatch<MusicReduxSlice["spotifyState"]["account"]>(
    "music.spotifyState.account"
  );

  function AccountCard() {
    //get first image from account if it exists
    //otherwise use the default image
    const spotImg = account.images[0]?.url ?? auth.currentUser.photoURL;

    return (
      <motion.div className="w-full h-full flex justify-center items-center relative overflow-hidden bg-black">
        <motion.div className="relative flex h-full w-full justify-center items-center z-[1]">
          {account.display_name}
        </motion.div>

        {/* section to show user their spotify devices */}
        <motion.div className="absolute flex h-full w-full justify-center items-center z-[1]">
          <motion.ul>
            {devices.current.map((device) => (
              <motion.li>{device.name}</motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.img
          layout
          className="absolute flex h-full w-full object-cover object-center -z-[0] opacity-70"
          src={spotImg}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="w-1/2 h-1/2 rounded-xl z-10 overflow-hidden shadow-xl justify-center items-center flex"
      initial={{ y: 100 }}
      animate={{
        y: 0,
        transition: { duration: 0.25, ease: "easeInOut" },
      }}
      exit={{
        y: -100,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeInOut" },
      }}
    >
      <AnimatePresence>
        {!account ? <SpotifyLogin /> : <AccountCard />}
      </AnimatePresence>
    </motion.div>
  );
}
