//import Char from "./char"
const Identifier = require("./Identifier").Identifier
const Char = require("./Char").Char
//import Identifier from ".Identifier"

class CRDT {
	constructor(siteId) {
		/* args: siteID is a unique identifier for each site
		*/
		this.base = 64
		this.siteId = siteId
		this.charArray = []
		this.currLine = -1
		this.levelStrategy = []
		//this.strategy = "plus"
		this.boundary = 5
		// the 2 special chars that start and end the document
		this.firstCharId = new Identifier(0, siteId)
		this.lastCharId = new Identifier()
		//this.text = ""
	}


	localInsert(val, siteId, type, from, to) {
		/* char is a Char object
		   ind is a numerical index
		*/
		// Todo: DO I USE FROM OR TO?? or neither nvm
		//console.log(from)
		var char = new Char(val[0], siteId, from, null)

		console.log("local insert...")
		console.log("val: ", val)
		if (val.length == 2 && val[0] == "" && val[1] == "") { 
			char = new Char("\n", siteId, from)
			// only time we have to possibly remove a newline is when we're adding one
		}

		if (type === "+input") {
			this.insertToCharArray(char, from)
		}
		console.log(this.charArray)
		//this.insertToText()
	}

	remoteInsert(char) {
		const pos = findRemoteInsertPos(char)
	}

	findRemoteInsertPos(char) {
		//
	}

	insertToCharArray(char, pos) {
		if(this.currLine !== pos.line) {
			console.log("new line")
			this.charArray.push([])
			this.currLine = pos.line 
		}

		var prevPos = this.findPreviousPos(pos)
		console.log("prev pos... " + JSON.stringify(prevPos))
		var nextPos = this.findNextPos(pos)
		console.log("next pos... " + JSON.stringify(nextPos))

		var betweenPos = this.generatePosBetween(prevPos, nextPos)
		//this.charArray[pos.line].push(char)
		
		this.charArray[pos.line].splice(pos.ch, 0, char)
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
				return this.charArray[currentPos.line-1][lineLen].position
			}
		}
		return this.charArray[currentPos.line][currentPos.ch-1].position
	}

	generatePosBetween(prevPos, nextPos, level=0, newPos=[]) {
		var base = this.base * 2
		var prevId = prevPos.identifiers || new Identifier(0, this.siteId)
		var nextId = nextPos.identifiers || new Identifier(base, this.siteId)
		var strategy = this.randomStrategyGenerator(level)
		
		if (nextId.digit - prevId.digit > 1) { // there's space for an id at this level
			this.generateDigitIdBetween(prevPos, [], strategy)
			return []
		}

		if (nextId.digit - prevId.digit === 1) { // new level has to be made
			newPos.push(prevPos)
			return this.generatePosBetween(prevPos)
		}

		if (prevId.digit === nextId.digit) {
			if(prevId.siteId === nextId.siteId) {
				// generate id between the 2
			} else {
				// generate id from prevId + some boundary right
			}
		}

	}

	generateDigitIdBetween(prevId, nextId, strategy) {
		if(nextId - prevId < this.boundary) { 
			prevId += 1
		}

		if (strategy === "+") { // closer to prevId
		 	prevId += 1
		 	nextId -= this.boundary
		} else { // closer to nextId
			prevId += 1
			nextId = prevId + this.boundary
		}

		return Math.floor(Math.random() * (nextId - prevId) + prevId)
	}

	findNextPos(currentPos) {
		console.log("finding next pos...\n" + JSON.stringify(currentPos))
		const numLines = this.charArray.length
		const numCharsOnLine = (this.charArray[currentPos.line] && this.charArray[currentPos.line].length) + 1 || 0
		//console.log("num lines: ", numLines)
		console.log("chars on line ", numCharsOnLine)
		// last line, shoould it be last char?
		if (currentPos.line === numLines - 1 && currentPos.ch === numCharsOnLine - 1) { 
			//console.log("last")
			return []
		} else { // if n
			return this.charArray[currentPos.line][currentPos.ch].position
		}
	}

	randomStrategyGenerator(level) {
		console.log(this.levelStrategy)
		/*if (this.levelStrategy.length > level && this.levelStrategy[level]) {
			return this.levelStrategy[level]
		}*/
		
		if (Math.random() >= 0.5) {
			return "+"
		} 
		return "-"
	}

	insertToText() {
		//
	}	
	
}

module.exports = CRDT;