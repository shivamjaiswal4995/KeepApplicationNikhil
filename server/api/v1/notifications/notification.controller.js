const notificatioService = require('./notification.service');


const addNotification = (userId, obj, done) => {
    notificatioService.addNotification(userId, obj, done);
}

const getAllNotification = (userId, done) => {
    notificatioService.getAllNotifications(userId, done);
}

const toggleReadFlags = (userId, done) => {
    notificatioService.toggleReadFlags(userId, done);
}

module.exports = {
    addNotification,
    getAllNotification,
    toggleReadFlags
}