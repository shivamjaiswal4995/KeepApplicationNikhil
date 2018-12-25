const groupService = require('./groups.service');

const findAllGroup = (userId, done) => {
    groupService.findAllGroup(userId, done);
};

const createGroup = (userId, groupObj, done) => {
    groupService.createGroup(userId, groupObj, done);
};

const addNoteToGroup = (userId, groupId, noteId, done) => {
    groupService.addNoteToGroup(userId, groupId, noteId, done);
};

const removeNoteFromGroup = (userId, groupId, noteId, done) => {
    groupService.removeNoteFromGroup(userId, groupId, noteId, done);
};

const getGroup = (userId, groupId, done) => {
    groupService.getGroup(userId, groupId, done);
};

const deleteGroup = (userId, groupId, done) => {
    groupService.deleteGroup(userId, groupId, done);
}

module.exports = {
    findAllGroup,
    createGroup,
    addNoteToGroup,
    removeNoteFromGroup,
    getGroup,
    deleteGroup
};