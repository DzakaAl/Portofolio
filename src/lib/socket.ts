import { io, Socket } from "socket.io-client";

// Connect to same origin (served by custom server.js)
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL || undefined, {
      autoConnect: false,
      transports: ["polling"],
      upgrade: false,
    });
  }
  return socket;
}

export function connectSocket(): Socket {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
