//import Char from "./char"

// temp - until i fix the unexpected identifier bug
class Char {
	constructor(value, siteID, position) {
		this.value = value
		this.siteID = siteID
		this.position = position 
	}
}

class CRDT {
	constructor(siteID) {
		/* args: siteID is a unique identifier for each site
		*/
		this.siteID = siteID
		this.charArray = []
		//this.text = ""
	}



	localInsert(val, siteId, type, from, to) {
		/* char is a Char object
		   ind is a numerical index
		*/
		// Todo: DO I USE FROM OR TO??
		
		var char = new Char(val, siteId, from)
		console.log("local insert...")
		console.log
		this.insertToCharArray(char)
		//this.insertToText()
	}

	insertToCharArray(char) {
		this.charArray.push(char)
		console.log(this.charArray)
	}

	findPreviousPos(currentPos) {
		
	}

	findNextPos(currentPos)

	insertToText() {
		//
	}

	
	
}

module.exports = CRDT;