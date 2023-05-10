import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/app";
import { Provider } from "react-redux";
import { reduxStore } from "./redux/store";
import { MemoryRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles/app.css";
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from "./configs/firebase";
import { window } from "@tauri-apps/api";
import { TauriEvent } from "@tauri-apps/api/event";
import { lzrStoreManager } from "./lzrStore/lzrStoreManager";

var isSaving = false;
window.getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, async () => {
  if (isSaving) return;
  isSaving = true;

  lzrStoreManager.saveAll();
  isSaving = false;

  //close and exit the app
  window.appWindow.close();
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
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
