export async function sendEmail({ to, subject, html, text }) {

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: {
                name: "AskQuery",
                email: process.env.BREVO_SENDER_EMAIL,
            },
            to: [{ email: to }],
            subject,
            htmlContent: html,
            textContent: text,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Email send failed:", data);
        throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent:", data);
    return "email sent successfully, to " + to;
}