import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"
import chatRouter from "./routes/chat.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import youtubeRoutes from "./routes/youtube.routes.js";
const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // e.g. https://askquery.vercel.app
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use("/api/auth",authRouter)
app.use("/api/chats", chatRouter);
app.use("/api/pdf", pdfRoutes);    
app.use("/api/youtube", youtubeRoutes);
export default app