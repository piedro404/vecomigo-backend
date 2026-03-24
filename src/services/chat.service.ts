import { logger } from "@config/logger.js";
import { roomService } from "@services/room.service.js";
import { Chat } from "@app-types/modules/chat.types.js";

class ChatService {
    add(roomId: string, chat: Chat): Chat[] | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return undefined;

        room.chat.push(chat);
        logger.info(
            {
                roomId,
                username: chat.user.name,
                message: chat.message,
                createdAt: new Date(chat.createdAt).toISOString(),
            },
            "Chat message added",
        );
        return room.chat;
    }

    getChatHistory(roomId: string): Chat[] | undefined {
        const room = roomService.getRoom(roomId);
        if (!room) return undefined;

        return room.chat;
    }
}

export const chatService = new ChatService();