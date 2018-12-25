const notesDAO = require('./notes.dao');

const getAllNotes = (userId, done) => {
    notesDAO.getAllNotes(userId, done);
};

const addNote = (userId, noteObj, done) => {
    notesDAO.addNote(userId, noteObj, done);
};

const deleteNote = (userId, noteId, done) => {
    notesDAO.deleteNote(userId, noteId, done);
};

const updateNoteDetails = (userId, noteId, updateDetails, done) => {
    notesDAO.updateNoteDetails(userId, noteId, updateDetails, done);
};

const toggleNoteFavStatus = (userId, noteId, done) => {
    notesDAO.toggleNoteFavStatus(userId, noteId, done);
};

const getNote = (userId, noteId, done) => {
    notesDAO.getNote(userId, noteId, done);
};

const findNotes = (userId, searchDetails, done) => {
    notesDAO.findNotes(userId, searchDetails, done);
};

const shareNote = (userIdOfDiffUser, noteObj, done) => {
    notesDAO.shareNote(userIdOfDiffUser, noteObj, done);
}

const toggleSentFlags = (userId, noteId, done) => {
    console.log('Toggling service is called for userId: ', userId, ' NoteId: is', noteId + 'Under notes.service.js');
    notesDAO.toggleSentFlags(userId, noteId, done);
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