const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_KEY);

const email = {};

email.sendWelcome = (email, name) => {
    sgMail.send({
        to: email,
        from: 'no-reply@taskapp.com',
        subject: 'Welcome to the TaskApp!',
        text: `Welcome to the TaskApp ${name}`
    }, false, (err) => {
        //Make changes here to better handle sg erros.
    });
}

module.exports = email;