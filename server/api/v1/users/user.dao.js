const userModel = require('./user.entity');
const signToken = require('../JWT').signToken;
const verifyToken = require('../JWT').verifyToken;
const bcrypt = require('bcryptjs');
const config = require('../../../config');
const uuidv4 = require('uuid/v4');

const addUser = (userObj, done) => {
    let hashedPassword = bcrypt.hashSync(userObj.password);

    let newUser = new userModel({
        userId: uuidv4(),
        userName: userObj.userName,
        userEmail: userObj.userEmail,
        password: hashedPassword
    });

    newUser.save((err, savedUser) => {
        if(err) {
            return done(err);
        } else {
            // generating token
            let payload = {
                userName: savedUser.userName,
                userEmail: savedUser.userEmail,
                userId: savedUser.userId
            };
            signToken(payload, config.secret, 43200, done);
        }
    });
};

const findUser = (userObj, done) => {
    userModel.findOne({ userEmail: userObj.username}, (err, user) => {
        if(err) {
            return done(err);
        } else if(!user) {
            let errObj = {
                auth: false,
                token: null,
                message: 'No user found'
            };
            return done(errObj);
        } else {
            const validPassword = bcrypt.compareSync(userObj.password, user.password);
            if(!validPassword) {
                let errObj = {
                    auth: false,
                    token: null,
                    message: 'Incorrect password'
                };
                return done(errObj);
            } else {
                let payload = {
                    userName: user.userName,
                    userEmail: user.userEmail,
                    userId: user.userId
                };
                signToken(payload, config.secret, 43200, done);
            }
        }
    });
}

const userProfile = (userId, done) => {
    // console.log(`user id is ${userId}`);
    userModel.findOne({userId: userId}, {password: 0}, (err, user) => {
        if(err) {
            return done(err);
        } else if(!user) {
            let err = new Error('No user found!');
            return done(err);
        } else {
            return done(null, user);
        }
    })
}

const getAllUsers = (done) => {
    userModel.find({}, {password: 0}, (err, users) => {
        if(err) {
            return done(err);
        } else {
            return done(null, users);
        }
    });
};


module.exports = {
    addUser,
    findUser,
    userProfile,
    getAllUsers
}