import { Server, Socket } from "socket.io";
import { roomService } from "@services/room.service.js";
import { logger } from "@config/logger.js";
import { failure, success } from "@utils/response.js";
import { ErrorCodes } from "@utils/constants.js";
import { registerVideoSocket } from "./video.socket.js";
import { videoService } from "@services/video.service.js";

type Ack<T = any> = (response: T) => void;

export const registerRoomSocket = (io: Server, socket: Socket) => {
    const socketUserMap = new Map<string, { roomId: string; userId: string }>();

    socket.on("create-room", ({ user }, callback?: Ack) => {
        const room = roomService.create(user);

        socket.join(room.id);
        socketUserMap.set(socket.id, { roomId: room.id, userId: user.id });

        if (callback) {
            callback(success("Room created", room));
        }

        io.to(room.id).emit("room-updated", {
            users: Array.from(room.users.values()),
            videoState: videoService.getVideoState(room.id),
        });
    });

    socket.on("join-room", ({ roomId, user }, callback?: Ack) => {
        const room = roomService.addUser(roomId, user);

        if (!room) {
            if (callback) {
                callback(failure("Room not found", ErrorCodes.ROOM_NOT_FOUND));
            }
            return;
        }

        socket.join(roomId);
        socketUserMap.set(socket.id, { roomId, userId: user.id });

        if (callback) {
            callback(
                success("Joined room", {
                    room,
                    videoState: videoService.getVideoState(roomId),
                }),
            );
        }

        io.to(roomId).emit("room-updated", {
            users: Array.from(room.users.values()),
            videoState: videoService.getVideoState(room.id),
        });
    });

    socket.on("update-user", ({ roomId, user }, callback?: Ack) => {
        const room = roomService.updateUser(roomId, user);

        if (!room) {
            if (callback) {
                callback(failure("Room not found", ErrorCodes.ROOM_NOT_FOUND));
            }
            return;
        }

        if (callback) {
            callback(success("User updated", room));
        }

        io.to(roomId).emit("room-updated", {
            users: Array.from(room.users.values()),
            videoState: videoService.getVideoState(room.id),
        });
    });

    socket.on("leave-room", ({ roomId, userId }, callback?: Ack) => {
        const room = roomService.removeUser(roomId, userId);
        socketUserMap.delete(socket.id);
        socket.leave(roomId);

        if (!room) {
            if (callback) {
                callback(failure("Room not found", ErrorCodes.ROOM_NOT_FOUND));
            }
            return;
        }

        if (room === "room-deleted") {
            io.to(roomId).emit("room-closed");
            return;
        }

        if (callback) {
            callback(success("Left room", room));
        }

        io.to(roomId).emit("room-updated", {
            users: Array.from(room.users.values()),
            videoState: videoService.getVideoState(room.id),
        });
    });

    socket.on("disconnect", () => {
        logger.info({ socketId: socket.id }, "Socket disconnected");

        const userInfo = socketUserMap.get(socket.id);
        if (!userInfo) return;

        const { roomId, userId } = userInfo;
        const room = roomService.removeUser(roomId, userId);
        socketUserMap.delete(socket.id);
        socket.leave(roomId);

        if (!room) return;

        if (room === "room-deleted") {
            io.to(roomId).emit("room-closed");
            return;
        }

        io.to(roomId).emit("room-updated", {
            users: Array.from(room.users.values()),
            videoState: videoService.getVideoState(room.id),
        });
    });

    registerVideoSocket(io, socket);
};