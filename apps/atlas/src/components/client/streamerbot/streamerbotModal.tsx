import { motion } from "framer-motion";
import { useRef } from "react";
import useStreamerBotClient from "@/hooks/useStreamerBotClient";

export default function ObsModal() {
  const [clientState, sbClient] = useStreamerBotClient();
  const { host, port, endpoint } = clientState.wsConfig;

  console.log("clientState", clientState);
  const addressRef = useRef<string>(host);
  const portRef = useRef<number>(port);
  const endpointRef = useRef<string>(endpoint);

  async function saveSettings() {
    sbClient.updateWsConfig({
      host: addressRef.current,
      port: portRef.current,
      endpoint: endpointRef.current,
    });
  }

  const { connectOnStartup } = sbClient.state;

  return (
    <motion.div
      layout
      className="w-1/2 h-1/2 relative rounded-xl z-10 overflow-hidden shadow-xl bg-cyan-900 bg-opacity-50 justify-center items-center flex flex-col"
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
      <motion.div
        layout
        className="absolute bottom-4 left-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* popover button for sign out */}
        <button
          className="bg-white px-4 py-2 rounded-md"
          onClick={() => {
            sbClient.toggleConnectOnStartup();
          }}
        >
          {connectOnStartup ? "🟢" : "🔴"}
        </button>
      </motion.div>

      <motion.div className="flex-1 flex-row form-control w-full max-w-xs gap-5">
        <motion.div className="flex flex-auto flex-col">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            defaultValue={addressRef.current}
            type="text"
            placeholder="127.0.0.1"
            className="input input-bordered w-full max-w-xs"
            onInput={(e) => (endpointRef.current = e.currentTarget.value)}
          />
        </motion.div>

        <motion.div className="flex w-32 flex-col">
          <label className="label">
            <span className="label-text">Port</span>
          </label>
          <input
            defaultValue={portRef.current}
            type="number"
            placeholder="8000"
            className="input input-bordered w-full max-w-xs"
            onInput={(e) => (portRef.current = Number(e.currentTarget.value))}
          />
        </motion.div>
      </motion.div>

      <motion.div className="flex-1 form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Endpoint</span>
        </label>
        <input
          defaultValue={endpointRef.current}
          type="text"
          className="input input-bordered w-full max-w-xs"
          onInput={(e) => (endpointRef.current = e.currentTarget.value)}
        />
      </motion.div>

      <motion.div className="flex w-full max-w-xs justify-end mb-2">
        <motion.button onClick={saveSettings} className="btn btn-outline">
          Update
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
