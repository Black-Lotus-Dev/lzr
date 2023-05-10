import PrefsLZRSlice from "@lzrTypes/store/prefs";
import defaultLZRBaseSlice from "./base";

// create default state
const defaultPrefsStore: PrefsLZRSlice = {
  theme: "dark",
  language: "en",
  showNotifications: true,
  startMinimized: false,
  minimizeToTray: false,
  windowBounds: {
    width: 800,
    height: 600,
    x: 0,
    y: 0,
  },
  ...defaultLZRBaseSlice,
};

export { defaultPrefsStore };
