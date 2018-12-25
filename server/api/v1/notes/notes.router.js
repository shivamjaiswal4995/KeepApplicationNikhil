const router = require('express').Router();
const notesController = require('./notes.controller');
const isAuthenticated = require('../auth/authController');
const mailService = require('../mailService');
const userController = require('../users/user.controller');
const config = require('../../../config');
const logger = require('../../../logger');

 
/**
 * Effective URL is (GET) api/v1/notes/
 * for fetching all the notes
 */

router.get('/', isAuthenticated, (req, res) => {

    notesController.getAllNotes(req.userId, (err, notes) => {
        if(err) {
            if(config.logging) { 
                logger.error("Error occurred while fetching all the notes: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(notes);
        }
    });
});


/**
 * Effective URL is (GET) api/v1/notes/:id
 * for fetching a particular note
 */

router.get('/:id', isAuthenticated, (req, res) => {

    let noteId = req.params.id;
    notesController.getNote(req.userId, noteId, (err, note) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while fetching a particular note: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(note);
        }
    });
});


/**
 * Effective URL is (POST) api/v1/notes/
 * for adding a particular note
 */

router.post('/', isAuthenticated, (req, res) => {
    if(!(req.body && req.body.title)) 
        res.status(500).send('Please fill up the manadatory fields!');
    userController.userProfile(req.userId, (err, user) => {
        if(err) {
            res.status(500).json(err);
        } else {
            let noteObj = {
                userEmail: user.userEmail,
                title: req.body.title,
                content: req.body.content,
                remindMe: req.body.remindMe
            };
            notesController.addNote(req.userId, noteObj, (err, addedNote) => {
                if(err) {
                    if(config.logging) {
                        logger.error("Error occurred while adding a particular note: ", err);
                    }
                    return res.status(500).send(err);
                } else {
                    return res.status(200).send(addedNote);
                }
            });
        }
    })
    
});


/**
 * Effective URL is (DELETE) api/v1/notes/:id
 * for deleting a particular note
 */

router.delete('/:id', isAuthenticated, (req, res) => {

    let noteId = req.params.id;
    notesController.deleteNote(req.userId, noteId, (err, deletedNote) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while deleting a particular note: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(deletedNote);
        }
    });
});


/**
 * Efective URL is (PUT) api/v1/notes/:id
 * for updating a particular note
 */

router.put('/:id', isAuthenticated, (req, res) => {

    let noteId = req.params.id;
    let updateDetails = {};
    if(req.body.groupId) {
        updateDetails.groupId = req.body.groupId;
    }
    if(req.body.title) {
        updateDetails.title = req.body.title;
    }
    if(req.body.content) {
        updateDetails.content = req.body.content;
    }
    notesController.updateNoteDetails(req.userId, noteId, updateDetails, (err, updatedNote) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while updating a particular note: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(updatedNote);
        }
    });
});


/** 
 * Effective URL is (PUT) api/v1/notes/fav/:id
 * for toggling note's favorite status
 */

router.put('/fav/:id', isAuthenticated, (req, res) => {

    let noteId = req.params.id;
    notesController.toggleNoteFavStatus(req.userId, noteId, (err, updatedNote) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while toggling note's favorite status: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(updatedNote);
        }
    });
});


/**
 * Effective URL is api/v1/notes/share
 * for sharing notes with different user
 */

router.post('/share', isAuthenticated, (req, res) => {

    const userIdOfDiffUser = req.body.sharedUserId;
    const noteObj = {
        title: req.body.title,
        content: req.body.content,
        remindMe: req.body.remindMe
    };
    notesController.shareNote(userIdOfDiffUser, noteObj, (err, savedNote) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while sharing notes with different user: ", err);
            }
            return res.status(500).send(err);
        } else {
            const details = {
                to: req.body.sharedUserEmailId,
                sendersName: req.body.sharedByUserName,
                receiversName: req.body.sharedToUserName,
                title: req.body.title
            };
            mailService.sendNotificationMail(details);
            return res.status(200).send(savedNote);
        }
    });
});


module.exports = router;