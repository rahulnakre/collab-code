export default handleFormSubmit = (event) => {
	event.preventDefault()

	console.log("submit")
	this.state.socket.emit(SWITCH_ROOM, {
		currentRoom: this.state.roomId,
		nextRoom: this.state.roomToJoin
	})
}

export default handleFormChange = (event) => {
	const {name, value} = event.target
	this.setState({
		[name]: value
	})
}

export default handleBeforeTextModelChange = (editor, data, value) => {
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