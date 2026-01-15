export interface VideoFormat {
  quality: string;
  container: string;
  url: string;
  mimeType?: string;
  hasAudio: boolean;
  hasVideo: boolean;
}

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  formats: VideoFormat[];
}