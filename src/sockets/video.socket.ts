import { Server, Socket } from "socket.io";
import { videoService } from "@services/video.service";
import { logger } from "@config/logger";

const emitVideoState = (
    io: Server,
    roomId: string,
    state: ReturnType<typeof videoService.getVideoState>,
) => {
    if (!state) return;
    io.to(roomId).emit("video-state-updated", state);
};

export const registerVideoSocket = (io: Server, socket: Socket) => {
    socket.on("add-video", ({ roomId, video, playNow = false }) => {
        const state = videoService.add(roomId, video, playNow);
        if (!state) return;

        io.to(roomId).emit("video-state-updated", state);
    });

    socket.on("remove-video", ({ roomId, videoId }) => {
        const state = videoService.remove(roomId, videoId);
        if (!state) return;

        io.to(roomId).emit("video-state-updated", state);
    });

    socket.on("video:play", ({ roomId, currentTime }) => {
        logger.info({ socketId: socket.id, roomId, currentTime }, "video:play received");

        const state = videoService.play(roomId, currentTime);
        emitVideoState(io, roomId, state);
    });

    socket.on("video:pause", ({ roomId, currentTime }) => {
        logger.info({ socketId: socket.id, roomId, currentTime }, "video:pause received");

        const state = videoService.pause(roomId, currentTime);
        emitVideoState(io, roomId, state);
    });

    socket.on("video:seek", ({ roomId, currentTime }) => {
        logger.info({ socketId: socket.id, roomId, currentTime }, "video:seek received");

        const state = videoService.seek(roomId, currentTime);
        emitVideoState(io, roomId, state);
    });

    socket.on("video:skip", ({ roomId }) => {
        logger.info({ socketId: socket.id, roomId }, "video:skip received");

        const state = videoService.skip(roomId);
        emitVideoState(io, roomId, state);
    });

    socket.on("video:ended", ({ roomId }) => {
        logger.info({ socketId: socket.id, roomId }, "video:ended received");

        const result = videoService.onEnd(roomId);
        if (!result) return;

        emitVideoState(io, roomId, result.state);

        if (result.isEnd) {
            io.to(roomId).emit("playlist-ended");
        }
    });

    socket.on("video:sync-request", ({ roomId }) => {
        logger.info({ socketId: socket.id, roomId }, "video:sync-request received");

        const state = videoService.getVideoState(roomId);
        if (!state) return;

        socket.emit("video-state-updated", state);
    });
};

