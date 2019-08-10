const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const rand = require("random-key");
const bodyParser = require('body-parser');
const cors = require('cors')

// CRDT
const CRDT = require("./crdt/CRDT");

const port = process.env.PORT || 4001;
const index = require("./routes/index");


//app.use(cors());

app.use( (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

//pre-flight requests
app.options('*', function(req, res) {
	res.sendStatus(200);
});

app.use(index); // dont think i need this
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
//io is a Socket.IO server instance attached to an instance of 
//http.Server listening for incoming events (.listen() used below)
const io = socketIo(server);

// useful vars 
let interval;
var i = 0;	
var clients = 0;
var totalSocketIORooms = {};
// useful for removing unused room, so Ids can be reused
var roomsToUsers = {}
// note: siteIds are sockets
var totalSiteIds = {};	

const SENT_FROM_SERVER = "sent-from-server";
const PEER_MESSAGE = "peer-message";
const SERVER_BROADCASTS = "broadcast";
const SENT_FROM_CLIENT = "sent-from-client";
const MAKE_ROOM = "room";
const UPDATE_ROOM_ID = "update-room-id";
const UPDATE_SITE_ID = "update-site-id";
const ROOM_ID_LENGTH = 7; // used to get the right room (might wana try diff way)
const SITE_ID_LENGTH = 7; // used to get the right room (might wana try diff way)
const SWITCH_ROOM = "switch-room";
const NEW_ROOM_INFO = "new-room-info";
const GET_TEXTMODEL_FROM_CLIENT = "get-textmodel-from-client";
const TRANSFER_TEXTMODEL = "transfer-textmodel";
const UPDATE_TEXTMODEL = "update-textmodel";



app.get("/validate-new-room/:newroom", (req, res) => {
	res.status(200);
	if (req.params.newroom in totalSocketIORooms) {
		res.json({ isNewRoomValid: true});
	} else {
		res.json({ isNewRoomValid: false});
	}
	res.end();
});



// TODO: generate socket usernames

io.on("connection", socket => {
	clients++;
	
	// give new client a unique siteID
	// var siteID = generateUniqueId("siteID", SITE_ID_LENGTH, totalSiteIds)
	// totalSiteIds[siteID] = true
	// console.log(totalSiteIds)


	var roomId = generateUniqueId("room", ROOM_ID_LENGTH, totalSocketIORooms);
	totalSiteIds[socket.id] = {room: roomId}

	socket.join(roomId);
	totalSocketIORooms[roomId] = {};
	console.log("new client connected to room ", roomId);
	socket.emit(UPDATE_ROOM_ID, { roomId: roomId});
	socket.emit(UPDATE_SITE_ID, {siteId: socket.id});
	
	// every room should have it's own crdt, so here's that
	totalSocketIORooms[roomId] = new CRDT();

	// update number of connected clients
	io.sockets.emit(SERVER_BROADCASTS, { description: clients + ' clients connected!'});

	// when cleint types, send message to other clients thru here (server)
	socket.on(SENT_FROM_CLIENT, (data, id) => {
		console.log(data.text);
		//totalSocketIORooms[]
		// HERE CRDT: here is probably where i want to add to crdt, be
		totalSocketIORooms[data.roomId].localInsert();

		for (room in socket.rooms) {
			if (room.length === ROOM_ID_LENGTH) {
				socket.to(room).emit(PEER_MESSAGE, data);
			}
		}
		console.log(data);
	});

	// when a new client joins, we want to send current textmodel of room to it
	socket.on(TRANSFER_TEXTMODEL, data => {
		/* sending the textmodel of the room to the newly joined client
		*/
	  	io.to(`${data.newClient}`).emit(UPDATE_TEXTMODEL, {textModel: data.textModel});

	});

	socket.on(SWITCH_ROOM, data => {
		console.log(data);
		console.log("my socket: ", socket.id)
		var nextRoomClients = io.sockets.adapter.rooms[data.nextRoom].sockets;
		console.log("next room clients:", nextRoomClients)
		copyRoomTextModel(nextRoomClients, socket.id);
		socket.leave(data.currentRoom);
		socket.join(data.nextRoom);
		// tell the client what room was joined
		socket.emit(UPDATE_ROOM_ID, { roomId: data.nextRoom });
        // notify the room the client left and is joining TODO: use socket.username here
        socket.broadcast.to(data.currentRoom).emit('updatechat','someone has left this room');
        socket.broadcast.to(data.nextRoom).emit('updatechat','someone has joined this room');
	})

	socket.on("doom", data => {		
		io.in(data.room).emit('big-announcement', "");
	});

	socket.on("disconnect", () => {
		console.log(socket.id)
		clients--;
		console.log("client disconnected");
		io.sockets.emit(SERVER_BROADCASTS, { description: clients + " clients connected"});
		clearInterval(interval);
	});
});


copyRoomTextModel = (nextRoomClients, newClient) => {
	const randClient = getRandomClientInRoom(nextRoomClients);
	// ask randClient for their textmodel
  	io.to(`${randClient}`).emit(GET_TEXTMODEL_FROM_CLIENT, {newClient: newClient});

}

getRandomClientInRoom = (clients) => {
	const keys = Object.keys(clients);
	const randIndex = Math.floor(Math.random() * keys.length);
	const randKey = keys[randIndex];
	return randKey;

}

generateUniqueId = (type, length, pastIds) => {
	/* 	type (str): can be either all numberical (for siteID)
			 or can be alphabetical (for roomID)
			options: 'room' or 'siteID'
		length (int): length of the id to be generated
		pastIDs (dict): dict in which past ids are stored, so 
						that we don't duplicate ids


	*/
	
	var id = type === "room" ? rand.generate(length) : rand.generateDigits(length)
	while (id in pastIds) {
		id = rand.generate(length);
	}
	return id;
}


server.listen(port, () => console.log(`listening on port ${port}`))