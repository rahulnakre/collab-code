//import Char from "./char"

// temp - until i fix the unexpected identifier bug
class Char {
	constructor(value, siteID, position, digit=null) {
		this.value = value
		this.siteID = siteID
		this.position = position 
		this.digit = digit
	}

	/*compare(char1, char2) {
		if char1.psoiti
	}*/

	createIdentifier(digit, siteID) {
		const obj = { digit, siteID }
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
		// Todo: DO I USE FROM OR TO?? or neither nvm
		//console.log(from)
		var char = new Char(val, siteId, from)
		console.log("local insert...")
		console.log("val: ", val)
		if (type === "+input" && val !== ['', '']) {
			this.insertToCharArray(char, from)
		}
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
		console.log(this.charArray[pos.line])
	}

	findPreviousPos(currentPos) {
		//var prev = this.charArray[]
		console.log("finding prev pos of...\n" + JSON.stringify(currentPos))
		// var prev = ""
		if (currentPos.ch === 0) {
			if (currentPos.line === 0) {
				return [] 
			} else {
				const lineLen = this.charArray[currentPos.line].length
				return this.charArray[currentPos.line-1][lineLen]
			}
		}
		return this.charArray[currentPos.line][currentPos.ch-1]


	}

	findNextPos(currentPos) {
		console.log("finding next pos...\n" + JSON.stringify(currentPos))
		const numLines = this.charArray.length
		const numCharsOnLine = (this.charArray[currentPos.line] && this.charArray[currentPos.line].length) + 1 || 0
		console.log("num lines: ", numLines)
		console.log("chars on line ", numCharsOnLine)
		if (currentPos.line === numLines - 1) {

		}
	}

	insertToText() {
		//
	}

	
	
}

module.exports = CRDT;