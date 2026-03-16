import { RoomStatus } from "./room.types";

export type VideoState = {
    isPlaying: boolean;
    currentTime: number;
    playlist: Video[];
    lastUpdate: number;
    status: RoomStatus;
};

export type Video = {
  id: string
  youtubeId: string
  title: string
  duration?: number
  addedBy: string
}