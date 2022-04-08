const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  auth: {
    user: "sonmike668899@gmail.com",
    pass: "passwird123",
  },
  host: "smtp.gmail.com",
});

const mailer = async ({ subject, to, text, html }) => {
  await transport.sendMail({
    subject: subject || "Test Subject",
    to: to || "sonmychael@gmail.com",
    text: text || "Test Nodemailer",
    html: html || "<h1>This is sent from my Express API</h1>",
  });
};

module.exports = mailer;
