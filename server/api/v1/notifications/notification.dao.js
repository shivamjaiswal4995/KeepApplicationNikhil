const notificationModel = require('./notification.entity');
const uuidv4 = require('uuid/v4');


//Creating new notifications
const addNotification = (userId, obj, done) => {
    let newNotification = new notificationModel({
        notificationId: uuidv4(),
        userId: userId,
        content: obj.content
    });

    newNotification.save((err, savedNotification) => {
        if(err) { 
            return done(err);
        } else {
            return done(null, savedNotification);
        }
    });
};


// fetch all notifications of a particular user
const getAllNotifications = (userId, done) => {
    notificationModel.find({userId: userId, readFlag: false}, (err, notifications) => {
        if(err) {
            return done(err);
        } else if(!notifications) {
            let error = new Error('no notifications found!');
            return done(error);
        } else {
            return done(null, notifications);
        }
    });
};


// Toggling read flags of all the notifications of a user
const toggleReadFlags = (userId, done) => {
    let condition = {
        userId: userId,
        readFlag: false
    };
    let update = {
        readFlag: true
    }
    notificationModel.update(condition, update, { multi: true }, (err, rawResponse) => {
        if(err) {
            return done(err);
        } else {
            console.log("toggling notifications read flag: ", rawResponse);
            return done(null, null);
        }
    });
};

module.exports = {
    addNotification,
    getAllNotifications,
    toggleReadFlags
}

