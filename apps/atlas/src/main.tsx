import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/app.css";
import { window } from "@tauri-apps/api";
import { TauriEvent } from "@tauri-apps/api/event";
import { lzrStoreManager } from "./lzrStore/lzrStoreManager";
import Root from "./pages/index";

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
  <Root />
);
