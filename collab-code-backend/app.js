const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const rand = require("random-key");



const port = process.env.PORT || 4001;
const index = require("./routes/index");

app.use(index);
const server = http.createServer(app);
//io is a Socket.IO server instance attached to an instance of 
//http.Server listening for incoming events (.listen() used below)
const io = socketIo(server);

// useful vars 
let interval;
var i = 0;	
var clients = 0;	
const SENT_FROM_SERVER = "sent-from-server";
const PEER_MESSAGE = "peer-message";
const SERVER_BROADCASTS = "broadcast";
const SENT_FROM_CLIENT = "sent-from-client";
const MAKE_ROOM = "room";
const UPDATE_ROOM_ID = "update-room-id";
const ROOM_ID_LENGTH = 7; // used to get the right room (might wana try diff way)
const SWITCH_ROOM = "switch-room";
const NEW_ROOM_INFO = "new-room-info";

var rando = 0

// TODO: generate socket usernames

io.on("connection", socket => {
	clients++;

	var roomId = rand.generate(7);
	socket.join(roomId);	
	console.log("new client connected to room ", roomId);
	socket.emit(UPDATE_ROOM_ID, { roomId: roomId});

	io.sockets.emit(SERVER_BROADCASTS, { description: clients + ' clients connected!'});

	socket.on(SENT_FROM_CLIENT, (data, id) => {
		console.log(data.text);
		for (room in socket.rooms) {
			if (room.length === ROOM_ID_LENGTH) {
				socket.to(room).emit(PEER_MESSAGE, data);
			}
		}
		console.log(data);
	});

	socket.on(SWITCH_ROOM, data => {
		console.log(data)
		socket.leave(data.currentRoom)
		socket.join(data.nextRoom)
		// tell the client what room was joined
		socket.emit(UPDATE_ROOM_ID, { roomId: data.nextRoom });
        // notify the room the client left and is joining TODO: use socket.username here
        socket.broadcast.to(data.currentRoom).emit('updatechat','someone has left this room');
        socket.broadcast.to(data.nextRoom).emit('updatechat','someone has joined this room');



	})

	socket.on("disconnect", () => {
		clients--;
		console.log("client disconnected");
		io.sockets.emit(SERVER_BROADCASTS, { description: clients + " clients connected"})
		clearInterval(interval);
	});
});


server.listen(port, () => console.log(`listening on port ${port}`))