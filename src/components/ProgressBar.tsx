import { Box, Button, ButtonProps, styled } from "@mui/material";
import { noop } from "lodash";

import { VideoControl } from "src/types";

// ----------

export interface ProgressBarProps {
  value: number;
  children?: React.ReactNode;
  onChange?: (value: number) => void;
}

export default function ProgressBar({
  value,
  children,
  onChange = noop,
}: ProgressBarProps) {
  // --- HANDLERS ---

  const handleClickTrack = (event: React.MouseEvent) => {
    const progress =
      event.nativeEvent.offsetX / event.currentTarget.clientWidth;
    onChange(progress);
  };

  return (
    <Box position="relative">
      <Track onClick={handleClickTrack} />
      {children}
      <Indicator progress={value} />
    </Box>
  );
}

// ----- COMPONENTS -----

const Track = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 24,
  background: theme.palette.primary.light,
  opacity: 0.25,
}));

interface IndicatorProps {
  progress: number;
}

function Indicator({ progress }: IndicatorProps) {
  return (
    <StyledIndicatorRoot size={3}>
      <Box style={{ left: `${progress * 100}%` }} />
    </StyledIndicatorRoot>
  );
}

const StyledIndicatorRoot = styled("div")<{ size: number }>(
  ({ theme, size }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `calc(100% - ${size}px)`,
    pointerEvents: "none",

    "& > div": {
      height: "100%",
      position: "absolute",
      top: 0,
      width: size,
      background: theme.palette.error.main,
      transition: "left 0.3s linear",
    },
  })
);

interface HighlightProps extends ButtonProps {
  duration: number;
  offset: number;
  control: VideoControl;
}

export function Highlight({
  duration,
  offset,
  control,
  ...props
}: HighlightProps) {
  return (
    <StyledHighlightRoot
      {...props}
      variant="contained"
      sx={{
        width: duration / control.state.duration,
        left: `${(offset / control.state.duration) * 100}%`,
      }}
    />
  );
}

const StyledHighlightRoot = styled(Button)(() => ({
  position: "absolute",
  height: "100%",
  top: 0,
  opacity: 0.5,
  cursor: "pointer",
  borderRadius: 0,
}));
