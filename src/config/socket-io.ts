import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { CORS_ORIGIN } from "./index.js";

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
      credentials: true,
    },
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io não inicializado!");
  }

  return io;
}