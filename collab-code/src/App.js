import React from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';

const SENT_FROM_SERVER = "sent-from-server"
const PEER_MESSAGE = "peer-message"
const SERVER_BROADCASTS = "broadcast"
const SENT_FROM_CLIENT = "sent-from-client"
const UPDATE_ROOM_ID = "update-room-id"
const SWITCH_ROOM = "switch-room"
//const NEW_ROOM_INFO_FROM_SERVER = "new-room-info-from-server"


class App extends React.Component {

	constructor(props) {
		super(props)
		this.editorInstance = null
	}

	state = {
		textModel: "",
		endpoint: "http://127.0.0.1:4001",
		response: "",
		socket: null,
		receivedFromPeer: false,
		roomId: null,
		roomToJoin: ""
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
			this.setState({
				roomId: data.roomId
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
				this.mergeWithPeerTextAtAbsPos("", data.from, data.to)
			} else {
				// this deals with typed input and paste
				this.mergeWithPeerTextAtAbsPos(data.text, data.from, data.to)
			}
			
		})
		socket.on(SERVER_BROADCASTS, data => {
			console.log(data)
		});
	}

	componentDidUpdate() { 
		//console.log(this.editorInstance)
		//console.log(this.state)
	}

	handleBeforeTextModelChange = (editor, data, value) => {
		this.setState({
			textModel: value 
		})
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


	mergeWithPeerTextAtAbsPos = (peerText, from, to) => {
		/* The text the peer sent will be added locally at the same absolute position
		   as the peer.
		*/
		const fromLine = from.line
		const fromCh = from.ch
		const toLine = to.line
		const toCh = to.ch
		this.editorInstance.replaceRange(peerText, {line: fromLine, ch: fromCh}, {line: toLine, ch: toCh})
 
	}

	getEditor = editor => {
		this.editorInstance = editor
	}
	
	handleFormSubmit = (event) => {
		event.preventDefault()

		console.log("submit")
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

	render() {
		const codeMirrorConfig = {
			theme: "material",
			lineNumbers: true,
			lineWrapping: true
		}
		
		return (
			<div className="App">
				{this.state.roomId ? <h1>{this.state.roomId}</h1> : <h1>hello</h1>}
				<CodeMirror 
					value={this.state.textModel}
					options={codeMirrorConfig}
					onBeforeChange={this.handleBeforeTextModelChange}
					onChange={this.handleTextModelChange}
					editorDidMount={this.getEditor}
				/>

			<form onSubmit={this.handleFormSubmit}>
				<label>
					Enter room code to join:  
					<input 
						type="text" 
						name="roomToJoin" 
						value={this.state.roomToJoin}
						onChange={this.handleFormChange}
					/>
				</label>
				<button>Swap</button>
			</form>
	    	</div>
	  	);
	}
}

export default App;
