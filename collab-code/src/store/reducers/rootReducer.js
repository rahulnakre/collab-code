import { combineReducers } from "redux";
import editorReducer from "./editorReducer"
const initState = {}

const rootReducer = combineReducers({
	editorReducer: editorReducer
})


export default rootReducer