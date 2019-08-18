const initState = {
	value: "",
	options: {}
}

const editorReducer = (state = initState, action) => {
	if (action.type === "CHANGE_CONFIG") {
		return {
			...state,
			options: action.config
		}
	}

	return state
}

export default editorReducer