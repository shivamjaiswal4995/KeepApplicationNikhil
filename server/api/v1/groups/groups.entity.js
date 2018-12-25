const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupId: { type: String, require: true },
    userId: { type: String, required: true },
    title: { type: String, default: 'undefined', unique: true },
    description: { type: String },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
    notes: [{}]
});

groupSchema.index({ groupId: 1, userID: 1, title: 1}, { unique: true });

module.exports = mongoose.model('groups', groupSchema);