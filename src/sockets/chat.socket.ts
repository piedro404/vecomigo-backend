import { chatService } from "@services/chat.service.js";
import { Server, Socket } from "socket.io";

export const registerChatSocket = (io: Server, socket: Socket) => {
    socket.on("chat:message", ({ roomId, message }) => {
        chatService.add(roomId, message);
        io.to(roomId).emit("chat-update", { message });
    });
}