import { AnimatePresence, motion } from "framer-motion";

import ObsLogo from "../assets/images/obs-logo.png";
import SpotifyLogo from "../assets/images/Spotify-logo.png";
import TwitchLogo from "../assets/images/twitch-logo.png";
import StreamDeckLogo from "../assets/images/stream-deck-logo.png";
import StreamBotLogo from "../assets/images/streamer-bot-logo.png";
import { useRef, useState } from "react";
import chroma from "chroma-js";
import ObsModal from "../components/client/obs/obsModal";
import StreamerBotModal from "../components/client/streamerbot/streamerbotModal";
import TwitchModal from "../components/client/twitch/twitchModal";
import MusicModal from "../components/client/music/musicModal";
import useStreamerBotClient from "@/hooks/useStreamerBotClient";

const clientNames = [
  "twitch",
  "music",
  "obs",
  "streamdeck",
  "streamerbot",
] as const;
type ClientNames = (typeof clientNames)[number];
interface UserClients {
  name: ClientNames;
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
  {
    name: "streamerbot",
    logo: StreamBotLogo,
  },
];

export default function UserHome() {
  const [clientState, sbClient] = useStreamerBotClient();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const clientRef = useRef<ClientNames>();

  function openSection(
    e: React.MouseEvent<HTMLButtonElement>,
    client: ClientNames
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
      case "streamerbot":
        return <StreamerBotModal />;
      default:
        return <></>;
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
              className="relative rounded-full h-20 w-20 flex items-center justify-center shadow-xl"
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
              {/* badge to indicate if client is running */}
              {client.name === "streamerbot" && (
                <motion.div
                  layout
                  className="absolute w-4 h-4 rounded-full z-1 right-0 top-0"
                  animate={{
                    backgroundColor: clientState.isConnected
                      ? "#10B981"
                      : "#EF4444",
                    transition: { duration: 0.25, delay: 0.25 },
                  }}
                />
              )}

              <motion.img
                layout
                initial={{ opacity: 0.75 }}
                src={client.logo as string}
                whileHover={{
                  opacity: 1,
                  transition: { duration: 0.1, delay: 0 },
                }}
                className="object-contain h-14 w-14"
              />
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
