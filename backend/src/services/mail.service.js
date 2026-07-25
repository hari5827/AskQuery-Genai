import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text }) {

    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "AskQuery <onboarding@resend.dev>",
        to,
        subject,
        html,
        text,
    });

    if (error) {
        console.error("Email send failed:", error);
        throw new Error(error.message || "Failed to send email");
    }

    console.log("Email sent:", data);
    return "email sent successfully, to " + to;
}