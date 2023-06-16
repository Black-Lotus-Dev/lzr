import { waitForLZRRoom } from "@utils/rtc";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ActionReceiver } from "trystero";
import { TwitchPrivateMessage } from "@twurple/chat/lib/commands/TwitchPrivateMessage";
import { ChatMsg } from "@components/chat-overlay/chat-msg";

export interface TwitchMsg {
  id: string;
  userId: string;
  userName: string;
  color: string;
  userImg: string;
  message: string;
  msg: TwitchPrivateMessage;
  timeStamp: number;
}

export default function ChatOverlay() {
  const [messages, setMessages] = useState<TwitchMsg[]>([]);

  useEffect(() => {
    //if we hit the max messages, remove the oldest message
    if (messages.length >= 10) {
      setMessages((prev) => prev.slice(0, prev.length - 1));
    }
  }, [messages]);

  function addMessage(msg: TwitchMsg) {
    //add message to state
    setMessages((prev) => [msg, ...prev]);

    // remove this specific message by id after 5 seconds
    setTimeout(() => {
      setMessages((prev) => {
        return prev.filter((prevMsg) => prevMsg.id !== msg.id);
      });
    }, 10000);
  }

  useEffect(() => {
    waitForLZRRoom("chat", (guest) => {
      const chatChannel = guest.createChannel<TwitchMsg>("chat");

      chatChannel.get((msg) => {
        addMessage(msg);
      });
    });
  }, []);

  return (
    <motion.div
      layout
      className="h-full w-full flex justify-center items-center"
    >
      <motion.div
        layout
        className="h-[700px] w-[450px] rounded-xl overflow-hidden"
      >
        <motion.ul
          layout
          className="h-full w-full p-2 flex flex-col-reverse bg-gradient-to-t from-gray-900 to-transparent"
        >
          <AnimatePresence initial={false}>
            {messages.map((twitchMsg) => {
              const { id } = twitchMsg;
              return (
                <div key={id}>
                  <ChatMsg {...twitchMsg} />
                </div>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
