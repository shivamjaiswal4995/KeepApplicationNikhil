const router = require('express').Router();
const groupsController = require('./groups.controller');
const isAuthenticated = require('../auth/authController');
const config = require('../../../config');
const logger = require('../../../logger');


/**
 * Effective URL is (GET) api/v1/groups/
 * for fetching all the groups
 */

router.get('/', isAuthenticated, (req, res) => {
    groupsController.findAllGroup(req.userId, (err, groups) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occured while fetching all the groups: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(groups);
        }
    });
});

/**
 * Effective URL is (GET) api/v1/groups/:id
 * for fetching a particular group
 */

router.get('/:id', isAuthenticated, (req, res) => {
    let groupId = req.params.id;
    groupsController.getGroup(req.userId, groupId, (err, group) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while fetching a particular group: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(group);
        }
    });
});


/**
 * Effective URL is (POST) api/v1/groups/
 * for creating a new group
 */

router.post('/', isAuthenticated, (req, res) => {
    let groupObj = {
        title: req.body.title,
        description: req.body.description
    };
    groupsController.createGroup(req.userId, groupObj, (err, createdGroup) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while creating a new group: ", err);
            }
            res.status(500).send(err);
        } else {
            res.status(200).send(createdGroup);
        }
    });
});


/**
 * Effective URL is (PUT) api/v1/groups/:id
 * for adding a particular note to a particular group
 */

router.put('/:id', isAuthenticated, (req, res) => {
    let groupId = req.params.id;
    groupsController.addNoteToGroup(req.userId, groupId, req.body.noteId, (err, updatedGroup) => {
        if(err) {
            if(config.logging) {
                logger.error("error occurred while adding a particular note to the group: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(updatedGroup);
        }
    });
});


/**
 * Effective URL is (PUT) api/v1/groups/removeNote/:id
 * for removing a particular note from a group
 */

router.put('/removeNote/:id', isAuthenticated, (req, res) => {
    let groupId = req.params.id;
    let noteId = req.body.noteId;
    groupsController.removeNoteFromGroup(req.userId, groupId, noteId, (err, updatedGroup) => {
        if(err) {
            if(config.logging) {
                logger.error("Errir occured while removing a particular note from a group: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(updatedGroup);
        }
    });
});


/**
 * Effective URL is (DELETE) api/v1/groups/:id
 * for deleting a particular group
 */

router.delete('/:id', isAuthenticated, (req, res) => {
    let groupId = req.params.id;
    groupsController.deleteGroup(req.userId, groupId, (err, deletedGroup) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while deleting a particular group: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).send(deletedGroup);
        }
    });
})


module.exports = router;