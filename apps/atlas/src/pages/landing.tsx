/* eslint-disable react/jsx-no-bind */
import chroma from "chroma-js";
import twitchLogo from "../assets/images/twitch-logo.png";
import { motion } from "framer-motion";
import { ReduxDispatch } from "../redux/store";
import { useDispatch } from "react-redux";

export default function LandingPage() {
  const dispatch = useDispatch<ReduxDispatch>();

  function startTwitchLogin() {
    dispatch.twitch.login("main");
  }

  return (
    <motion.div
      layout
      className="h-full w-full flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        layout
        className="h-[169px] w-[420px] rounded-lg flex flex-col justify-center items-center cursor-pointer"
        style={{ backgroundColor: chroma("#FFFFFF").alpha(0.5).hex() }}
        onClick={startTwitchLogin}
      >
        <motion.img
          layout
          src={twitchLogo}
          alt="login via twitch"
          className="h-20 w-20 mb-5"
        />

        <motion.div layout className="text-white text-center text-xl">
          Click to login with your twitch account!
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
