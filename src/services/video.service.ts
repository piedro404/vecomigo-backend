import { Room, RoomStatus } from "@app-types/modules/room.types";
import { Video, VideoState } from "@app-types/modules/video.types";
import { logger } from "@config/logger";
import { roomService } from "@services/room.service";

class VideoService {
    private calculateCurrentTime(room: Room): number {
        if (!room.isPlaying) return room.currentTime;

        const elapsed = (Date.now() - room.lastUpdate) / 1000;
        return room.currentTime + elapsed;
    }

    private buildState(room: Room): VideoState {
        return {
            isPlaying: room.isPlaying,
            currentTime: this.calculateCurrentTime(room),
            playlist: room.playlist,
            lastUpdate: room.lastUpdate,
            status: room.status,
        };
    }

    getVideoState(roomId: string): VideoState | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return undefined;

        return this.buildState(room);
    }

    add(roomId: string, video: Video, playNow = false): VideoState | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return undefined;

        const isEmpty = room.playlist.length === 0;

        if (playNow || isEmpty) {
            room.playlist.unshift(video);
            room.currentTime = 0;
            room.isPlaying = true;
            room.status = RoomStatus.PLAYING;
            room.lastUpdate = Date.now();

            logger.info(
                {
                    roomId,
                    videoId: video.id,
                    videoYoutubeId: video.youtubeId,
                    videoTitle: video.title,
                    reason: isEmpty ? "auto-start" : "playNow",
                },
                "Video added and playing now",
            );
        } else {
            room.playlist.push(video);
            logger.info(
                { roomId, videoId: video.id, queueSize: room.playlist.length },
                "Video added to queue",
            );
        }

        return this.buildState(room);
    }

    remove(roomId: string, videoId: string): VideoState | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return undefined;

        const isCurrentVideo = room.playlist[0]?.id === videoId;
        room.playlist = room.playlist.filter((v) => v.id !== videoId);

        if (isCurrentVideo) {
            room.currentTime = 0;
            room.lastUpdate = Date.now();

            if (room.playlist.length === 0) {
                room.isPlaying = false;
                room.status = RoomStatus.WAITING;
                logger.info(
                    { roomId },
                    "Current video removed, playlist is now empty",
                );
            } else {
                room.isPlaying = true;
                room.status = RoomStatus.PLAYING;
                logger.info(
                    { roomId, nextVideoId: room.playlist[0].id },
                    "Current video removed, playing next",
                );
            }
        } else {
            logger.info({ roomId, videoId }, "Video removed from queue");
        }

        return this.buildState(room);
    }

    play(roomId: string, currentTime?: number): VideoState | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return undefined;

        if (room.playlist.length === 0) {
            logger.warn({ roomId }, "Play requested but playlist is empty");
            return;
        }

        room.isPlaying = true;
        room.status = RoomStatus.PLAYING;
        room.currentTime = currentTime ?? this.calculateCurrentTime(room);
        room.lastUpdate = Date.now();

        logger.info({ roomId, currentTime: room.currentTime }, "Video playing");

        return this.buildState(room);
    }

    pause(roomId: string, currentTime?: number): VideoState | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return;

        room.isPlaying = false;
        room.status = RoomStatus.PAUSED;
        room.currentTime = currentTime ?? this.calculateCurrentTime(room);
        room.lastUpdate = Date.now();

        logger.info({ roomId, currentTime: room.currentTime }, "Video paused");

        return this.buildState(room);
    }

    seek(roomId: string, currentTime: number): VideoState | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return;

        room.currentTime = currentTime;
        room.lastUpdate = Date.now();

        logger.info({ roomId, currentTime }, "Video seeked");

        return this.buildState(room);
    }

    skip(roomId: string): VideoState | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return;

        const skipped = room.playlist.shift();
        room.currentTime = 0;
        room.lastUpdate = Date.now();

        if (room.playlist.length === 0) {
            room.isPlaying = false;
            room.status = RoomStatus.WAITING;
            logger.info(
                { roomId, skippedId: skipped?.id },
                "Skipped last video, playlist empty",
            );
        } else {
            room.isPlaying = true;
            room.status = RoomStatus.PLAYING;
            logger.info(
                {
                    roomId,
                    skippedId: skipped?.id,
                    nextVideoId: room.playlist[0].id,
                },
                "Skipped to next video",
            );
        }

        return this.buildState(room);
    }

    onEnd(roomId: string): { state: VideoState; isEnd: boolean } | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return;

        const finished = room.playlist.shift();
        room.currentTime = 0;
        room.lastUpdate = Date.now();

        if (room.playlist.length === 0) {
            room.isPlaying = false;
            room.status = RoomStatus.WAITING;
            logger.info({ roomId, finishedId: finished?.id }, "Playlist ended");
            return { state: this.buildState(room), isEnd: true };
        }

        room.isPlaying = true;
        room.status = RoomStatus.PLAYING;
        logger.info(
            {
                roomId,
                finishedId: finished?.id,
                nextVideoId: room.playlist[0].id,
            },
            "Auto-advancing to next video",
        );

        return { state: this.buildState(room), isEnd: false };
    }
}

export const videoService = new VideoService();