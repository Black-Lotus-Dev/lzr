import chroma from "chroma-js";
import { FinalColor } from "extract-colors/lib/types/Color";
import { motion, useAnimationControls } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useStore } from "react-redux";
import {
  imgEnterAnim,
  textEnterAnim,
  imgExitAnim,
  textExitAnim,
  imgChangeAnim,
  textChangeAnim,
} from "../constants/animations/current-song";
import { BaseSong, MusicState } from "../redux/slices/music";
import { ReduxDispatch, ReduxRootState } from "../redux/store";
import storeWatch from "../utils/store-watch";
import SongProgress from "./song-progress";
import { waitForLZRRoom } from "@utils/rtc";
import { CurrentSong } from "@pages/now-playing";

const songAnims = {
  start: {
    img: imgEnterAnim,
    text: textEnterAnim,
  },
  end: {
    img: imgExitAnim,
    text: textExitAnim,
  },
  song: {
    img: imgChangeAnim,
    text: textChangeAnim,
  },
};

const rainbow = chroma
  .scale(["red", "orange", "yellow", "green", "blue", "indigo", "violet"])
  .colors(7);

type SongEvent = "start" | "end" | "song" | "progress" | "none";

function CurrentSongOverlay() {
  const store = useStore<ReduxRootState>();

  //states
  const [song, setSong] = useState<BaseSong>();
  const [eventState, setEventState] = useState<SongEvent>("none");

  //hooks
  const dispatch = useDispatch<ReduxDispatch>();
  const imgAnimControls = useAnimationControls();
  const textAnimControls = useAnimationControls();
  const { colorPalette: userColorPalette, authUser: user } =
    dispatch.user.getUser(0);

  const userColorPaletteRef = useRef<FinalColor[] | undefined>(
    userColorPalette
  );

  const isPlayingRef = useRef<boolean>();
  const colorPalette = useRef<FinalColor[] | undefined>(userColorPalette);

  const isPayingRef = useRef<boolean>(store.getState().music.isPlaying);

  useEffect(() => {
    const unsubscribe = storeWatch<MusicState>((newVal, oldVal) => {
      parseNewSong(oldVal, newVal);
    }, "music");

    waitForLZRRoom("now-playing", (room) => {
      const musicChannel = room.createChannel<string>("🎵");
      const songChannel = room.createChannel<CurrentSong>("currentSong");

      //subscribe to the now playing channel
      musicChannel.get((res) => {
        if (res === "") {
        }
      });

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

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    runAnim();
  }, [song]);

  function startPlaying(newSong?: BaseSong) {
    isPlayingRef.current = true;
    setEventState("start");
  }

  function endPlaying(newSong?: BaseSong) {
    isPlayingRef.current = false;
    setEventState("end");
  }

  function changeSong(newSong?: BaseSong) {
    toast("Song Updated", { icon: "🎵" });
    setEventState("song");
  }

  function parseNewSong(oldVal: MusicState, newVal: MusicState) {
    const { song: oldSong, isPlaying: oldIsPlaying } = structuredClone(oldVal);
    const {
      song: newSong,
      isPlaying: newIsPlaying,
      albumArtColorPalette: newAlbumPalette,
    } = structuredClone(newVal);

    colorPalette.current = newAlbumPalette
      ? newAlbumPalette.sort((a, b) => b.area - a.area)
      : userColorPaletteRef.current;
    const playBackStateChanged = oldIsPlaying !== newIsPlaying;

    if (playBackStateChanged && newIsPlaying) startPlaying(newSong);
    else if (playBackStateChanged && !newIsPlaying) endPlaying(newSong);
    else if (!playBackStateChanged && !newIsPlaying) return;
    else if (!playBackStateChanged && oldSong?.name !== newSong?.name)
      changeSong(newSong);
    else if (!playBackStateChanged && oldSong?.progress !== newSong?.progress)
      setEventState("progress");

    setSong(newSong);
  }

  function runAnim() {
    if (eventState === "none" || eventState === "progress") return;
    const { img, text } = songAnims[eventState];
    imgAnimControls.start(img);
    textAnimControls.start(text);

    //close the text animation after 2 seconds
    setTimeout(() => {
      const { text } = songAnims["end"];
      textAnimControls.start(text);
    }, 2000);
  }

  if (isPlayingRef.current === null)
    return (
      <div className="relative">
        <motion.div className="h-20 w-20 rounded-full relative z-10 bg-white" />
        <motion.div
          animate={{
            backgroundColor: rainbow,
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="h-20 w-20 rounded-full absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-center"
          style={{
            filter: "blur(15px)",
          }}
        />
      </div>
    );

  if (!isPlayingRef.current || !song)
    return <motion.div className="h-20 w-20 rounded-full bg-white" />;

  const overlayTheme = colorPalette.current!.slice(0, 3);
  const [primaryColor, secondaryColor] = overlayTheme;

  const luma = chroma(primaryColor.hex).luminance();

  const albumImg = song ? song.album.images[0] : user?.photoURL ?? "";

  const trimmedSongName =
    song?.name.length > 20 ? song.name.slice(0, 20) + "..." : song?.name;

  const trimmedArtistName =
    song?.artists.join(", ").length > 20
      ? song.artists.join(", ").slice(0, 20) + "..."
      : song?.artists.join(", ");

  const progPercent = song?.progress / song?.duration;
  return (
    <>
      <motion.div
        layout
        className="w-60 h-60 overflow-hidden rounded-xl shadow-xl relative z-10"
        style={{
          boxShadow: `3px 3px 5px 2px ${chroma(
            luma < 0.5 ? primaryColor.hex : "black"
          )
            .alpha(1)
            .hex()}`,
        }}
        initial={{ rotate: -180, scale: 0 }}
        animate={imgAnimControls}
      >
        <motion.img
          layout
          className="w-full h-full absolute z-1 rounded-xl"
          src={albumImg}
          alt="albumImg"
        />
      </motion.div>

      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={textAnimControls}
        className="h-32 w-96 flex flex-col relative z-0 bg-transparent justify-center items-center shadow-xl rounded-xl rounded-tl-none rounded-bl-none"
      >
        {/* background image */}
        <div
          className=" bg-opacity-25 bg-cover w-full h-full absolute -z-1 rounded-xl rounded-tl-none rounded-bl-none"
          style={{
            filter: "blur(1px)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${albumImg})`,
            backgroundBlendMode: "overlay",
            backgroundColor: chroma(luma < 0.5 ? primaryColor.hex : "black")
              .alpha(0.5)
              .hex(),
            boxShadow: `3px 3px 5px 2px ${chroma(
              luma < 0.5 ? primaryColor.hex : "black"
            )
              .alpha(0.75)
              .hex()}`,
          }}
        />

        {/* song name */}
        <div
          className="relative flex-1 text-2xl text-white font-bold text-center w-full"
          style={{
            textShadow: `1px 1px 2px ${secondaryColor.hex}`,
          }}
        >
          {trimmedSongName}
        </div>

        {/* artist name */}
        <div
          className="relative flex-1 text-lg text-white font-bold text-center w-full"
          style={{
            textShadow: `1px 1px 2px ${secondaryColor.hex}`,
          }}
        >
          {trimmedArtistName}
        </div>

        {/* progress bar */}
        <SongProgress />
      </motion.div>
    </>
  );
}

export default CurrentSongOverlay;
