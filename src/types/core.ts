// ----- TRANSCRIPT -----

export interface Transcript {
  id: string;
  start: number;
  end: number;
  text: string;
}

export interface TranscriptGroup {
  id: string;
  title: string;
  transcripts: Transcript[];
}

// ----- VIDEO CONTROL -----

export interface VideoControl {
  ref: React.RefObject<HTMLVideoElement | null>;
  state: VideoState;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
}

export interface VideoState {
  playing: boolean;
  duration: number;
  src: string;
}
