const router = require('express').Router();
const notificationController = require('./notification.controller');
const isAuthenticated = require('../auth/authController');
const config = require('../../../config');
const logger = require('../../../logger');


router.get('/', isAuthenticated, (req, res) => {
    notificationController.getAllNotification(req.userId, (err, notifications) => {
        if(err) {
            console.log('Error occurred while fetching all the notifications of the user: ', err);
            return res.status(500).send(err);
        } else {
            return res.status(200).send(notifications);
        }
    });
});

router.put('/toggleReadFlags', isAuthenticated, (req, res) => {
    notificationController.toggleReadFlags(req.userId, (err, rawResponse) => {
        if(err) {
            console.log('Error occurred while toggling all the read flags of notifications: ', err);
            return res.status(500).send(err);
        } else {
            console.log('toggling read flags successful: ', rawResponse);
            return res.status(200).send(rawResponse);
        }
    })
});

module.exports = router;

