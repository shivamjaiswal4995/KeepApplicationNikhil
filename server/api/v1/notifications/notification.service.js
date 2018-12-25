const notificationDAO = require('./notification.dao');


const addNotification = (userId, obj, done) => {
    notificationDAO.addNotification(userId, obj, done);
}

const getAllNotifications = (userId, done) => {
    notificationDAO.getAllNotifications(userId, done);
}

const toggleReadFlags = (userId, done) => {
    notificationDAO.toggleReadFlags(userId, done);
}

module.exports = {
    addNotification,
    getAllNotifications,
    toggleReadFlags
}