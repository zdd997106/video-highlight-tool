import { sortBy } from "lodash";
import { Box, IconButton, Stack, Typography } from "@mui/material";
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

  // --- FUNCTIONS ---

  const getProgress = () => {
    if (!control.state.duration) return 0;
    return time / control.state.duration;
  };

  const togglePlay = () => {
    if (control.state.playing) control.pause();
    else control.play();
  };

  // --- HANDLERS ---

  const handleClickPrevious = () => {
    const last = sortBy([...transcripts], "start")
      .reverse()
      .find((transcript) => transcript.end <= time);

    if (!last) return control.seek(0);
    control.seek(last.start);
  };

  const handleClickNext = () => {
    const next = sortBy([...transcripts], "start").find(
      (transcript) => transcript.start > time
    );

    if (!next) return control.seek(control.state.duration);
    control.seek(next.start);
  };

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

    buttons: {
      previous: (
        <IconButton color="inherit" onClick={handleClickPrevious}>
          <SkipPreviousOutlinedIcon />
        </IconButton>
      ),
      next: (
        <IconButton color="inherit" onClick={handleClickNext}>
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

      {sections.video}

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
        onChange={(value) => control.seek(value)}
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
