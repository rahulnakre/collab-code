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
		this.currLine = -1
		//this.text = ""
	}


	localInsert(val, siteId, type, from, to) {
		/* char is a Char object
		   ind is a numerical index
		*/
		// Todo: DO I USE FROM OR TO??
		//console.log(from)
		var char = new Char(val, siteId, from)
		console.log("local insert...")
		this.insertToCharArray(char, from)
		//this.insertToText()
	}

	insertToCharArray(char, pos) {
		if(this.currLine !== pos.line) {
			console.log("new line")
			this.charArray.push([])
			this.currLine = pos.line 
		}

		this.findPreviousPos(pos)
		this.findNextPos(pos)

		this.charArray[pos.line].push(char)
		console.log(this.charArray)
	}

	findPreviousPos(currentPos) {
		//var prev = this.charArray[]
		console.log("finding prev pos of...\n" + JSON.stringify(currentPos))
		console.log()


	}

	findNextPos(currentPos) {
		console.log("finding next pos...\n" + JSON.stringify(currentPos))
	}

	insertToText() {
		//
	}

	
	
}

module.exports = CRDT;