import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

function verificationPage({ status, heading, message, showLoginButton = true }) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const icon = {
        success: `
            <div class="icon-circle icon-success">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>`,
        info: `
            <div class="icon-circle icon-info">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            </div>`,
        error: `
            <div class="icon-circle icon-error">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>`,
    }[status];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AskQuery — Email Verification</title>
<style>
    * { box-sizing: border-box; }
    body {
        margin: 0;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #050505;
        background-image: radial-gradient(circle at top, #141414 0%, #090909 45%, #050505 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #ffffff;
        padding: 24px;
        position: relative;
        overflow: hidden;
    }
    .glow-a {
        position: fixed; top: -160px; left: -80px; width: 384px; height: 384px;
        border-radius: 9999px; background: rgba(185, 28, 28, 0.05); filter: blur(160px);
    }
    .glow-b {
        position: fixed; bottom: 0; right: 0; width: 448px; height: 448px;
        border-radius: 9999px; background: rgba(185, 28, 28, 0.05); filter: blur(180px);
    }
    .card {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 420px;
        background: #111111;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 40px 28px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }
    .icon-circle {
        width: 56px; height: 56px; margin: 0 auto 20px;
        border-radius: 9999px;
        display: flex; align-items: center; justify-content: center;
    }
    .icon-circle svg { width: 28px; height: 28px; }
    .icon-success { background: rgba(16, 185, 129, 0.1); color: #34d399; }
    .icon-info { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
    .icon-error { background: rgba(220, 38, 38, 0.1); color: #f87171; }
    h1 {
        font-size: 20px; font-weight: 700; letter-spacing: -0.01em;
        margin: 0 0 10px;
    }
    p {
        font-size: 14px; line-height: 1.6; color: #a1a1aa;
        margin: 0 0 28px;
    }
    .btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 100%;
        padding: 13px 24px;
        border-radius: 16px;
        background: linear-gradient(to right, #b91c1c, #dc2626);
        color: #ffffff;
        font-weight: 600;
        font-size: 14px;
        text-decoration: none;
        transition: opacity 0.2s ease;
    }
    .btn:hover { opacity: 0.9; }
    .brand {
        margin-top: 28px;
        font-size: 12px;
        color: #52525b;
        letter-spacing: 0.02em;
    }
</style>
</head>
<body>
    <div class="glow-a"></div>
    <div class="glow-b"></div>
    <div class="card">
        ${icon}
        <h1>${heading}</h1>
        <p>${message}</p>
        ${showLoginButton ? `<a class="btn" href="${frontendUrl}/login">Go to Login</a>` : ""}
        <div class="brand">AskQuery</div>
    </div>
</body>
</html>`;
}

export async function register(req,res){
    const { username,email,password}=req.body;
    
     const isUserAlreadyExists = await userModel.findOne({
        $or: [ { email }, { username } ]
    })

     if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }


     const user = await userModel.create({ username, email, password })

      const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET, { expiresIn: "24h" })

     await sendEmail({
        to: email,
        subject: "Welcome to AskQuery!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>AskQuery</strong>.</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${process.env.BACKEND_URL || "http://localhost:3000"}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>Wizardx</p>
        `
    })


    
    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });

}

export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).send(verificationPage({
                status: "error",
                heading: "Verification Failed",
                message: "We couldn't find an account for this link. Please try registering again.",
            }));
        }


       if (user.verified) {

       const html = verificationPage({
        status: "info",
        heading: "Already Verified",
        message: "Your email is already verified — you're all set to log in.",
    });

    return res.send(html);
     }

        user.verified = true;

        await user.save();

        const html = verificationPage({
            status: "success",
            heading: "Email Verified!",
            message: "Your email has been verified successfully. You can now log in to your account.",
        });

        return res.send(html);
    } catch (err) {
        return res.status(400).send(verificationPage({
            status: "error",
            heading: "Verification Failed",
            message: "This link is invalid or has expired. Please try registering again or request a new verification link.",
        }));
    }
}




      


export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '4d' })

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token,{
    httpOnly: true,
    secure: isProd,
    // "strict"/"lax" won't be sent cross-site (e.g. vercel.app -> onrender.com).
    // "none" + secure is required for cross-origin cookies in production.
    sameSite: isProd ? "none" : "lax",
    maxAge: 4 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}


export async function logout(req, res) {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}



export async function deleteAccount(req, res) {
    try {
        const { password } = req.body;

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

        await userModel.findByIdAndDelete(user._id);

        const isProd = process.env.NODE_ENV === "production";

        res.clearCookie("token", {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


