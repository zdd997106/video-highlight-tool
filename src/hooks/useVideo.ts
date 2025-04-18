import { useEffect, useRef, useState } from "react";

import { VideoControl } from "src/types";

// ----------

export const useVideo = (url: string): VideoControl => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // --- FUNCTIONS ---

  const play = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setPlaying(isPlaying());
  };

  const pause = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setPlaying(isPlaying());
  };

  const seek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  const isPlaying = () => {
    if (!videoRef.current) return false;
    return !videoRef.current.paused && !videoRef.current.ended;
  };

  // --- EFFECTS ---

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const callback = () => setDuration(video.duration);
    video.addEventListener("loadedmetadata", callback);
    return () => {
      video.removeEventListener("loadedmetadata", callback);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const callback = () => setPlaying(isPlaying());
    video.addEventListener("ended", callback);
    return () => {
      video.removeEventListener("ended", callback);
    };
  });

  return {
    ref: videoRef,
    state: { playing, duration, src: url },
    play,
    pause,
    seek,
  };
};
