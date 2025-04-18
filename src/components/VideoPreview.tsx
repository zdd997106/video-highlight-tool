import { sortBy } from "lodash";
import { useEffect, useMemo } from "react";
import { Box, IconButton, Stack, styled, Typography } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";

import { useCurrentTime } from "src/hooks";
import { Transcript, VideoControl } from "src/types";
import { formatTimestamp } from "src/utils";

import ProgressBar, { Highlight } from "./ProgressBar";

// ----------

export interface VideoPreviewProps {
  control: VideoControl;
  transcripts: Transcript[];
}

export function VideoPreview({ control, transcripts }: VideoPreviewProps) {
  const time = useCurrentTime(control);
  const transition = 0.5;

  // --- FUNCTIONS ---

  const getProgress = () => {
    if (!control.state.duration) return 0;
    return time / control.state.duration;
  };

  const togglePlay = () => {
    if (control.state.playing) control.pause();
    else control.play();
  };

  const sortedTranscripts = useMemo(
    () => sortBy(transcripts, "start"),
    [transcripts]
  );

  const transitionMaskOpen = useMemo(() => {
    return sortedTranscripts.some(
      (transcript) =>
        time > transcript.end - transition / 2 && time < transcript.end
    );
  }, [time]);

  // --- HANDLERS ---

  const toPreviousClip = () => {
    const last = [...sortedTranscripts]
      .reverse()
      .find((transcript) => transcript.end <= time);

    if (!last) return control.seek(0);
    control.seek(last.start);
  };

  const toNextClip = () => {
    const next = sortedTranscripts.find(
      (transcript) => transcript.start > time
    );

    if (!next) return control.seek(control.state.duration);
    control.seek(next.start);
  };

  useEffect(() => {
    if (sortedTranscripts.length === 0 || !control.ref.current) return;

    const currentTranscript = sortedTranscripts.find(
      (transcript) => transcript.start <= time && transcript.end >= time
    );

    if (!currentTranscript) toNextClip();
  }, [time]);

  // --- SECTION ELEMENTS ---

  const sections = {
    video: (
      <Stack position="relative">
        <Box
          component="video"
          width="100%"
          ref={control.ref}
          sx={{ aspectRatio: "16/9", bgcolor: "#000" }}
        >
          <source src={control.state.src} type="video/mp4" />
          Your browser does not support the video tag.
        </Box>
      </Stack>
    ),

    transitionMask: (
      <TransitionMask
        sx={{
          transition: `opacity ${transition}s`,
          opacity: transitionMaskOpen ? 1 : 0,
        }}
      />
    ),

    buttons: {
      previous: (
        <IconButton color="inherit" onClick={toPreviousClip}>
          <SkipPreviousOutlinedIcon />
        </IconButton>
      ),
      next: (
        <IconButton color="inherit" onClick={toNextClip}>
          <SkipNextOutlinedIcon />
        </IconButton>
      ),
      play: (
        <IconButton color="inherit" onClick={togglePlay}>
          <PlayArrowOutlinedIcon />
        </IconButton>
      ),
      pause: (
        <IconButton color="inherit" onClick={togglePlay}>
          <PauseOutlinedIcon />
        </IconButton>
      ),
    },

    timestamp: <Typography variant="body2">{formatTimestamp(time)}</Typography>,
  };

  return (
    <Stack direction="column" width="100%">
      <Typography variant="h6" marginBottom={2}>
        Preview
      </Typography>

      <Box position="relative">
        {sections.video}
        {sections.transitionMask}
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        paddingY={2}
      >
        {sections.buttons.previous}
        {control.state.playing ? sections.buttons.pause : sections.buttons.play}
        {sections.buttons.next}
        {sections.timestamp}
      </Stack>

      <ProgressBar
        value={getProgress()}
        onChange={(value) => control.seek(value * control.state.duration)}
      >
        {transcripts.map((transcript) => (
          <Highlight
            key={transcript.id}
            control={control}
            duration={transcript.end - transcript.start}
            offset={transcript.start}
            onClick={() => control.seek(transcript.start)}
          />
        ))}
      </ProgressBar>
    </Stack>
  );
}

// ----- COMPONENTS -----

const TransitionMask = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "#000",
}));
