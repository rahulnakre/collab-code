import React from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
import $ from "jquery";
// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
//import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg';

class App extends React.Component {

	state = {
		textModel: "",
		endpoint: "http://127.0.0.1:4001",
		response: "",
		socket: null,
		froalaInstance: null
	}

	componentDidMount() {
        //$.FroalaEditor.css("background", "yellow");

		const socket = socketIOClient(this.state.endpoint)
		this.setState({
			socket: socket
		})
		socket.on("sent-from-server", (data) => {
			console.log(data)
			var arr = data.split(" ")
			console.log(arr[arr.length-1])
			//socket.emit("sent-from-client", {data: this.state.textModel})

		})
		socket.on("peer-message", data => {
			console.log(data)
		})
		socket.on("broadcast", data => {
			console.log(data)
		});
		console.log(this.state.textModel)
		//const editor = new FroalaEditor({}, {})
		//console.log(editor)
	}


	handleModelChange = (model) => {
		//model = "hello"
		this.setState({
			textModel: model 
		})
		console.log(model)
		//console.log(JSON.parse({data: this.state.textModel }))
		//const socket = socketIOClient(this.state.endpoint)
		this.state.socket.emit("sent-from-client", {data: this.state.textModel})
		console.log(this.state.froalaInstance)
		/*socket.on("connect", () => {
			socket.emit("sent-from-client", {data: this.state.textModel})
		})*/
		//socket.broadcast.emit('peer-message', "got a peer message");

	}
	
	render() {
		return (
			<div className="App">
				<FroalaEditor 
					tag='textarea'
					model={this.state.textModel}
					onModelChange={this.handleModelChange}
					config={{
						placeholderText: "Type your text here!",
						events : {
        					initialized: (e, editor) => {
        						console.log(editor)
        						/*this.setState({
        							froalaInstance: this
        						})*/
        						//console.log(this.froalaInstance)
        						//console.log(this)
								/*var elements = document.getElementsByClassName('foo');
								for (var i=0; i< elements.length ; i++) {
									elements[i].addEventListener('mouseover', function () {
										console.log ('foo')
	           						}, true);
	        					}*/
        					}
      					}
						//immediateReactModelUpdate: true
					}}
				/>
	    	</div>
	  	);
	}
}

export default App;
