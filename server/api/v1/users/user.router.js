const router = require('express').Router();
const isAuthenticated = require('../auth/authController');
const userController = require('./user.controller');
const config = require('../../../config');
const logger = require('../../../logger');


/**
 * Effective URL is (GET) api/v1/users/
 * for fetching all the users
 */

router.get('/', isAuthenticated, (req, res) => {
    userController.getAllUsers((err, users) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while fetching all the users: ", err);
            }
            return res.status(500).send(err);
        } else {
            return res.status(200).json(users);
        }
    });
});


/**
 * Effective URL is (POST) api/v1/users/isAuthenticated
 * for authenticating a particular user
 */

router.post('/isAuthenticated', isAuthenticated, (req, res) => {
    return res.status(200).json({isAuthenticated: true});
});


/**
 * Effective URL is (POST) api/v1/users/signin
 * for signing in a particular user
 */

router.post('/signin', (req, res) => {
    if(req.body && req.body.username && req.body.password) {
        let userObj = {
            username: req.body.username,
            password: req.body.password
        }
        userController.findUser(userObj, (err, generatedToken) => {
            if(err) {
                if(config.logging) {
                    logger.error("Error occurred while signing in a particular user: ", err);
                }
                // console.log(err.message);
                return res.status(401).json(err);
            } else {
                return res.status(200).send(generatedToken);
            }
        });
    } else {
        return res.status(401).send('Invalid credentials!');
    }
});


/**
 * Effective URL is (POST) api/v1/users/register
 * for signing up a new user
 */

router.post('/register', (req, res) => {
    if(req.body && req.body.name && req.body.email && req.body.password) {
        let userObj = {
            userName: req.body.name,
            userEmail: req.body.email,
            password: req.body.password
        };
        userController.addUser(userObj, (err, generatedToken) => {
            if(err) {
                if(config.logging) {
                    logger.error("Error occurred while signing up a new user: ", err);
                }
                return res.status(500).json(err);
            } else {
                return res.status(200).send(generatedToken);
            }
        });
    }else {
        res.status(401).send('Please provide all the necessary details!');
    }
});


/**
 * Effective URL is api/v1/users/profile
 * for fetching a detail of a particular user
 */

router.get('/profile', isAuthenticated, (req, res) => {
    let userId = req.userId;
    userController.userProfile(userId, (err, result) => {
        if(err) {
            if(config.logging) {
                logger.error("Error occurred while fetching detail of a particular user: ", err);
            }
            res.status(500).json(err);
        } else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;