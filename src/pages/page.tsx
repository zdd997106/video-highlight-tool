import { Box, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { HighlightList } from "src/components/HighlightList";
import { VideoPreview } from "src/components/VideoPreview";
import { useVideo } from "src/hooks/useVideo";
import { TranscriptGroup } from "src/types";

export default function Page() {
  const control = useVideo(
    "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
  );
  const [transcriptGroups] = useState<TranscriptGroup[]>(() => [
    {
      id: "1",
      title: "Transcript",
      transcripts: [
        { id: "1", start: 0, end: 5, text: "Hello world" },
        { id: "2", start: 5, end: 10, text: "This is a test" },
        { id: "3", start: 10, end: 15, text: "This is a test" },
      ],
    },
    {
      id: "2",
      title: "Transcript 2",
      transcripts: [
        { id: "4", start: 15, end: 20, text: "Hello world" },
        { id: "5", start: 20, end: 25, text: "This is a test" },
        { id: "6", start: 25, end: 30, text: "This is a test" },
      ],
    },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedTranscripts = useMemo(() => {
    return transcriptGroups
      .flatMap((group) => group.transcripts)
      .filter((transcript) => selectedIds.includes(transcript.id));
  }, [selectedIds, transcriptGroups]);

  return (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      spacing={{ xs: 0, sm: 2 }}
      width="100%"
      height="100vh"
    >
      <Box flex={1} overflow="auto">
        <HighlightList
          videoControl={control}
          transcriptGroups={transcriptGroups}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
        />
      </Box>
      <Box
        flex={1}
        padding={2}
        bgcolor="grey.900"
        color="primary.contrastText"
        overflow="auto"
        paddingBottom={3}
      >
        <VideoPreview control={control} transcripts={selectedTranscripts} />
      </Box>
    </Stack>
  );
}
