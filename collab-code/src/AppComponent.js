import React from "react";
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/javascript/javascript';

function AppComponent(props) {
	return(
		<div className="App">
				{props.roomId ? <h1>{props.roomId}</h1> : <h1>hello</h1>}
				<CodeMirror 
					value={props.textModel}
					options={props.codeMirrorConfig}
					onBeforeChange={props.handleBeforeTextModelChange}
					onChange={props.handleTextModelChange}
					editorDidMount={props.getEditor}
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
				<button>Swap</button>
			</form>
    	</div>
	)
}


export default AppComponent