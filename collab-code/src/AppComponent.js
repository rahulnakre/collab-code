import React from "react";
import { Controlled as CodeMirror } from 'react-codemirror2';
import EditorComponent from "./Editor/EditorComponent";
import Navbar from "./Navigation/Navbar";
import "./App.css"

function AppComponent(props) {
	//console.log(props)
	return(
		<div>
				<Navbar />
				<div className="App">
					{props.roomId ? <h1>{props.roomId}</h1> : <h1>hello</h1>}
				</div>
				<EditorComponent 
					textModel={props.textModel}
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