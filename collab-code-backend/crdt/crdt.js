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
		var char = new Char(val[0], siteId, from)
		this.checkIfCurrCharIsAfterNewline(from.line, from.ch)

		console.log("local insert...")
		console.log("val: ", val)
		if (val.length == 2 && val[0] == "" && val[1] == "") { 
			char = new Char("\n", siteId, from)
			// only time we have to possibly remove a newline is when we're adding one
			this.removeNewLine(from.line)
		}

		if (type === "+input") {
			this.insertToCharArray(char, from)
		}
		console.log(this.charArray)
		//this.insertToText()
	}

	insertToCharArray(char, pos) {
		if(this.currLine !== pos.line) {
			console.log("new line")
			this.charArray.push([])
			this.currLine = pos.line 
		}

		var prevPos = this.findPreviousPos(pos)
		// console.log("prev pos... " + JSON.stringify(prevPos))
		var nextPos = this.findNextPos(pos)
		console.log("next pos... " + JSON.stringify(nextPos))


		//this.charArray[pos.line].push(char)
		this.charArray[pos.line].splice(pos.ch ,0, char)
		//console.log(this.charArray[pos.line])
	}

	findPreviousPos(currentPos) {
		//var prev = this.charArray[]
		// console.log("finding prev pos of...\n" + JSON.stringify(currentPos))
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
		//console.log("num lines: ", numLines)
		console.log("chars on line ", numCharsOnLine)
		if (currentPos.line === numLines - 1) { // last line
			console.log("last")
			return []
		} else {

		}
	}

	insertToText() {
		//
	}

	checkIfCurrCharIsAfterNewline(line, ch) {

	}

	removeNewLine(line) {
		/* checks if newline exists in a given line, and if it does,
			it is removed	
		*/
		// console.log("check this line to remove newline: ", line)

	}
	
	
}

module.exports = CRDT;