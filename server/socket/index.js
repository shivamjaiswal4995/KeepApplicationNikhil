const server = require('../index');
const io = require('socket.io')(server);

module.exports = io;