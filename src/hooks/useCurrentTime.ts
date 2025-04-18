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

  useEffect(() => {
    if (!videoControl.ref.current) return;
    const video = videoControl.ref.current;
    video.addEventListener("timeupdate", () => {
      setCurrentTime(getValueRef.current(video.currentTime));
    });
  }, [videoControl.ref]);

  return currentTime;
}
