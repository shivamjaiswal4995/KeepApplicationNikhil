const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notificationId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    readFlag: { type: Boolean, default: false}
});

notificationSchema.index({ notificationId: 1, userId: 1 });

module.exports = mongoose.model('notifications', notificationSchema);