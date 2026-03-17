import { Server, Socket } from "socket.io";
import { roomService } from "@services/room.service";
import { logger } from "@config/logger";
import { failure, success } from "src/utils/response";
import { ErrorCodes } from "src/utils/constants";
import { registerVideoSocket } from "./video.socket";

export const registerRoomSocket = (io: Server, socket: Socket) => {
    const socketUserMap = new Map<string, { roomId: string; userId: string }>();

    socket.on("create-room", ({ user }, callback) => {
        const room = roomService.create(user);

        socket.join(room.id);
        socketUserMap.set(socket.id, { roomId: room.id, userId: user.id });

        callback(success("Room created", room));
        io.to(room.id).emit("room-updated", {
            users: Array.from(room.users.values()),
        });
    });

    socket.on("join-room", ({ roomId, user }, callback) => {
        const room = roomService.addUser(roomId, user);
        if (!room) {
            callback(failure("Room not found", ErrorCodes.ROOM_NOT_FOUND));
            return;
        }

        socket.join(roomId);
        socketUserMap.set(socket.id, { roomId, userId: user.id });

        callback(success("Joined room", room));
        io.to(roomId).emit("room-updated", {
            users: Array.from(room.users.values()),
        });
    });

    socket.on("update-user", ({ roomId, user }, callback) => {
        const room = roomService.updateUser(roomId, user);
        if (!room) {
            callback(failure("Room not found", ErrorCodes.ROOM_NOT_FOUND));
            return;
        }

        callback(success("User updated", room));
        io.to(roomId).emit("room-updated", {
            users: Array.from(room.users.values()),
        });
    });

    socket.on("leave-room", ({ roomId, userId }, callback) => {
        const room = roomService.removeUser(roomId, userId);
        socket.leave(roomId);

        if (!room) {
            callback(failure("Room not found", ErrorCodes.ROOM_NOT_FOUND));
            return;
        }

        if (room === "room-deleted") {
            callback(failure("Room has been closed", ErrorCodes.ROOM_CLOSED));
            io.to(roomId).emit("room-closed");
            return;
        }

        callback(success("Left room", room));
        if (typeof room !== "string") {
            io.to(roomId).emit("room-updated", {
                users: Array.from(room.users.values()),
            });
        }
    });

    socket.on("disconnect", () => {
        logger.info({ socketId: socket.id }, "Socket disconnected");
        const userInfo = socketUserMap.get(socket.id);
        if (!userInfo) return;

        const { roomId, userId } = userInfo;
        const room = roomService.removeUser(roomId, userId);
        if (!room) return;

        socketUserMap.delete(socket.id);
        if (room === "room-deleted") {
            io.to(roomId).emit("room-closed");
            return;
        }

        if (typeof room !== "string") {
            io.to(roomId).emit("room-updated", {
                users: Array.from(room.users.values()),
            });
        }
    });

    registerVideoSocket(io, socket);
};
