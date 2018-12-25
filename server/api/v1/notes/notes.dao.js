const noteModel = require('./notes.entity');
const groupModel = require('../groups/groups.entity');
const uuidv4 = require('uuid/v4');


//Fetch all notes
const getAllNotes = (userId, done) => {
    noteModel.find({userId: userId}, (err, notes) => {
        if(err) {
            return done(err);
        } else if(!notes) {
            let err = new Error('No notes found');
            return done(err);
        } else {
            return done(null, notes);
        }
    });
};

//Add note for given userID
const addNote = (userId, noteObj, done) => {
    let newNote = new noteModel({
        noteId: uuidv4(),
        userId: userId,
        userEmail: noteObj.userEmail,
        title: noteObj.title,
        content: noteObj.content,
        groupId: '',
        remindMe: new Date(noteObj.remindMe)
    });

    newNote.save((err, savedNote) => {
        if(err) {
            return done(err)
        } else {
            return done(null, savedNote);
        }
    })
};

//Delete a specific note for given userId
const deleteNote = (userId, noteId, done) => {
    let condition = {
        noteId: noteId,
        userId: userId
    }
    noteModel.findOneAndRemove(condition, (err, note) => {
        if(err) {
            done(err);
        } else if(!note) {
            let errorObj = {
                message: 'No note found!'
            }
            return done(errorObj);
        } else {
            if(note.groupId) {
                let conditionForGroup = {
                    userId: userId,
                    groupId: note.groupId
                }
                groupModel.findOneAndUpdate(conditionForGroup,
                    {$pull: {notes: {noteId: note.noteId}}},
                    {new: true},
                    (err, updatedGroup) => {
                        if(err) {
                            return done(err);
                        } else {
                            return done(null, note);
                        }
                    }
                );
            } else {
                done(null, note);
            }
        }
    });
};

//Update note details for a given userId
const updateNoteDetails = (userId, noteId, updateDetails, done) => {
    
    let condition = {
        noteId: noteId,
        userId: userId
    };
    let update = updateDetails;
    update.modifiedOn = Date.now();
    noteModel.findOneAndUpdate(condition,
        { $set: update },
        { new: true },
        (err, savedNote) => {
            if(err) {
                console.log(`Error occured while upadteing note details for a given userId: ${err}`);
                return done(err);
            } else if(!savedNote) {
                let errorObj = {
                    message: 'No note found!'
                };
                return done(errorObj);
            } else {
                if(savedNote.groupId) {
                    let conditionForGroup = {
                        userId: userId,
                        groupId: savedNote.groupId,
                        'notes.noteId': savedNote.noteId
                    }
                    groupModel.findOneAndUpdate(conditionForGroup,
                        {$set: {'notes.$.title': savedNote.title, 'notes.$.content': savedNote.content, 'notes.$.modifiedOn': savedNote.modifiedOn}},
                        {new: true},
                        (err, updatedGroup) => {
                            if(err) {
                                return done(err);
                            } else {
                                return done(null, savedNote);
                            }
                        }
                    );
                } else {
                    return done(null, savedNote);
                }
            }
        }
    );
};

//Toggle favorite status for a specific note of a user
const toggleNoteFavStatus = (userId, noteId, done) => {
    let condition = {
        noteId: noteId,
        userId: userId
    };
    
    noteModel.findOne(condition, (err, note) => {
        if(err) {
            console.log(`error occured while toggling fav status: ${err}`);
            return done(err);
        } else if(!note) {
            let error = new Error('No such note with the given Id!!')
            return done(error);
        } else {
            let update = {
                favorite: !note.favorite
            }
            noteModel.findOneAndUpdate(condition,
                { $set: update },
                { new: true },
                (err, savedNote) => {
                    if(err) {
                        console.log(`error occured while toggling fav status: ${err}`);
                        return done(err);
                    } else {
                        if(savedNote.groupId) {
                            let conditionForGroup = {
                                userId: userId,
                                groupId: savedNote.groupId,
                                'notes.noteId': savedNote.noteId
                            }
                            groupModel.findOneAndUpdate(conditionForGroup,
                                {$set: {'notes.$.favorite': savedNote.favorite}},
                                {new: true},
                                (err, updatedGroup) => {
                                    if(err) {
                                        return done(err);
                                    } else {
                                        return done(null, savedNote);
                                    }
                                }
                            );
                        } else {
                            return done(null, savedNote);
                        }
                    }
                }
            );
        }
    });
};

//Get a specified note of the user
const getNote = (userId, noteId, done) => {
    let condition = {
        noteId: noteId,
        userId: userId
    };
    noteModel.findOne(condition, (err, note) => {
        if(err) {
            console.log(`Error occued while fetching a specified note of the user: ${err}`);
            return done(err)
        } else {
            return done(null, note);
        }
    });
};

//get user note(s) for a given criteria
const findNotes = (userId, {fav, title, groupId, limit, page, order}, done) => {
    let condition = {
        userId: userId        
    };
    if(fav) {
        condition.favorite = fav;
    }
    if(title) {
        condition.title = title;
    }
    if(groupId) {
        condition.groupId = groupId;
    }
    if(!page) {
        page = 1;
    }
    if(!limit) {
        limit = 1;
    }
    if(!order) {
        order = 1;
    }
    noteModel
        .find(condition)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ modifiedOn: order})
        .exec((err, notes) => {
            if(err) {
                console.log(`Error occured while geting note(s) for a given criteria: ${err}`);
                return done(err);
            } else {
                return done(null, notes);
            }
        });
};

// Share a particular note with different user
const shareNote = (userIdOfDiffUser, noteObj, done) => {
    addNote(userIdOfDiffUser, noteObj, done);
};

const toggleSentFlags = (userId, noteId, done) => {
    console.log('I have been Called');
    const condition = {
        userId: userId,
        noteId: noteId,
        sentFlag: false
    };

    const update = {
        sentFlag: true
    };

            noteModel.findOneAndUpdate(condition,
                { $set: update },
                (err, updatedNote) => {
                    if(err) {
                        console.log('Error occurred while toggling the sentFlag of note', err);
                        return done(err);
                    } else {
                        console.log('response: ', updatedNote);
                        console.log('Toggling successful for noteID: ', updatedNote.noteId);
                        return done(null, updatedNote);
                    }
            });
    
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