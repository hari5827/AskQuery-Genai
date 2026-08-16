import Router from "express";
import {
    loginValidator,
    registerValidator,
    forgotPasswordValidator,
    verifyResetOtpValidator,
    resetPasswordValidator,
} from "../validator/auth.validator.js";
import {
    register,
    login,
    verifyEmail,
    getMe,
    logout,
    deleteAccount,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import {
    loginLimiter,
    registerLimiter,
    forgotPasswordLimiter,
    verifyResetOtpLimiter,
} from "../middleware/rateLimit.middleware.js";

const authRouter = Router();
authRouter.post("/register", registerValidator, registerLimiter, register);
authRouter.post("/login", loginValidator, loginLimiter, login)
authRouter.get('/verify-email', verifyEmail)

authRouter.post("/forgot-password", forgotPasswordValidator, forgotPasswordLimiter, forgotPassword);
authRouter.post("/verify-reset-otp", verifyResetOtpValidator, verifyResetOtpLimiter, verifyResetOtp);
authRouter.post("/reset-password", resetPasswordValidator, resetPassword);

authRouter.get('/get-me', authUser, getMe)
authRouter.post("/logout", logout);
authRouter.delete("/delete-account", authUser, deleteAccount);
export default authRouter;
