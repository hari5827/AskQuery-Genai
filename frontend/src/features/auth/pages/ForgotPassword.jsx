import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { forgotPassword, verifyResetOtp, resetPassword } from "../service/auth.api";

const STEPS = {
    EMAIL: "email",
    OTP: "otp",
    RESET: "reset",
    SUCCESS: "success",
};

const ForgotPassword = () => {
    const [step, setStep] = useState(STEPS.EMAIL);
    const [email, setEmail] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const otpInputRefs = useRef([]);
    const navigate = useNavigate();

    const submitEmail = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            await forgotPassword({ email });
            setStep(STEPS.OTP);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...otpDigits];
        next[index] = digit;
        setOtpDigits(next);

        if (digit && index < otpDigits.length - 1) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
        if (!pasted) return;
        e.preventDefault();
        const next = pasted.split("");
        while (next.length < 4) next.push("");
        setOtpDigits(next);
        otpInputRefs.current[Math.min(pasted.length, 3)]?.focus();
    };

    const submitOtp = async (e) => {
        e.preventDefault();
        if (loading) return;
        const otp = otpDigits.join("");
        if (otp.length !== 4) {
            setError("Please enter the 4-digit code.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await verifyResetOtp({ email, otp });
            setResetToken(data.resetToken);
            setStep(STEPS.RESET);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            await forgotPassword({ email });
            setOtpDigits(["", "", "", ""]);
            otpInputRefs.current[0]?.focus();
        } catch (err) {
            setError(err.response?.data?.message || "Couldn't resend code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const submitNewPassword = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await resetPassword({ resetToken, newPassword });
            setStep(STEPS.SUCCESS);
        } catch (err) {
            setError(err.response?.data?.message || "Couldn't reset password. Please start again.");
        } finally {
            setLoading(false);
        }
    };

    if (step === STEPS.SUCCESS) {
        return (
            <AuthLayout title="Password reset" subtitle="You're all set">
                <div className="space-y-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <p className="text-sm text-zinc-400">Your password reset successful. You can now log in with your new password.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-red-600 hover:to-red-500 active:scale-[0.98]"
                    >
                        Go to Login
                    </button>
                </div>
            </AuthLayout>
        );
    }

    if (step === STEPS.RESET) {
        return (
            <AuthLayout title="Set new password" subtitle="Choose a new password for your account">
                <form onSubmit={submitNewPassword} className="space-y-4">
                    {error && (
                        <div className="rounded-xl border border-red-700/30 bg-red-700/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}
                    <label className="block relative">
                        <span className="text-sm text-zinc-400">New password</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="mt-1 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 pr-14 text-white placeholder-zinc-500 outline-none transition focus:border-red-600"
                            placeholder="********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-3 top-[38px] inline-flex items-center justify-center text-zinc-500 hover:text-white"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.121-5.657M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </label>

                    <label className="block">
                        <span className="text-sm text-zinc-400">Confirm password</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="mt-1 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-red-600"
                            placeholder="********"
                        />
                    </label>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-red-600 hover:to-red-500 active:scale-[0.98] disabled:opacity-90 disabled:cursor-not-allowed"
                        >
                            {loading ? "Resetting..." : "Reset password"}
                        </button>
                    </div>
                </form>
            </AuthLayout>
        );
    }

    if (step === STEPS.OTP) {
        return (
            <AuthLayout title="Enter the code" subtitle={`We sent a 4-digit code to ${email}`}>
                <form onSubmit={submitOtp} className="space-y-4">
                    {error && (
                        <div className="rounded-xl border border-red-700/30 bg-red-700/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}
                    <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                        {otpDigits.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (otpInputRefs.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                className="h-14 w-14 rounded-xl border border-white/10 bg-white/[0.03] text-center text-xl font-semibold text-white outline-none transition focus:border-red-600"
                            />
                        ))}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-red-600 hover:to-red-500 active:scale-[0.98] disabled:opacity-90 disabled:cursor-not-allowed"
                        >
                            {loading ? "Verifying..." : "Verify code"}
                        </button>
                    </div>
                    <div className="text-center text-sm text-zinc-500">
                        <span>Didn't get it? </span>
                        <button
                            type="button"
                            onClick={resendOtp}
                            disabled={loading}
                            className="font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                            Resend code
                        </button>
                    </div>
                </form>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Forgot password" subtitle="Enter your email to receive a reset code">
            <form onSubmit={submitEmail} className="space-y-4">
                {error && (
                    <div className="rounded-xl border border-red-700/30 bg-red-700/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}
                <label className="block">
                    <span className="text-sm text-zinc-400">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-zinc-500 outline-none transition focus:border-red-600"
                        placeholder="Enter your email"
                    />
                </label>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-red-600 hover:to-red-500 active:scale-[0.98] disabled:opacity-90 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send reset code"}
                    </button>
                </div>
                <div className="mt-4 text-center text-sm text-zinc-500">
                    <Link to="/login" className="font-medium text-red-400 hover:text-red-300">
                        Back to login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
