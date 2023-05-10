import { AnimatePresence, motion } from "framer-motion";

import ObsLogo from "../assets/images/obs-logo.png";
import SpotifyLogo from "../assets/images/Spotify-logo.png";
import TwitchLogo from "../assets/images/twitch-logo.png";
import StreamDeckLogo from "../assets/images/stream-deck-logo.png";
import { useRef, useState } from "react";
import chroma from "chroma-js";
import ObsModal from "../components/obs/obsModal";
import TwitchModal from "../components/twitch/twitchModal";
import MusicModal from "../components/music/musicModal";
import { useDispatch } from "react-redux";
import { ReduxDispatch } from "@/redux/store";

const clientNames = ["twitch", "music", "obs", "streamdeck"] as const;
interface UserClients {
  name: typeof clientNames[number];
  logo: string | JSX.Element;
}

const clients: UserClients[] = [
  {
    name: "twitch",
    logo: TwitchLogo,
  },
  {
    name: "music",
    logo: SpotifyLogo,
  },
  {
    name: "obs",
    logo: ObsLogo,
  },
  {
    name: "streamdeck",
    logo: StreamDeckLogo,
  },
];

export default function UserHome() {
  const dispatch = useDispatch<ReduxDispatch>();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const clientRef = useRef<"twitch" | "music" | "obs" | "streamdeck">();

  function openSection(
    e: React.MouseEvent<HTMLButtonElement>,
    client: "twitch" | "music" | "obs" | "streamdeck"
  ) {
    e.preventDefault();
    clientRef.current = client;

    setModalIsOpen(true);
  }

  function closeModal(e?: React.MouseEvent<HTMLDivElement>) {
    //if user clicked on modal then dont close by default
    if (e && e.target !== e.currentTarget) return;

    setModalIsOpen(false);
  }

  const ShowClientModal = () => {
    switch (clientRef.current) {
      case "twitch":
        return <TwitchModal />;
      case "music":
        return <MusicModal />;
      case "obs":
        return <ObsModal />;
      case "streamdeck":
        return <div>streamdeck</div>;
      default:
        return <div>default</div>;
    }
  };

  return (
    <motion.div
      layout
      className="h-full w-full flex items-center justify-center"
    >
      <motion.div
        onClick={closeModal}
        layout
        className="w-full h-full fixed flex justify-center items-center"
        style={{ backgroundColor: chroma("black").alpha(0.5).hex() }}
        initial={{ opacity: 0, transformOrigin: "center", zIndex: -1 }}
        animate={{
          zIndex: modalIsOpen ? 10 : -1,
          opacity: modalIsOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
          zIndex: { delay: modalIsOpen ? 0 : 0.35 },
        }}
      >
        <AnimatePresence>{modalIsOpen && <ShowClientModal />}</AnimatePresence>
      </motion.div>

      {/* make buttons for each client */}
      <motion.div
        layout
        className="w-full h-32 flex items-center justify-evenly"
      >
        {clients.map((client, index) => {
          return (
            <motion.button
              key={index}
              onClick={(e) => openSection(e, client.name)}
              layout
              className="rounded-full h-20 w-20 bg-white flex items-center justify-center shadow-xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: [50, -50, 0],
                transition: {
                  duration: 0.25,
                  delay: 0.15 + index * 0.1,
                },
              }}
              whileHover={{
                scale: 1.25,
                transition: { duration: 0.1, delay: 0 },
              }}
            >
              {typeof client.logo === "string" ? (
                <motion.img layout src={client.logo} className="h-3/5 w-3/5" />
              ) : (
                client.logo
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
