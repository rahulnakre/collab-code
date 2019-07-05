import React from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';

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
	}

	componentDidMount() {
		const socket = socketIOClient(this.state.endpoint)
		this.setState({
			socket: socket
		})
		socket.on("sent-from-server", (data) => {
			console.log(data)
			var arr = data.split(" ")
			console.log(arr[arr.length-1])
		})
		socket.on("peer-message", data => {
			console.log(data)
			// we got peer's recently typed text and its abs pos
			// so let's place that change locally
			// TODO: upgrade from naive abs pos way to crdt

		})
		socket.on("broadcast", data => {
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
		console.log(editor.getCursor())
		this.state.socket.emit("sent-from-client", 
			{ 
				textModel: this.state.textModel,
				absPos: editor.getCursor()
			}
		)
		//console.log(editor)
		//console.log(data)
		//console.log(value)
		//this.state.socket.emit("sent-from-client", {data: this.state.textModel})
	}

	handleTextModelChange = (editor, data, value) => {
		//console.log(editor)
		//console.log(data)
		//console.log(value)
	}

	handleCursorActivity = (editor) => {
		//console.log(editor)
		//console.log("yess")
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
					onCursorActivity={this.handleCursorActivity}
				/>
	    	</div>
	  	);
	}
}

export default App;
