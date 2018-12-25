const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    noteId: { type: String, required: true},
    userId: { type: String, required: true},
    userEmail: {type: String, require: true},
    groupId: { type: String},
    title: { type: String, required: true},
    content: { type: String, default: ''},
    favorite: { type: Boolean, default: false},
    createdOn: { type: Date, default: Date.now},
    modifiedOn: { type: Date, default: Date.now},
    remindMe: {type: Date, default: null},
    sentFlag: { type: Boolean, default: false}
});

noteSchema.index({userId: 1, title: 1, noteId: 1}, {unique: true});

module.exports = mongoose.model('notes', noteSchema);   