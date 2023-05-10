import { motion } from "framer-motion";
import { obsClient } from "@lzrClients/obs/client";
import { ReduxRootState } from "@/redux/store";
import { useStore } from "react-redux";
import { useAuth } from "reactfire";
import { useRef } from "react";

export default function ObsModal() {
  const auth = useAuth();
  const store = useStore<ReduxRootState>();

  const { wsPassword, wsPort, wsIp } = obsClient.getObsWsSettings();

  const passwordRef = useRef<string>(wsPassword);
  const portRef = useRef<string>(wsPort);
  const ipRef = useRef<string>(wsIp);

  async function saveSettings() {
    const res = await obsClient.updateObsWsSettings(
      ipRef.current,
      portRef.current,
      passwordRef.current
    );

    console.log(res);
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
            <span className="label-text">Server Ip</span>
          </label>
          <input
            defaultValue={wsIp}
            type="text"
            placeholder="192.168.1.224"
            className="input input-bordered w-full max-w-xs"
            onInput={(e) => (ipRef.current = e.currentTarget.value)}
          />
        </motion.div>

        <motion.div className="flex w-32 flex-col">
          <label className="label">
            <span className="label-text">Server Port</span>
          </label>
          <input
            defaultValue={wsPort}
            type="text"
            placeholder="4455"
            className="input input-bordered w-full max-w-xs"
            onInput={(e) => (portRef.current = e.currentTarget.value)}
          />
        </motion.div>
      </motion.div>

      <motion.div className="flex-1 form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Server Password</span>
        </label>
        <input
          defaultValue={wsPassword}
          type="text"
          placeholder="****************"
          className="input input-bordered w-full max-w-xs"
          onInput={(e) => (passwordRef.current = e.currentTarget.value)}
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
