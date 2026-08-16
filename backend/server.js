import "dotenv/config";
import app from "./src/app.js"
import http from "http"
import connecttodb from "./src/config/database.js"
import { initSocket } from "./src/sockets/server.socket.js"
import { createRequire } from "module";

const require = createRequire(import.meta.url);

connecttodb()

const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);

  
    try {
        console.log("DEBUG VERSIONS —",
            "zod:", require("zod/package.json").version,
            "| @langchain/google-genai:", require("@langchain/google-genai/package.json").version,
            "| @langchain/core:", require("@langchain/core/package.json").version,
            "| langchain:", require("langchain/package.json").version
        );
    } catch (e) {
        console.log("DEBUG VERSIONS — failed to read:", e.message);
    }
});