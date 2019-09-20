class Editor {
	constructor(codemirrorInstance) {
		this.codemirrorInstance = codemirrorInstance
	}

	mergeWithPeerTextAtAbsPos = (peerText, from, to) => {
		/* The text the peer sent will be added locally at the same absolute position
		   as the peer.
		*/
		const fromLine = from.line
		const fromCh = from.ch
		const toLine = to.line
		const toCh = to.ch
		// this.editorWrapper.codemirrorInstance.replaceRange(peerText, {line: fromLine, ch: fromCh}, {line: toLine, ch: toCh})
		this.codemirrorInstance.replaceRange(peerText, {line: fromLine, ch: fromCh}, {line: toLine, ch: toCh})

	}

}

export default Editor