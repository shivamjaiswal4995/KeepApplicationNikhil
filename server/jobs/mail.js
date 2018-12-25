const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'keep.application@gmail.com',
        pass: 'keepApplication@123'
    }
});

let mailOptions = {
    from: 'keep.application@gmail.com',
    to: 'nikhilojha93@gmail.com',
    subject: 'Note has been shared',
    text: 'User Nikhil Ojha has shared a note with you at keep application. Please login and check!'
};

const send = () => {
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log("Error occurred while sending mail: ", err);
        } else {
            console.log('Mail has been sent successfully! ');
        }
    });
}

module.exports = {
    send
}
