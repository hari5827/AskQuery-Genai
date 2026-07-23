import { Router } from 'express';
import { sendMessage,getChats,getMessages,deleteChat,sendMessageStream } from "../controllers/chat.controller.js";
const chatRouter = Router();
import { authUser } from "../middleware/auth.middleware.js";

chatRouter.post('/message', authUser, sendMessage);
chatRouter.post('/message/stream', authUser, sendMessageStream);
chatRouter.get("/", authUser, getChats)
chatRouter.get("/:chatId/messages", authUser, getMessages)
chatRouter.delete("/delete/:chatId", authUser, deleteChat)


export default chatRouter;