import { useEffect, useRef, useState } from "react";

import { VideoControl } from "src/types";

// ----------

interface UseCurrentTimeOptions {
  getValue?: (currentTime: number) => number;
}

export function useCurrentTime(
  videoControl: VideoControl,
  options: UseCurrentTimeOptions = {}
) {
  const [currentTime, setCurrentTime] = useState(0);

  const getValueRef = useRef((currentTime: number) => currentTime);
  getValueRef.current = options.getValue || ((currentTime) => currentTime);

  // --- EFFECTS ---

  useCurrentTimeEffect(videoControl, (time) => {
    setCurrentTime(getValueRef.current(time));
  });

  return currentTime;
}

export function useCurrentTimeEffect(
  videoControl: VideoControl,
  callback: (currentTime: number) => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!videoControl.ref.current) return;
    const video = videoControl.ref.current;

    const timeupdate = () => callbackRef.current(video.currentTime);
    video.addEventListener("timeupdate", timeupdate);
    return () => {
      video.removeEventListener("timeupdate", timeupdate);
    };
  }, [videoControl.ref]);
}
