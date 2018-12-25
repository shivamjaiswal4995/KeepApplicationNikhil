const noteService = require('./notes.service');

const getAllNotes = (userId, done) => {
    noteService.getAllNotes(userId, done);
};

const addNote = (userId, noteObj, done) => {
    noteService.addNote(userId, noteObj, done);
};

const deleteNote = (userId, noteId, done) => {
    noteService.deleteNote(userId, noteId, done);
};

const updateNoteDetails = (userId, noteId, updateDetails, done) => {
    noteService.updateNoteDetails(userId, noteId, updateDetails, done);
};

const toggleNoteFavStatus = (userId, noteId, done) => {
    noteService.toggleNoteFavStatus(userId, noteId, done);
};

const getNote = (userId, noteId, done) => {
    noteService.getNote(userId, noteId, done);
};

const findNotes = (userId, searchDetails, done) => {
    noteService.findNotes(userId, searchDetails, done);
};

const shareNote = (userIdOfDiffUser, noteObj, done) => {
    noteService.shareNote(userIdOfDiffUser, noteObj, done);
}

const toggleSentFlags = (userId, noteId, done) => {
    noteService.toggleSentFlags(userId, noteId, done);
}

module.exports = {
    addNote,
    deleteNote,
    updateNoteDetails,
    toggleNoteFavStatus,
    getNote,
    findNotes,
    getAllNotes,
    shareNote,
    toggleSentFlags
}