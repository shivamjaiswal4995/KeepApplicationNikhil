const nodemailer = require('nodemailer');
const config = require('../../../config');
const logger = require('../../../logger');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'keep.application@gmail.com',
        pass: 'keepApplication@123'
    }
});


const sendNotificationMail = (details) => {
    const sendersName = details.sendersName;
    const receiversName = details.receiversName;
    const title = details.title;
    const message = `<strong>Dear ${receiversName}</strong>, <br>Greetings to you.<br><br><p> User ${sendersName} has shared a note titled <strong>${title}</strong> with you at KeeP Note Sharing Application. 
    Please login and check it out.<br>No need to reply to this mail.<br><br><br>With Regards,<br>John Smith<br>KeeP Team `;
    
    let mailOptions = {
        from: 'keep.application@gmail.com',
        to: details.to,
        subject: 'Note has been shared to you',
        html: message
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while sending notification mail: ", err);
            }
            console.log("Error occurred while sending notification mail: ", err);
        } else {
            console.log('Notification mail has been sent successfully!');
        }
    });
}

const sendReminderMail = details => {

    const title = details.title;
    const message = `<strong>Dear KeeP user</strong>, <br><br>This is just a reminder mail for your note titled
        <strong>${title}</strong> which was set for today at ${details.time}.<br><br> Don't miss out and have fun!<br><br> 
        With Regards,<br>John Smith<br>KeeP Team `;
    
    let mailOptions = {
        from: 'keep.application@gmail.com',
        to: details.to,
        subject: 'Reminder mail',
        html: message        
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while sending reminder mail: ", err);
            }
            console.log("Error occurred while sending reminder mail: ", err);
        } else {
            console.log('Reminder mail has been sent successfully!');
        }
    });
}

module.exports = {
    sendNotificationMail,
    sendReminderMail
}

