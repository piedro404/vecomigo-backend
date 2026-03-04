import { Server, Socket } from "socket.io";
import { logger } from "@config/logger.js";

export function registerRoomSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    logger.info(`🔌 Novo socket conectado: ${socket.id}`);

    socket.on("room:create", ({ name }) => {
      logger.info(`🆕 Sala criada por ${name}`);
    });

    socket.on("room:join", ({ roomId, name }) => {
      logger.info(`👤 ${name} entrou na sala ${roomId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`❌ Socket desconectado: ${socket.id}`);
    });
  });
}