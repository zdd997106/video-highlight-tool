import { findLastIndex, orderBy } from "lodash";
import { useMemo, useState } from "react";

import { Transcript, VideoControl } from "src/types";

import { useCurrentTimeEffect } from "./useCurrentTime";

// ----------

export const useClipsControl = (arg: {
  videoControl: VideoControl;
  transcripts: Transcript[];
  transition?: number;
}) => {
  const control = arg.videoControl;
  const transition = arg.transition || 0;

  const [isTransitioning, setIsTransitioning] = useState(false);

  const transcripts = useMemo(
    () => orderBy(arg.transcripts, "start"),
    [arg.transcripts]
  );

  const startPoints = useMemo(
    () => transcripts.map((transcript) => transcript.start),
    [transcripts]
  );

  const start = useMemo(() => transcripts[0]?.start || 0, [transcripts]);

  const end = useMemo(
    () => transcripts[transcripts.length - 1]?.end || control.state.duration,
    [control, transcripts]
  );

  // --- FUNCTIONS ---

  const toPrevious = () => {
    const index = getPreviousStartPointIndex();

    // [NOTE] Special rule
    // if the current time is exactly on a breakpoint, it should go to the previous one.
    if (index > 0 && startPoints[index] === control.currentTime()) {
      control.seek(startPoints[index - 1]);
      return;
    }

    if (index >= 0) control.seek(startPoints[index]);
    else control.seek(start);
  };

  const toNext = () => {
    const index = getPreviousStartPointIndex();
    if (index < startPoints.length - 1) control.seek(startPoints[index + 1]);
    else control.seek(end);
  };

  const play = () => {
    if (control.currentTime() >= end) {
      control.seek(start);
      control.play();
      return;
    }

    if (control.currentTime() <= start) {
      control.seek(start);
      control.play();
      return;
    }

    control.play();
  };

  const getPreviousStartPointIndex = () => {
    const currentTime = control.currentTime();
    return findLastIndex(
      startPoints,
      (breakpoint) => currentTime >= breakpoint
    );
  };

  const getCurrentTranscript = () => {
    const index = getPreviousStartPointIndex();
    const transcript = transcripts[index];
    const currentTime = control.currentTime();

    if (
      !transcript ||
      currentTime < transcript.start ||
      currentTime > transcript.end
    )
      return null;

    return transcript;
  };

  // --- EFFECTS ---

  useCurrentTimeEffect(control, (time) => {
    if (!transcripts.length) return;

    const index = getPreviousStartPointIndex();
    const currentTranscript = transcripts[index];

    if (!currentTranscript) {
      control.seek(start);
      return;
    }

    if (time >= end) {
      if (time !== end) control.seek(end);
      control.pause();
      return;
    }

    if (time >= transcripts[index].end) {
      control.seek(transcripts[index + 1].start);
      return;
    }
  });

  useCurrentTimeEffect(control, (time) => {
    if (!transcripts.length) return;

    const index = getPreviousStartPointIndex();
    const currentTranscript = transcripts[index];

    if (
      currentTranscript.end < end &&
      currentTranscript.end - time < transition / 2
    ) {
      setIsTransitioning(true);
    } else {
      setIsTransitioning(false);
    }
  });

  return {
    ...control,
    play,
    toNext,
    toPrevious,
    getCurrentTranscript,
    isTransitioning,
  };
};
