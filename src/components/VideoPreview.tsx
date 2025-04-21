import { Box, IconButton, Stack, styled, Typography } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";

import { useCurrentTime, useClipsControl } from "src/hooks";
import { Transcript, VideoControl } from "src/types";
import { formatTimestamp } from "src/utils";

import ProgressBar, { Highlight } from "./ProgressBar";

// ----------

export interface VideoPreviewProps {
  videoControl: VideoControl;
  transcripts: Transcript[];
}

export function VideoPreview({ videoControl, transcripts }: VideoPreviewProps) {
  const transition = 0.5;
  const control = useClipsControl({ videoControl, transcripts, transition });
  const time = useCurrentTime(control);

  // --- FUNCTIONS ---

  const getProgress = () => {
    if (!control.state.duration) return 0;
    return time / control.state.duration;
  };

  const togglePlay = () => {
    if (control.state.playing) control.pause();
    else control.play();
  };

  // --- SECTION ELEMENTS ---

  const sections = {
    video: (
      <Box
        component="video"
        width="100%"
        ref={control.ref}
        sx={{ aspectRatio: "16/9", bgcolor: "#000" }}
      >
        <source src={control.state.src} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
    ),

    transcript: (
      <Box position="absolute" bottom={0} left={0} width="100%" padding={2}>
        <Typography variant="body2" sx={{ textShadow: "1px 1px 2px #000" }}>
          {control.getCurrentTranscript()?.text}
        </Typography>
      </Box>
    ),

    transitionMask: (
      <TransitionMask
        sx={{
          transition: `opacity ${transition}s`,
          opacity: control.isTransitioning ? 1 : 0,
        }}
      />
    ),

    buttons: {
      previous: (
        <IconButton color="inherit" onClick={control.toPrevious}>
          <SkipPreviousOutlinedIcon />
        </IconButton>
      ),
      next: (
        <IconButton color="inherit" onClick={control.toNext}>
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
        {sections.transcript}
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
