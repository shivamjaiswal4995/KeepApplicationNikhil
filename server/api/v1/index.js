const router = require('express').Router();
const usersRouter = require('./users');
const notesRouter = require('./notes');
const groupsRouter = require('./groups');
const notificationRouter = require('./notifications');


router.use('/users', usersRouter);
router.use('/notes', notesRouter);
router.use('/groups', groupsRouter);
router.use('/notifications', notificationRouter);

module.exports = router;