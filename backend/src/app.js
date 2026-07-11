import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"
const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: [ "GET", "POST", "PUT", "DELETE" ],
}))

app.use("/api/auth",authRouter)
export default app