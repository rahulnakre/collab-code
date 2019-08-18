import React from "react";
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
//import 'codemirror/theme/idea.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';
import EditorComponent from "./Editor/EditorComponent"

function AppComponent(props) {
	//console.log(props)

	return(
		<div className="App">
				{props.roomId ? <h1>{props.roomId}</h1> : <h1>hello</h1>}
				<EditorComponent 
					textModel={props.textModel}
					codeMirrorConfig={props.codeMirrorConfig}
					handleBeforeTextModelChange={props.handleBeforeTextModelChange}
					handleTextModelChange={props.handleTextModelChange}
					getEditor={props.getEditor}
				/>

			<form onSubmit={props.handleFormSubmit}>
				<label>
					Enter room code to join:  
					<input 
						type="text" 
						name="roomToJoin" 
						value={props.roomToJoin}
						onChange={props.handleFormChange}
					/>
				</label>
				{props.invalidRoomMsg ? <h3>Invalid Room</h3> : null}
				<button>Swap</button>
			</form>
    	</div>
	)
}


export default AppComponent