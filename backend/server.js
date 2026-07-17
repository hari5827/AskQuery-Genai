import "dotenv/config";
import app from "./src/app.js"
import http from "http"
import connecttodb from "./src/config/database.js"
import { initSocket } from "./src/sockets/server.socket.js"

connecttodb()

const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

