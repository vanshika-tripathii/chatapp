import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Used to store online users: { userId: socketId }
const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`🔗 User ${userId} connected`);
  } else {
    console.warn("⚠️ No userId found in socket handshake query");
  }

  // Notify all clients of the updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);

    // Safely remove the user based on socket.id
    for (const [key, value] of Object.entries(userSocketMap)) {
      if (value === socket.id) {
        delete userSocketMap[key];
        console.log(`🧹 Removed user ${key} from online list`);
        break;
      }
    }

    // Notify all clients of the updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server };
