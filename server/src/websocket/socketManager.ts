import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;

export const initializeWebSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || "http://localhost:3000",
        "https://veda-ai-assessment.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on("connection", (socket) => {
    socket.on("join", (assignmentId: string) => {
      socket.join(assignmentId);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
