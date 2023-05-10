import { BaseLZRSlice } from './base';

// create  prefs store type
interface PrefsLZRSlice extends BaseLZRSlice {
  theme: string;
  language: string;
  showNotifications: boolean;
  startMinimized: boolean;
  minimizeToTray: boolean;
  windowBounds: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
}

export default PrefsLZRSlice;
