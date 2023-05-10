import { TwitchMsg } from "@pages/chat";
import chroma from "chroma-js";
import { motion } from "framer-motion";

export function ChatMsg({ message, msg, color, userImg }: TwitchMsg) {
  //our emotes will be between |%| and |%%| so we need to split the message by those
  const emoteRegex = /\|%\|(.+?)\|%%\|/g;

  //use the regex to find all the emotes in the message
  const emotes = message.match(emoteRegex);

  //create a unique list of emotes using the emote url
  const uniqueEmotes = emotes?.filter((emote, index) => {
    return emotes?.indexOf(emote) === index;
  });

  //split the message by the emotes
  const splitMsg = message.split(emoteRegex);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: [0.25, 0.5, 1], y: [100, -25, 0] }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "spring",
        duration: 0.4,
      }}
      className="w-full mb-1 flex justify-between gap-2 p-2"
      style={{
        borderColor: chroma(color).brighten(1).hex(),
      }}
    >
      <motion.div
        layout
        className="h-14 w-14 relative flex justify-center items-center"
      >
        <motion.img
          layout
          className="h-full w-full rounded-full relative z-[1]"
          style={{
            borderColor: chroma(color).brighten(1).hex(),
          }}
          src={userImg}
        />
        <motion.div
          animate={{
            rotate: [0, 180],
            scale: [1, 1.1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          layout
          className="h-full w-full rounded-full absolute z-0 border-x-4"
          style={{
            borderColor: chroma(color).brighten(1).hex(),
          }}
        />
      </motion.div>
      <motion.div
        layout
        className="min-w-0 flex flex-1 shadow-2xl bg-white bg-opacity-5 rounded-md p-2 text-white"
      >
        <motion.div className="w-full h-full break-words">
          {/* loop through the split message and then check if theres any emotes */}
          {splitMsg.map((msg, i) => {
            //check if this part is an emote
            const isEmote = uniqueEmotes?.find(
              (emote) => emote === `|%|${msg}|%%|`
            );

            //if it is an emote, return the emote
            if (isEmote) {
              return (
                <motion.img
                  layout
                  key={i}
                  className="h-10 w-10 inline-block  break-words"
                  src={msg}
                />
              );
            } else {
              //if its not an emote, return the text
              return (
                <motion.span layout key={i}>
                  {msg}
                </motion.span>
              );
            }
          })}
        </motion.div>
      </motion.div>
    </motion.li>
  );
}
