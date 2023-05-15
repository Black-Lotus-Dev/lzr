import { LZRChannel, LZRGuest } from "@black-lotus-dev/ggpo";
import { waitForLzrRoom } from "@utils/rtc";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Hub() {
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<LZRGuest>();
  const hubChannel = useRef<LZRChannel<string>>();

  function emitObsRequest(event: string, data?: any) {
    const dataString = JSON.stringify({ event, data });
    hubChannel.current!.send(dataString);
  }

  function startHub() {
    if (!room) return;
    hubChannel.current = room.createChannel<string>("hub");

    hubChannel.current.get((res) => {
      const { event, data } = JSON.parse(res);

      if (event === "connect-request") {
        setIsConnected(true);
        emitObsRequest("get-actions");
      }

      if (event === "get-settings") {
        emitObsRequest("get-settings");
      } else if (event === "obs-client") {
        // we just started the obs client on the lzr app
        emitObsRequest("set-settings");
      }
    });

    emitObsRequest("connect-request");
  }

  useEffect(() => {
    !!room && startHub();
  }, [room]);

  useEffect(() => {
    waitForLzrRoom("hub", (room) => {
      setRoom(room);
    });
  }, []);

  if (!room || !isConnected) return <div>Loading...</div>;

  return (
    <motion.div className="h-full w-full bg-black flex justify-center items-center gap-10 flex-wrap">
      {/* square button that increases in opacity when hovered */}
      <motion.button
        className="w-32 h-32 shadow-lg rounded-lg flex justify-center items-center text-center bg-white text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        whileHover={{ opacity: 1 }}
        whileTap={{ opacity: 0.5 }}
        onClick={() => {
          hubChannel.current!.send(
            JSON.stringify({
              event: "obs-switch-camera",
              data: { camera: "H" },
            })
          );
        }}
      >
        Switch To Camera H
      </motion.button>

      <motion.button
        className="w-32 h-32 shadow-lg rounded-lg flex justify-center items-center text-center bg-white text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        whileHover={{ opacity: 1 }}
        whileTap={{ opacity: 0.5 }}
        onClick={() => {
          hubChannel.current!.send(
            JSON.stringify({
              event: "obs-switch-camera",
              data: { camera: "V" },
            })
          );
        }}
      >
        Switch To Camera V
      </motion.button>
    </motion.div>
  );
}
