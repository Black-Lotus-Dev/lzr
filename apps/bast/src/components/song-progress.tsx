import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { MusicState } from "@redux/slices/music";
import { ReduxRootState } from "@redux/store";
import storeWatch from "@utils/store-watch";
import toast from "react-hot-toast";
import { motion, useAnimationControls } from "framer-motion";

export default function SongProgress() {
	const store = useStore<ReduxRootState>();
	const progressAnimControls = useAnimationControls();

	const progressInterval = useRef<NodeJS.Timeout>();
	const progressRef = useRef<number>(0);
	const isPayingRef = useRef<boolean>(store.getState().music.isPlaying);

	const [progress, setProgress] = useState(
		store.getState().music.song?.progress ?? 0
	);
	const [duration, setDuration] = useState(
		store.getState().music.song?.duration ?? 0
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	function startProgressInterval() {
		if (!isPayingRef.current) return;

		if (progressInterval) {
			progressInterval.current = undefined;
			progressInterval.current = setInterval(() => {
				progressRef.current += 1000;
				const progPercent = (progressRef.current / duration) * 100;
				progressAnimControls.start({
					width: `${progPercent}%`,
					transition: {
						duration: 1,
						ease: "easeOut",
					},
				});
			}, 1000);
		}
	}

	useEffect(() => {
		const unsubscribe = storeWatch<MusicState>((newVal, oldVal) => {
			const { isPlaying, song } = newVal;
			clearInterval(progressInterval.current);
			if (!isPlaying) {
				isPayingRef.current = false;
				toast("Song paused", { icon: "⏸️" });
				setProgress(0);
				setDuration(0);
				return;
			}

			isPayingRef.current = true;

			setProgress(song!.progress);
			setDuration(song!.duration);
		}, "music");

		return () => {
			unsubscribe();
			clearInterval(progressInterval.current);
		};
	}, []);

	useEffect(() => {
		progressRef.current = progress;
		startProgressInterval();
	}, [progress, startProgressInterval]);

	return (
		<motion.div
			layout
			className="h-4 relative flex justify-left bg-white"
			animate={progressAnimControls}
		/>
	);
}
