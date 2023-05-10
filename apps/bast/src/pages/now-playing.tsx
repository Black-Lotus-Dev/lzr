import { useEffect } from "react";
import { ReduxDispatch } from "@redux/store";
import { useDispatch } from "react-redux";
import { BaseSong } from "@redux/slices/music";
import CurrentSongOverlay from "@components/current-song";
import { FinalColor } from "extract-colors/lib/types/Color";
import { waitForLzrRoom } from "@utils/rtc";

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

export default function NowPlaying() {
  const dispatch = useDispatch<ReduxDispatch>();

  useEffect(() => {
    waitForLzrRoom("now-playing", (room) => {
      const songChannel = room.createChannel<CurrentSong>("currentSong");

      songChannel.get((res) => {
        if (res.isPlaying) {
          const { song, isPlaying, albumArtColorPalette } = res;
          dispatch.music.updateCurrentSong({
            song,
            isPlaying,
            albumArtColorPalette,
          });
        } else {
          dispatch.music.updateCurrentSong({
            isPlaying: false,
          });
        }
      });
    });
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center relative">
      <CurrentSongOverlay />
    </div>
  );
}
