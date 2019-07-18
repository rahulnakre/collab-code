import React from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
import AppComponent from "./AppComponent"
import axios from "axios";
import { Controlled as CodeMirror } from 'react-codemirror2';
import Editor from "./Editor"
// handle functions
//import handleFormSubmit from "./Functions/handleFunctions";

//const SENT_FROM_SERVER = "sent-from-server"
const PEER_MESSAGE = "peer-message"
const SERVER_BROADCASTS = "broadcast"
const SENT_FROM_CLIENT = "sent-from-client"
const UPDATE_ROOM_ID = "update-room-id"
const SWITCH_ROOM = "switch-room"
const GET_TEXTMODEL_FROM_CLIENT = "get-textmodel-from-client";
const TRANSFER_TEXTMODEL = "transfer-textmodel";
const UPDATE_TEXTMODEL = "update-textmodel";
//const NEW_ROOM_INFO_FROM_SERVER = "new-room-info-from-server"


class App extends React.Component {

	constructor(props) {
		super(props)
		this.editorWrapper = null
	}

	state = {
		textModel: "",
		endpoint: "http://127.0.0.1:4001",
		response: "",
		socket: null,
		receivedFromPeer: false,
		roomId: null,
		roomToJoin: "",
		invalidRoomMsg: false
	}



	componentDidMount() {
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

	componentDidUpdate() { 
		//console.log(this.state)
		//console.log(this.state.invalidRoomMsg)
		console.log(this.editorWrapper)
	}

	handleBeforeTextModelChange = (editor, data, value) => {
		console.log(value)
		this.setState({
			textModel: value 
		})
		console.log(!this.state.receivedFromPeer)
		// we only want to emit if this client typed or pasted something
		if (!this.state.receivedFromPeer) {
			this.state.socket.emit(SENT_FROM_CLIENT, 
				{ 
					text: data.text,
					absPos: editor.getCursor(),
					from: data.from,
					to: data.to,
					origin: data.origin
				}
			)
		}
		this.setState({
			receivedFromPeer: false
		})
	}


/*	mergeWithPeerTextAtAbsPos = (peerText, from, to) => {
		// The text the peer sent will be added locally at the same absolute position
		// as the peer.
		//
		const fromLine = from.line
		const fromCh = from.ch
		const toLine = to.line
		const toCh = to.ch
		this.editorWrapper.codemirrorInstance.replaceRange(peerText, {line: fromLine, ch: fromCh}, {line: toLine, ch: toCh})
	}*/

	getEditor = editor => {
		this.editorWrapper = new Editor(editor)

	}
	
	handleFormSubmit = (event) => {
		event.preventDefault()

		console.log("submit")
		if (this.state.roomToJoin === "") {
			this.setState({
				invalidRoomMsg: true
			})
			return
		} else if (this.state.roomToJoin.length !== 7) {
			this.setState({
				invalidRoomMsg: true
			})
			return
		}

		axios.get(`http://localhost:4001/validate-new-room/${this.state.roomToJoin}`)
		.then( res => {
			if (!res.data.isNewRoomValid) {
				this.setState({
					invalidRoomMsg: true
				})
				return
			}
		})

		this.setState({
			invalidRoomMsg: false
		})

		this.state.socket.emit(SWITCH_ROOM, {
			currentRoom: this.state.roomId,
			nextRoom: this.state.roomToJoin
		})
	}

	handleFormChange = (event) => {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})

	}

	handleDoom = () => {
		this.state.socket.emit("doom", {room: this.state.roomId})
	}

	render() {
		const codeMirrorConfig = {
			theme: "material",
			lineNumbers: true,
			lineWrapping: true
		}
		
		return(
			<div>
				<AppComponent 
					roomId={this.state.roomId}
					codeMirrorConfig={codeMirrorConfig}
					textModel={this.state.textModel}
					handleBeforeTextModelChange={this.handleBeforeTextModelChange}
					handleTextModelChange={this.handleTextModelChange}
					getEditor={this.getEditor}
					handleFormSubmit={this.handleFormSubmit}
					roomToJoin={this.state.roomToJoin}
					handleFormChange={this.handleFormChange}
					invalidRoomMsg={this.state.invalidRoomMsg}
				/>
				<button onClick={this.handleDoom}>doom</button>
			</div>
		)
	}
}

export default App;
