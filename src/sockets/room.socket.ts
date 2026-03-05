import { Server, Socket } from "socket.io";
import { roomService } from "../services/room.service";
import { logger } from "@config/logger";

export const registerRoomSocket = (io: Server, socket: Socket) => {
    const socketUserMap = new Map<string, { roomId: string; userId: string }>();

    socket.on("create-room", ({ name, user }, callback) => {
        const room = roomService.createRoom(name, user);

        socket.join(room.id);

        socketUserMap.set(socket.id, {
            roomId: room.id,
            userId: user.id,
        });

        callback(room);

        io.to(room.id).emit("room-updated", {
            users: Array.from(room.users.values()),
        });
    });

    socket.on("join-room", ({ roomId, user }) => {
        const room = roomService.addUser(roomId, user);

        if (!room) {
            socket.emit("error", "Room not found");
            return;
        }

        socket.join(roomId);

        socketUserMap.set(socket.id, {
            roomId,
            userId: user.id,
        });

        io.to(roomId).emit("room-updated", {
            users: Array.from(room.users.values()),
        });
    });

    socket.on("update-user", ({ roomId, user }) => {
        const room = roomService.updateUser(roomId, user);

        if (!room) return;

        io.to(roomId).emit("room-updated", {
            users: Array.from(room.users.values()),
        });
    });

    socket.on("leave-room", ({ roomId, userId }) => {
        const result = roomService.removeUser(roomId, userId);

        socket.leave(roomId);

        if (result === "room-deleted") {
            io.to(roomId).emit("room-closed");
            return;
        }

        if (result) {
            io.to(roomId).emit("room-updated", {
                users: Array.from(result.users.values()),
            });
        }
    });

    socket.on("disconnect", () => {
        logger.info({ socketId: socket.id }, "Socket disconnected");

        const data = socketUserMap.get(socket.id);

        if (!data) return;

        const { roomId, userId } = data;

        const result = roomService.removeUser(roomId, userId);

        socketUserMap.delete(socket.id);

        if (result === "room-deleted") {
            io.to(roomId).emit("room-closed");
            return;
        }

        if (result) {
            io.to(roomId).emit("room-updated", {
                users: Array.from(result.users.values()),
            });
        }
    });
};
