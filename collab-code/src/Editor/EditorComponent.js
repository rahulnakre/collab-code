import React from 'react';
import { connect } from "react-redux";
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
//import 'codemirror/theme/idea.css';
//import 'codemirror/mode/htmlmixed/htmlmixed';
//import 'codemirror/mode/css/css';
//import 'codemirror/mode/javascript/javascript';
import "../Editor.css"

class EditorComponent extends React.Component {
	render() {
		//console.log(this.props.config)
		//console.log(this.props.codeMirrorConfig)
		const styles = {
			style: { 	
				border: "red",
				borderWidth: "180"
			}
		}
		return(
			
			<div className="centered">
				<CodeMirror 
					value={this.props.textModel}
					options={this.props.config}
					onBeforeChange={this.props.handleBeforeTextModelChange}
					onChange={this.props.handleTextModelChange}
					editorDidMount={this.props.getEditor}
				/>
			</div>
		)

	}
}

const mapStateToProps = (state) => {
	//console.log(state.editorReducer.options)
	return {
		config: state.editorReducer.options
	}
}

export default connect(mapStateToProps)(EditorComponent)