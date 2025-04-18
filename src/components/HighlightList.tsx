import { Link, MenuItem, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useCurrentTime } from "src/hooks";

import { VideoControl, TranscriptGroup, Transcript } from "src/types";
import { formatTimestamp } from "src/utils";

interface HighlightListProps {
  transcriptGroups: TranscriptGroup[];
  videoControl: VideoControl;
  selectedIds?: string[];
  onSelectChange: (ids: string[]) => void;
}

export function HighlightList({
  transcriptGroups,
  videoControl,
  selectedIds = [],
  onSelectChange,
}: HighlightListProps) {
  const time = useCurrentTime(videoControl, {
    getValue: (value) => Math.floor(value),
  });

  // --- FUNCTIONS ---

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectChange([...selectedIds, id]);
    }
  };

  return (
    <Stack padding={2}>
      <Typography variant="h6" marginBottom={2}>
        Transcript
      </Typography>

      <Stack spacing={2}>
        {transcriptGroups.map((group) => (
          <Stack key={group.id}>
            <Typography variant="subtitle1">{group.title}</Typography>
            <Stack spacing={1}>
              {group.transcripts.map((transcript) => (
                <TranscriptItem
                  key={transcript.id}
                  transcript={transcript}
                  selected={selectedIds.includes(transcript.id)}
                  currentTime={time}
                  onClick={() => toggleSelect(transcript.id)}
                  onTimestampClick={() => videoControl.seek(transcript.start)}
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

// ----- COMPONENTS -----

interface TranscriptItemProps {
  transcript: Transcript;
  selected: boolean;
  currentTime: number;
  onClick: () => void;
  onTimestampClick: () => void;
}

function TranscriptItem({
  transcript,
  selected,
  currentTime,
  onClick,
  onTimestampClick,
}: TranscriptItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const highlighted =
    currentTime >= transcript.start && currentTime < transcript.end;

  useEffect(() => {
    if (!highlighted || !ref.current) return;
    const element = ref.current;
    element.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [highlighted]);
  return (
    <MenuItem
      key={transcript.id}
      ref={ref}
      selected={selected}
      disableRipple
      sx={[
        highlighted && {
          outline: "solid 2px",
          outlineColor: selected ? "primary.dark" : "divider",
        },
      ]}
      onClick={onClick}
    >
      <Link
        component={Typography}
        variant="subtitle1"
        color="primary"
        minWidth={50}
        underline="hover"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onTimestampClick();
        }}
      >
        {formatTimestamp(transcript.start)}
      </Link>
      <Typography variant="body1">{transcript.text}</Typography>
    </MenuItem>
  );
}
