import { randomUUID } from "crypto";
import { Room, RoomStatus } from "@app-types/modules/room.types";
import { User } from "@app-types/modules/user.types";
import { logger } from "@config/logger.js";

class RoomService {
    private rooms = new Map<string, Room>();

    create(host: User): Room {
        const roomId = randomUUID();

        const room: Room = {
            id: roomId,
            users: new Map([[host.id, host]]),
            playlist: [],
            currentTime: 0,
            isPlaying: false,
            lastUpdate: Date.now(),
            status: RoomStatus.WAITING,
            createdAt: new Date(),
        };

        this.rooms.set(roomId, room);
        logger.info(
            {
                roomId: room.id,
                userId: host.id,
                userName: host.name,
            },
            "Room created",
        );

        return room;
    }

    getRoom(roomId: string): Room | undefined {
        const room = this.rooms.get(roomId);

        if (!room) {
            logger.warn({ roomId }, "Room not found");
            return undefined;
        }

        logger.info({ roomId }, "Room retrieved");

        return room;
    }

    addUser(roomId: string, user: User): Room | undefined {
        const room = this.getRoom(roomId);
        if (!room) return undefined;

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

    updateUser(roomId: string, user: User): Room | undefined {
        const room = this.rooms.get(roomId);
        if (!room) return undefined;

        room.users.set(user.id, user);
        return room;
    }

    removeUser(roomId: string, userId: string): Room | "room-deleted" | undefined {
        const room = this.rooms.get(roomId);
        if (!room) return undefined;

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
            logger.info({ roomId }, "Room deleted due to no users");
            return "room-deleted";
        }

        return room;
    }

    getAll(): Room[] {
        logger.info({ totalRooms: this.rooms.size }, "Fetching all rooms");

        return Array.from(this.rooms.values());
    }
}

export const roomService = new RoomService();
