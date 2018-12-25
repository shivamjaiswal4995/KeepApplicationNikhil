const groupModel = require('./groups.entity');
const noteModel = require('../notes/notes.entity');
const noteService = require('../notes/notes.service');
const uuidv4 = require('uuid/v4');


// find all the groups of a particular user
const findAllGroup = (userId, done) => {
    groupModel.find({userId: userId}, (err, groups) => {
        if(err) {
            return done(err);
        } else if(!groups) {
            let err = new Error('No groups found!');
            return done(err);
        } else {
            return done(null, groups);
        }
    });
};

//Create a new group
const createGroup = (userId, groupObj, done) => {
    let newGroup = new groupModel({
        groupId: uuidv4(),
        userId: userId,
        title: groupObj.title,
        description: groupObj.description
    });
    newGroup.save((err, createdGroup) => {
        if(err) {
            console.log(`Error occured while creating new Group: ${err}`);
            return done(err);
        } else {
            return done(null, createdGroup);
        }
    });
};

//Add specific note to the specific group
const addNoteToGroup = (userId, groupId, noteId, done) => {

    let conditionForNote = {
        noteId: noteId,
        userId: userId
    };
    let conditionForGroup = {
        groupId: groupId,
        userId: userId
    };

    let updateToNote = {
        groupId: groupId
    };
    
    groupModel.findOne(conditionForGroup, (err, group) => {
        if(err) {
            return done(err);
        } else if(!group) {
            // let error = new Error('No such group found with the given Id!!');
            let errorObj = {
                message: 'No such group found!'
            };
            return done(errorObj);
        } else {
            noteModel.findOneAndUpdate(conditionForNote, updateToNote, {new: true},  (err, updatedNote) => {
                if(err) {
                    return done(err);
                } else if(!updatedNote) {
                    let errorObj = {
                        message: 'Note not found while adding to the group!'
                    };
                    return done(errorObj);
                } else {
                    groupModel.findOneAndUpdate(conditionForGroup,
                        { $addToSet: {
                            notes: updatedNote
                        },
                        $set: {
                            modifiedOn: Date.now()
                        }},
                        { new: true },
                        (error, updatedGroup) => {
                            if(error) {
                                console.log(`Error occured while adding specific note to the specific group: ${error}`);
                                return done(error);
                            } else if(!updatedGroup) {
                                let customError = new Error('Could note find the group');
                                return done(customError);
                            } else {
                                return done(null, updatedGroup);
                            }
                        }
                    );
                }
            });
        }
    });
};

//Remove specific note from the group
const removeNoteFromGroup = (userId, groupId, noteId, done) => {
    console.log('Note id: ', noteId);
    let conditionForGroup = {
        groupId: groupId,
        userId: userId
    };
    let conditionForNote = {
        noteId: noteId,
        userId: userId
    };
    groupModel.findOne(conditionForGroup, (err, group) => {
        if(err) {
            return done(err);
        } else if(!group) {
            let error = new Error('No such group found with the given Id!!');
            return done(error, null);
        } else {
            noteModel.findOne(conditionForNote, (err, note) => {
                if(err) {
                    console.log(`: ${err} `);
                    return done(err);
                } else if(!note) {
                    let error = new Error(`Couldn't find the note while removing from the specific group!!`);
                    return done(error);
                } else {
                    console.log('found the note and removing note now');
                    groupModel.findOneAndUpdate(conditionForGroup,
                        {
                            $pull: {
                                notes: {noteId: note.noteId}
                            },
                            $set: {
                                modifiedOn: Date.now()
                            }
                        },
                        { new: true },
                        (err, updatedGroupDoc) => {
                            if(err) {
                                console.log(`Error occured while removing the note from the specific group!!`);
                                return done(err);
                            } else if(!updatedGroupDoc) {
                                let error = new Error(`couldn't find the group while removing the note!!`);
                                return done(error);
                            } else {
                                let update = {
                                    groupId: '',
                                    modifiedOn: Date.now()
                                }
                                const groupDoc = updatedGroupDoc;
                                noteModel.findOneAndUpdate(conditionForNote,
                                    { $set: update },
                                    { new: true },
                                    (err, updatedNote) => {
                                        if(err) {
                                            console.log(`Error occured while updating the groupId of note after removing it from the group: ${err}`);
                                            return done(err);
                                        } else {
                                            return done(null, groupDoc);
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            });
        }
    });
};


//Get group details for a specified groupId of the user
const getGroup = (userId, groupId, done) => {
    let condition = {
        groupId: groupId,
        userId: userId
    };
    groupModel.findOne(condition, (err, group) => {
        if(err) {
            console.log(`Error occured while fetching the group details for the specoific groupId! ${err}`);
            return done(err);
        } else {
            return done(null, group);
        }
    });
};

const deleteGroup = (userId, groupId, done) => {
    let condition = {
        userId: userId,
        groupId: groupId
    };

    groupModel.findOneAndRemove(condition, (err, deletedGroup) => {
        if(err) {
            return done(err);
        } else {
            return done(null, deletedGroup);
        }
    });
}

module.exports = {
    findAllGroup,
    createGroup,
    addNoteToGroup,
    removeNoteFromGroup,
    getGroup,
    deleteGroup
};