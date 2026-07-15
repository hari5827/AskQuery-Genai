import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

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
    }, process.env.JWT_SECRET)

     await sendEmail({
        to: email,
        subject: "Welcome to AskQuery!",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>AskQuery</strong>.</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
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
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }


       if (user.verified) {

       const html = `
        <h1>Email Already Verified ✅</h1>
        <p>Your email is already verified.</p>
        <a href="http://localhost:3000/login">Go to Login</a>
    `;

    return res.send(html);
     }

        user.verified = true;

        await user.save();

        const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:3000/login">Go to Login</a>
    `

        return res.send(html);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}


export async function resendVerificationEmail(req, res) {
    const { email } = req.body;

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.verified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            });
        }

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const verifyLink =
            `http://localhost:3000/api/auth/verify-email?token=${token}`;

        await sendEmail({
            to: email,
            subject: "Verify your email",
            html: `
                <h2>Email Verification</h2>

                <p>Click below to verify your email.</p>

                <a href="${verifyLink}">
                    Verify Email
                </a>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Verification email sent."
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

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

    res.cookie("token", token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
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
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
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

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
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


