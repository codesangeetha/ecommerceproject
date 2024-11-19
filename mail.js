

const { MailtrapClient } = require("mailtrap");

const TOKEN = "a72cedfa02a11c174c1e8596b1bc1f14";
const ENDPOINT = "https://send.api.mailtrap.io/";
const client = new MailtrapClient({ endpoint: ENDPOINT, token:TOKEN});

sendEmail("sangeetharenganath98@gmail.com", "test", "test msg");


async function sendEmail(toEmail, subject, message) {

    const sender = {
        email: "mailtrap@demomailtrap.com",
        name: "Mailtrap Test",

    };

    const recipients = [
        {
            email: toEmail,
        },
    ];

    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: subject,
            text: message,
            category: "Integration Test",
        });
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}