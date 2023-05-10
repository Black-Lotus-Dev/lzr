import { motion } from "framer-motion";
import TwitchBot from "./bot";
import TwitchMain from "./main";

export default function TwitchModal() {
  return (
    <motion.div
      layout
      className="w-1/2 h-1/2 rounded-xl z-10 overflow-hidden shadow-xl"
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
      <motion.div className="w-full h-full flex flex-col">
        <TwitchMain />
        <TwitchBot />
      </motion.div>
    </motion.div>
  );
}
