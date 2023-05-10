import { useStoreWatch } from "@/utils/storeWatch";
import { AnimatePresence, motion } from "framer-motion";

export default function GlobalLoader() {
  const isLoading = useStoreWatch<boolean>("lzr.isLoading");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          layout
          className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-60 flex justify-center items-center"
          initial={{ opacity: 0, zIndex: -50 }}
          animate={{ opacity: 1, zIndex: 50 }}
          exit={{ opacity: 0, zIndex: -50 }}
        >
          {/* show circular loading animation */}
          <motion.div
            layout
            className="h-20 w-20 rounded-2xl flex items-center justify-between"
          >
            <motion.div
              layout
              className="h-5 w-5 rounded-full bg-white"
              initial={{ y: 10 }}
              animate={{ y: -10 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            <motion.div
              layout
              className="h-5 w-5 rounded-full bg-white"
              initial={{ y: 10 }}
              animate={{ y: -10 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.25,
              }}
            />

            <motion.div
              layout
              className="h-5 w-5 rounded-full bg-white"
              initial={{ y: 10 }}
              animate={{ y: -10 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
