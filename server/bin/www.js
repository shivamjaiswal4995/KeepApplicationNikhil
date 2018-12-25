const server = require('../index.js');
const logger = require('../logger');
const io = require('socket.io')(server);
const port = (process.env.PORT || 3000);
const notificationController = require('../api/v1/notifications/notification.controller');

server.listen(port, () => {
	console.log(` server is listening on ${port} `);
}).on('error', err => {
	if(err.errno === 'EADDRINUSE'){
		logger.error(`current port ${port} is in use, please run the server on different port`);
		console.log(`current port ${port}is in use, please run the server on different port`);
	} else {
		logger.error("error while starting up the server: ", err);
		console.log("error while starting up the server: ", err);
	}
}).on('request', req => {
	// console.log("*********** Getting a new request **********", req.url);
});


io.on('connection', socket => {
	// sockets.add(socket);
	// console.log("Socket: ", socket);
	console.log(`Socket ${socket.id} added`);
	
	socket.on('signin', data => {
		console.log("Data recieved in SIGNIN event ", data, socket.id);
		socket.join(data.userEmail); 
	});

	socket.on('signup', data => {
		console.log("Data recieved in SIGNUP event ", data, socket.id);
		socket.join(data.userEmail);
	});

	socket.on('share', data => {
		const email = data.receipient.split(',')[1].trim();
		console.log('Data received on SHARE event', email, socket.id);
		const response = {
			title: data.title,
			from: data.sender
		}
		
		if(io.sockets.adapter.rooms[email]) {
			// console.log('room exists');
			io.sockets.in(email).emit('notify', response);
		} else {
			let obj = {
				content: `Note titled "${data.title}" has been shared to you by user ${data.sender}`
			}
			notificationController.addNotification(data.idOfSharedUser, obj, (err, savedNotification) => {
				if(err) {
					logger.error('error occurred while saving notification: ', err);
				} else {
					console.log('Notification saved: ', savedNotification);
				}
			});
			// console.log('room does not exist!');
		}
	});

    socket.on('disconnect', () => {
		console.log(`Deleting socket: ${socket.id}`);
	});
});