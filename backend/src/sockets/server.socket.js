import { Server } from "socket.io";


let io;

export function initSocket(httpServer) {
    const allowedOrigins = [
        "http://localhost:5173",
        process.env.FRONTEND_URL, // e.g. https://askquery.vercel.app
    ].filter(Boolean);

    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        }
    })

    console.log("Socket.io server is RUNNING")

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id)
    })
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized")
    }

    return io
}