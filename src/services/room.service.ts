import { randomUUID } from "crypto";
import { Room, RoomStatus } from "src/types/modules/room.types";
import { User } from "src/types/modules/user.types";
import { logger } from "@config/logger.js";
class RoomService {
    private rooms = new Map<string, Room>();

    createRoom(name: string, user: User) {
        const id = randomUUID();

        const room: Room = {
            id,
            name,
            users: new Map(),
            playlist: [],
            currentVideoIndex: 0,
            status: RoomStatus.WAITING,
            createdAt: new Date(),
        };

        room.users.set(user.id, user);
        this.rooms.set(id, room);

        logger.info(
            {
                roomId: id,
                roomName: name,
                userId: user.id,
                userName: user.name,
            },
            "Room created",
        );

        return room;
    }

    getRoom(roomId: string) {
        const room = this.rooms.get(roomId);

        if (!room) {
            logger.warn({ roomId }, "Room not found");
            return null;
        }

        logger.debug({ roomId }, "Room fetched");

        return room;
    }

    addUser(roomId: string, user: User) {
        const room = this.rooms.get(roomId);

        if (!room) {
            logger.warn(
                { roomId, userId: user.id },
                "Attempt to join non-existing room",
            );
            return null;
        }

        room.users.set(user.id, user);

        logger.info(
            {
                roomId,
                userId: user.id,
                userName: user.name,
                totalUsers: room.users.size,
            },
            "User joined room",
        );

        return room;
    }

    updateUser(roomId: string, user: User) {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        room.users.set(user.id, user);

        return room;
    }

    removeUser(roomId: string, userId: string) {
        const room = this.rooms.get(roomId);

        if (!room) {
            logger.warn(
                { roomId, userId },
                "Attempt to leave non-existing room",
            );
            return;
        }

        room.users.delete(userId);

        logger.info(
            {
                roomId,
                userId,
                remainingUsers: room.users.size,
            },
            "User left room",
        );

        if (room.users.size === 0) {
            this.rooms.delete(roomId);

            logger.info({ roomId }, "Room deleted automatically (empty room)");

            return "room-deleted";
        }

        return room;
    }

    getAllRooms() {
        logger.debug({ totalRooms: this.rooms.size }, "Fetching all rooms");

        return Array.from(this.rooms.values());
    }
}

export const roomService = new RoomService();
