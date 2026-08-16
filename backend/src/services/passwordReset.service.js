import redis from "../config/redis.js";

const OTP_TTL_SECONDS = 10 * 60; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;

function otpKey(email) {
    return `pwreset:otp:${email.toLowerCase().trim()}`;
}

export async function storeOtp(email, otp) {
    await redis.set(
        otpKey(email),
        JSON.stringify({ otp, attempts: 0 }),
        "EX",
        OTP_TTL_SECONDS
    );
}

export async function getOtpRecord(email) {
    const raw = await redis.get(otpKey(email));
    return raw ? JSON.parse(raw) : null;
}

// Bumps the failed-attempt counter without resetting the original TTL,
// so someone brute-forcing the code doesn't get a fresh 10 minutes on
// every wrong guess.
export async function incrementOtpAttempts(email, record) {
    const key = otpKey(email);
    const ttl = await redis.ttl(key);
    await redis.set(
        key,
        JSON.stringify({ ...record, attempts: record.attempts + 1 }),
        "EX",
        ttl > 0 ? ttl : OTP_TTL_SECONDS
    );
}

export async function clearOtp(email) {
    await redis.del(otpKey(email));
}
