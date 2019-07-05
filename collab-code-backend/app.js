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

let interval;
var i = 0;	
var clients = 0;	
io.on("connection", socket => {
	clients++;
	console.log("new client connected");
	io.sockets.emit('broadcast', { description: clients + ' clients connected!'});
	//socket.emit("socketInfo", "");
	/*interval = setInterval( () => {
		socket.emit("sent-from-server", `emitting rn: ${i}`);
		i++;
	}, 2500);*/

	socket.on("sent-from-client", data => {
		console.log(data.textModel)
		socket.broadcast.emit('peer-message', data);
		//io.emit('peer-message', `peer: ${data}`);
		console.log(data);
	});

	socket.on("disconnect", () => {
		clients--;
		console.log("client disconnected");
		io.sockets.emit("broadcast", { description: clients + " clients connected"})
		clearInterval(interval);
	});
});

/*io.on("updatedTextModelState", socket => {
	console.log("here i am");

});*/

server.listen(port, () => console.log(`listening on port ${port}`))