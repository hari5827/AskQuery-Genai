import Router from "express";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import { register ,login,verifyEmail,getMe,resendVerificationEmail} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();
authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login)
authRouter.get('/verify-email', verifyEmail)
authRouter.post("/resend-verification", resendVerificationEmail);
authRouter.get('/get-me', authUser, getMe)

export default authRouter;
