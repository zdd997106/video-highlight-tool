import { capitalize } from "lodash";
import { generate } from "random-words";
import { TranscriptGroup } from "src/types";

export async function uploadVideo(file: File) {
  const url = URL.createObjectURL(file);
  const duration = await getVideoDuration(file);

  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  return {
    url,
    transcriptGroups: generateTranscriptGroups(duration),
  };
}

async function getVideoDuration(file: File) {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = URL.createObjectURL(file);

  const duration = new Promise<number>((resolve) => {
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
  });

  return duration;
}

function generateTranscriptGroups(duration: number) {
  const transcriptGroups: TranscriptGroup[] = [
    {
      id: id(),
      title: capitalize((generate(3) as string[]).join(" ")),
      transcripts: [],
    },
  ];

  let start = 0;
  let end = 1;
  let i = 0;
  let groupIndex = 0;
  while (end < duration) {
    if (
      transcriptGroups[groupIndex].transcripts.length > 0 &&
      Math.random() > 0.75
    ) {
      groupIndex++;
      transcriptGroups.push({
        id: id(),
        title: capitalize((generate(3) as string[]).join(" ")),
        transcripts: [],
      });
    }

    if (i++ % 2 === 1) {
      transcriptGroups[groupIndex].transcripts.push({
        id: id(),
        start: start,
        end: end,
        text: (generate({ min: 5, max: 10 }) as string[]).join(" "),
      });
    }

    start = end;
    end = start + Math.floor(Math.random() * 5) + 1;
  }

  return transcriptGroups;
}

function id() {
  return Math.random().toString(36).substring(2, 15);
}
