const groupsDAO = require('./groups.dao');

const findAllGroup = (userId, done) => {
    groupsDAO.findAllGroup(userId, done);
};

const createGroup = (userId, groupObj, done) => {
    groupsDAO.createGroup(userId, groupObj, done);
};

const addNoteToGroup = (userId, groupId, noteId, done) => {
    groupsDAO.addNoteToGroup(userId, groupId, noteId, done);
};

const removeNoteFromGroup = (userId, groupId, noteId, done) => {
    groupsDAO.removeNoteFromGroup(userId, groupId, noteId, done);
};

const getGroup = (userId, groupId, done) => {
    groupsDAO.getGroup(userId, groupId, done);
};

const deleteGroup = (userId, groupId, done) => {
    groupsDAO.deleteGroup(userId, groupId, done);
}

module.exports = {
    findAllGroup,
    createGroup,
    addNoteToGroup,
    removeNoteFromGroup,
    getGroup,
    deleteGroup
};