import { waitForLZRRoom } from "@utils/rtc";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type WTPProps =
  | {
      event: "start";
      data: WTPGameStart;
    }
  | {
      event: "end";
      data: WTPGameEnd;
    };

interface WTPGameStart {
  pokemon: {
    name: string;
    image: string;
    types: string[];
  };
  gen: string;
}

interface WTPGameEnd {
  winners: string[];
}

export default function WTP() {
  const [gameState, setGameState] = useState<string>();
  const wtpGameRef = useRef<WTPProps>();

  useEffect(() => {
    waitForLZRRoom("wtp", (room) => {
      const wtpChannel = room.createChannel<WTPProps>("wtp-game");
      wtpChannel.get((res) => {
        wtpGameRef.current = res;
        setGameState(res.event);
      });
    });
  }, []);

  function getPokemon() {
    return wtpGameRef.current?.data as WTPGameStart;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: !gameState || gameState === "end" ? "0" : "1",
      }}
      className="h-full w-full flex justify-center items-center relative"
    >
      {gameState === "start" && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <motion.video autoPlay className="h-full w-full">
            <source src="/assets/wtp/wtp-bg.mp4" type="video/mp4" />
          </motion.video>

          <motion.div className="absolute top-[100px] left-[250px] w-[600px] h-[600px]">
            <motion.img
              src={
                "https://archives.bulbagarden.net/media/upload/0/06/0345Lileep.png"
              }
              alt={getPokemon().pokemon.name}
              className="h-full w-full"
              initial={{
                opacity: 0,
                filter: "brightness(0)",
              }}
              animate={{
                opacity: 1,
                filter: "brightness(1)",
                transition: {
                  delay: 15,
                },
              }}
            />
          </motion.div>
        </div>
        // <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        //   <div className="flex flex-col items-center">
        //
        //   </div>
        // </div>
      )}
    </motion.div>
  );
}
