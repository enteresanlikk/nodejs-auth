const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: +process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER_EMAIL,
        pass: process.env.MAIL_PASSWORD
    },
});

const send = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `'${process.env.MAIL_USER_NAME}' <${process.env.MAIL_USER_EMAIL}>`,
            to,
            subject,
            html
        });
    } catch (error) {
        console.log('Email error: ', error);
    }
};

module.exports = {
    send
};