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
		receivedFromPeer: false
	}

	componentDidMount() {
		const socket = socketIOClient(this.state.endpoint)
		this.setState({
			socket: socket
		})
		socket.on(SENT_FROM_SERVER, (data) => { // for periodic pings
			var arr = data.split(" ")
			console.log(arr[arr.length-1])
		})
		socket.on(PEER_MESSAGE, data => { // when peer sends a message
			console.log(data)
			// we got peer's recently typed text and its abs pos
			// so let's place that change locally
			// TODO: upgrade from naive abs pos way to crdt
			this.setState({
				receivedFromPeer: true
			})
			this.addPeerTextAtAbsPos(data.text, data.absPos.line, data.absPos.ch)

		})
		socket.on(SERVER_BROADCASTS, data => {
			console.log(data)
		});
		//console.log(this.state.textModel)
	}

	componentDidUpdate() { 
		console.log(this.editorInstance)
		//this.state.socket.emit("sent-from-client", { data: this.state.textModel})
	}

	handleBeforeTextModelChange = (editor, data, value) => {
		this.setState({
			textModel: value 
		})
		//console.log(editor.getCursor())
		console.log(this.state.receivedFromPeer)
		if (!this.state.receivedFromPeer) {
		this.state.socket.emit(SENT_FROM_CLIENT, 
			{ 
				text: data.text,
				absPos: editor.getCursor()
			}
		)
		}
		this.setState({
			receivedFromPeer: false
		})
		//console.log(editor)
		console.log(data)
		//console.log(value)
		//this.state.socket.emit("sent-from-client", {data: this.state.textModel})
	}

	/*handleKeyPress = (editor, event, f) => {
		console.log(event)
		this.state.socket.emit(SENT_FROM_CLIENT, 
			{ 
				keyPressed: event.key,
				absPos: editor.getCursor()
			}
		)
	}*/

	addPeerTextAtAbsPos = (peerText, line, ch) => {
		/* The text the peer sent will be added locally at the same absolute position
		   as the peer.
		*/
		//console.log(this.editorInstance.getRange({line, ch}))
		//console.log("here")
		console.log(peerText)
		console.log(line)
		console.log(ch)
		this.editorInstance.replaceRange(peerText, {line: line, ch: ch})
	}

	getEditor = editor => {
		this.editorInstance = editor
	}
	
	render() {
		const codeMirrorConfig = {
			theme: "material",
			lineNumbers: true,
			lineWrapping: true
		}
		
		return (
			<div className="App">
				<h1>hello</h1>
				<CodeMirror 
					value={this.state.textModel}
					options={codeMirrorConfig}
					onBeforeChange={this.handleBeforeTextModelChange}
					onChange={this.handleTextModelChange}
					editorDidMount={this.getEditor}
				/>
	    	</div>
	  	);
	}
}

export default App;
