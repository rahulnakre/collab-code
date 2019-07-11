const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");


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
const SENT_FROM_SERVER = "sent-from-server"
const PEER_MESSAGE = "peer-message"
const SERVER_BROADCASTS = "broadcast"
const SENT_FROM_CLIENT = "sent-from-client"
const MAKE_ROOM = "room"

var rand = 0

io.on("connection", socket => {
	clients++;
	// console.log("new client connected");
	console.log("rand", rand);
	if (rand % 2 === 0) {
		socket.join("eve");	
		console.log("new client connected to room 'eve'");
	} else {
		socket.join("odd");	
		console.log("new client connected to room 'odd'");
	}
	rand++;
	io.sockets.emit(SERVER_BROADCASTS, { description: clients + ' clients connected!'});
	//socket.emit("socketInfo", "");
	/*interval = setInterval( () => {
		socket.emit("sent-from-server", `emitting rn: ${i}`);
		i++;
	}, 2500);*/

	socket.on(SENT_FROM_CLIENT, (data, id) => {
		console.log(data.text);
		//console.log(socket.rooms)
		for (room in socket.rooms) {
			//console.log(room);
			if (room.length === 3) {
				socket.to(room).emit(PEER_MESSAGE, data);
			}
		}
		// socket.broadcast.emit(PEER_MESSAGE, data);
		//io.emit('peer-message', `peer: ${data}`);
		console.log(data);
	});

	//socket.on(MAKE_ROOM, data => {
		//socket.join("abc123")
	//})

	socket.on("disconnect", () => {
		clients--;
		console.log("client disconnected");
		io.sockets.emit(SERVER_BROADCASTS, { description: clients + " clients connected"})
		clearInterval(interval);
	});
});

/*io.on("updatedTextModelState", socket => {
	console.log("here i am");

});*/

server.listen(port, () => console.log(`listening on port ${port}`))