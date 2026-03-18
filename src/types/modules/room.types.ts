import { User } from "./user.types.js";
import { Video } from "./video.types.js";

export enum RoomStatus {
    WAITING = "WAITING",
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
}

export type Room = {
    id: string;
    users: Map<string, User>;
    playlist: Video[];
    currentTime: number;
    isPlaying: boolean;
    lastUpdate: number;
    status: RoomStatus;
    createdAt: Date;
}
