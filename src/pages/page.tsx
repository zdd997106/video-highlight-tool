import { Box, Button, Stack } from "@mui/material";
import { useDialogs } from "gexii/dialogs";
import { useAction } from "gexii/hooks";
import { useMemo, useState } from "react";

import { useVideoControl } from "src/hooks";
import { HighlightList } from "src/components/HighlightList";
import { VideoPreview } from "src/components/VideoPreview";
import { api } from "src/service";
import { TranscriptGroup } from "src/types";
import { uploadFile } from "src/utils";

// ----------

export default function Page() {
  const dialogs = useDialogs();
  const uploadVideo = useAction(async (file: File) => api.uploadVideo(file), {
    onError: (error) => {
      dialogs.alert("Error", error.message);
    },
  });

  const videoInfo = uploadVideo.getData();
  if (!videoInfo) return <Uploader onUpload={uploadVideo.call} />;

  return (
    <Editor
      videoUrl={videoInfo.url}
      transcriptGroups={videoInfo.transcriptGroups}
    />
  );
}

// ----- COMPONENTS -----

interface UploaderProps {
  onUpload: (file: File) => void;
}

function Uploader({ onUpload }: UploaderProps) {
  const upload = useAction(onUpload);

  // --- HANDLERS ---

  const handleUploadClick = async () => {
    const fileList = await uploadFile({
      multiple: false,
      accept: "video/*",
    });

    if (!fileList || fileList.length === 0) return;

    upload.call(fileList[0]);
  };

  return (
    <Stack height="100vh" alignItems="center" justifyContent="center">
      <Button
        variant="contained"
        loading={upload.isLoading()}
        onClick={handleUploadClick}
      >
        Upload Video
      </Button>
    </Stack>
  );
}

interface EditorProps {
  videoUrl: string;
  transcriptGroups: TranscriptGroup[];
}

function Editor({ transcriptGroups, videoUrl }: EditorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const control = useVideoControl(videoUrl);

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
        <VideoPreview
          videoControl={control}
          transcripts={selectedTranscripts}
        />
      </Box>
    </Stack>
  );
}
