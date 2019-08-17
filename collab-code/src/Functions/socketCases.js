// module.exports.socketCases = () => {
// 	console.log("heyo")
// }
import socketIOClient from "socket.io-client";


const PEER_MESSAGE = "peer-message"
const SERVER_BROADCASTS = "broadcast"
const SENT_FROM_CLIENT = "sent-from-client"
const UPDATE_ROOM_ID = "update-room-id"
const SWITCH_ROOM = "switch-room"
const GET_TEXTMODEL_FROM_CLIENT = "get-textmodel-from-client";
const TRANSFER_TEXTMODEL = "transfer-textmodel";
const UPDATE_TEXTMODEL = "update-textmodel";

export default socketCases = () => {
	const socket = socketIOClient(this.state.endpoint)
	this.setState({
		socket: socket
	})

	socket.on("connect", () => {
		socket.emit("room", { room: this.state.room })
	})
	socket.on("updatechat", data => {
		console.log(data)
	})
	socket.on(UPDATE_ROOM_ID, data => {
		/* this is invoked when user first joins, and when they are swapping rooms
		*/
		this.setState({
			roomId: data.roomId
		})
	})
	socket.on(GET_TEXTMODEL_FROM_CLIENT, data => {
		/* server is asking this randomly chosen client in the room to send over
		its textmodel to the user that just joined the room
		*/
		console.log("gimmie text")
		socket.emit(TRANSFER_TEXTMODEL, {textModel: this.state.textModel, newClient: data.newClient})
	})
	socket.on(UPDATE_TEXTMODEL, data => {
		this.setState({
			textModel: data.textModel
		})
	})
	socket.on(PEER_MESSAGE, data => { // when peer sends a message
		// we got peer's recently typed text and its abs pos
		// so let's place that change locally
		// TODO: upgrade from naive abs pos way to crdt
		this.setState({
			receivedFromPeer: true
		})
		if(data.origin === "+delete" || data.origin === "+cut") {
			this.editorWrapper.mergeWithPeerTextAtAbsPos("", data.from, data.to)

		} else {
			// this deals with typed input and paste
			this.editorWrapper.mergeWithPeerTextAtAbsPos(data.text, data.from, data.to)
		}
		
	})
	socket.on(SERVER_BROADCASTS, data => {
		console.log(data)
	});

	socket.on("big-announcement", data => {
		const max = 9;
		const min = 0;
		const arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

		const ind = Math.floor(Math.random() * (max - min + 1) + min);
		/*const f = this.state.textModel + arr[ind]
		this.setState({
			textModel: f
		})*/
		//editor.replaceRange(arr[ind], CodeMirror.Pos(editor.lastLine())
		console.log(this.editorWrapper.codemirrorInstance.lastLine())
	})
}
