import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LandingPage from "./landing";
import User from "./user";
import { useEffect } from "react";

import { useDispatch, useStore } from "react-redux";
import { ReduxDispatch, ReduxRootState } from "../redux/store";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  useFirebaseApp,
  AuthProvider,
  FirestoreProvider,
  StorageProvider,
} from "reactfire";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import GlobalLoader from "@/components/loader/loader";
import { mainTwitchClient } from "@/lzrClients/twitch/client";
import { useStoreWatch } from "@/utils/storeWatch";
import { hostLZRRoom } from "ggpo/utils";
import { runUserAuthSubscribers } from "@/utils/user";
import { hub } from "@/lzrClients/hub/client";

export default function App() {
  //hooks
  const appIsReady = useStoreWatch<boolean>(
    "lzr.isReady",
    (oldIsReady, newIsReady) => {
      return newIsReady;
    }
  );

  const app = useFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  const store = useStore<ReduxRootState>();
  const dispatch = useDispatch<ReduxDispatch>();
  const navigate = useNavigate();

  //refs
  const isFirstRun = React.useRef(true);
  const hasAutoLoggedIn = React.useRef(false);

  //states
  const [user, setUser] = React.useState(auth.currentUser);

  function afterStartUp() {
    auth.onAuthStateChanged((user) => {
      if (user === null) {
        setTimeout(() => {
          if (store.getState().lzr.isLoading && user === null)
            dispatch.lzr.setIsLoading(false);
        }, 2000);
      } else if (user !== null && !mainTwitchClient.account) {
        //if the user is logged in but the main twitch client is not connected
        //in this case we should sign out the user
        //this is a safety measure to prevent the user from being logged in
        //but not being able to use the app
        // auth.signOut();
        console.log(
          "user is logged in but main twitch client is not connected"
        );
      }

      setUser(user);
      dispatch.user.setAuthUser(user);
    });

    dispatch.lzr.setVal({ isReady: true, isLoading: false });
  }

  useEffect(() => {
    if (!isFirstRun.current) return;
    isFirstRun.current = false;

    //run all startup functions in parallel
    const reduxStartupPromises = [
      dispatch.twitch.startup(),
      dispatch.music.startup(),
      dispatch.obs.startup(),
      hub.startup(),
    ];

    Promise.allSettled(reduxStartupPromises)
      .then(afterStartUp)
      .catch((err) => {
        toast("Startup failed", { icon: "🚨" });
      });
  }, []);

  useEffect(() => {
    if (user && !hasAutoLoggedIn.current) {
      dispatch.lzr.setIsLoading(false);
      hasAutoLoggedIn.current = true;

      // start a new lzr host room for the user
      hostLZRRoom("lzr", app, user.uid);

      runUserAuthSubscribers();
      navigate("/user");
    }
  }, [user]);

  return (
    <motion.div layout className="h-screen w-screen">
      {/* only show the global loader if the app is already ready */}
      {appIsReady && <GlobalLoader />}

      {/* 
        handle the loading if the app isnt ready
        //TODO: make this more elegant, maybe use a loading screen
      */}
      <AnimatePresence>
        {!appIsReady && (
          <motion.div
            layout
            className="h-screen w-screen fixed top-0 left-0"
            initial={{ opacity: 0, zIndex: 100 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, zIndex: -100 }}
            transition={{ duration: 0.25 }}
          >
            <GlobalLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {user && (
        <motion.div
          layout
          className="fixed bottom-4 left-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* popover button for sign out */}
          <button
            className="bg-white px-4 py-2 rounded-md"
            onClick={() => {
              auth.signOut();
            }}
          >
            🖕🏾
          </button>
        </motion.div>
      )}

      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={db}>
          <StorageProvider sdk={storage}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/user" element={<User />} />
            </Routes>
          </StorageProvider>
        </FirestoreProvider>
      </AuthProvider>
    </motion.div>
  );
}
