import { BaseSong } from "@redux/slices/music";
import CurrentSongOverlay from "@components/current-song";
import { FinalColor } from "extract-colors/lib/types/Color";

export type CurrentSong =
  | {
      isPlaying: false;
      updatedAt: Date;
    }
  | {
      albumArtColorPalette: FinalColor[];
      song?: BaseSong;
      isPlaying?: true;
    };

const NowPlaying = () => (
  <div className="h-full w-full flex justify-center items-center relative">
    <CurrentSongOverlay />
  </div>
);

export default NowPlaying;
