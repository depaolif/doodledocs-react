import { drawImage } from './drawing'

export function keyDownEventListener(event) {
  if (this.props.slider.value === this.state.history.length && event.target.nodeName !== 'INPUT') {
    if (this.props.doodle.tool !== 'text') {
      this.setState({ isDrawingText: false })
      if (event.keyCode === 90 && event.ctrlKey &&
        !this.state.isPainting && this.state.history.length > 0) {
        // undoing
        let tempNewRedoHistory = this.state.redoHistory
        tempNewRedoHistory.push(this.state.history[this.state.history.length-1])
        this.setState({ redoHistory: tempNewRedoHistory })
        let tempNewHistory = this.state.history.slice(0, -1)
        this.setState({ history: tempNewHistory })
        drawImage(this.context, tempNewHistory)
    } else if (event.keyCode === 82 && event.ctrlKey &&
      !this.state.isPainting && this.state.redoHistory.length > 0) {
        // redoing
        let tempNewHistory = this.state.history
        tempNewHistory.push(this.state.redoHistory[this.state.redoHistory.length-1])
        this.setState({ history: tempNewHistory })
        let tempNewRedoHistory = this.state.redoHistory.slice(0, -1)
        this.setState({ redoHistory: tempNewRedoHistory })
        drawImage(this.context, tempNewHistory)
    }
    this.props.setSliderValue(this.state.history.length)
    } else if (this.props.doodle.tool === 'text' && this.state.isDrawingText) {
      let tempNewHistory = this.state.history
      if (event.keyCode === 8 && tempNewHistory[tempNewHistory.length-1].text.text.length > 0) {
        tempNewHistory[tempNewHistory.length-1].text.text = tempNewHistory[tempNewHistory.length-1].text.text.slice(0, -1)
        if (tempNewHistory[tempNewHistory.length-1].text.text.length === 0) {
          tempNewHistory.pop()
          this.setState({ isDrawingText: false })
          this.props.setTool('free')
        }
        this.setState({ history: tempNewHistory })
        drawImage(this.context, tempNewHistory)
      }
    }
  }
}

export function	renderHistory(value, sliding) {
		let tempHistory = this.state.history.slice(0, value)
		drawImage(this.context, tempHistory)
	}
