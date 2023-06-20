import { motion } from "framer-motion";
import { getStreamerBotClient } from "@lzrClients/streamerbot/client";
import { ReduxRootState } from "@/redux/store";
import { useStore } from "react-redux";
import { useAuth } from "reactfire";
import { useRef } from "react";

export default function ObsModal() {
  const auth = useAuth();
  const store = useStore<ReduxRootState>();

  const sbClient = getStreamerBotClient();

  const { host, port, endpoint } = sbClient.getWsConfig();

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

  return (
    <motion.div
      layout
      className="w-1/2 h-1/2 rounded-xl z-10 overflow-hidden shadow-xl bg-cyan-900 bg-opacity-50 justify-center items-center flex flex-col "
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
