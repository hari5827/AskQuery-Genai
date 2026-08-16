// Generates a 4-digit numeric OTP as a string (e.g. "0472").
// Keeping it a string avoids leading-zero loss and makes comparison
// with user input (also a string) straightforward.
export function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
