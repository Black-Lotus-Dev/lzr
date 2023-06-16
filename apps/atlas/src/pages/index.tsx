// create a component that implements our app

import React, { useEffect } from "react";
import App from "./app";
import { Provider } from "react-redux";
import { reduxStore } from "../redux/store";
import { MemoryRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from "../configs/firebase";

const Root = () => {
  return (
    <React.StrictMode>
      <Router>
        <Provider store={reduxStore}>
          <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <App />
            <Toaster position="bottom-right" reverseOrder={false} />
          </FirebaseAppProvider>
        </Provider>
      </Router>
    </React.StrictMode>
  );
};

export default Root;
