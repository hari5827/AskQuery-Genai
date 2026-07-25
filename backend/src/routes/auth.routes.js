import Router from "express";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import { register ,login,verifyEmail,getMe,logout,deleteAccount} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { loginLimiter , registerLimiter } from "../middleware/rateLimit.middleware.js";

const authRouter = Router();
authRouter.post("/register", registerValidator, registerLimiter, register);
authRouter.post("/login", loginValidator, loginLimiter, login)
authRouter.get('/verify-email', verifyEmail)

authRouter.get('/get-me', authUser, getMe)
authRouter.post("/logout", logout);
authRouter.delete("/delete-account", authUser, deleteAccount);
export default authRouter;
