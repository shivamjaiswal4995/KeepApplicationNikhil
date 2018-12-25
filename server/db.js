const mongoose = require('mongoose');
const config = require('./config');

const init = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.url)
        .then(() => console.log(`connected to ${config.db.url.split('/')[3]} database`))
        .catch((err) => console.log('error occured whle connecting to testUserDb', err));
};

module.exports = {
    init: init
};