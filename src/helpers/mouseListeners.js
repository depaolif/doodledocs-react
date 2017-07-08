export function mouseDownEventListener(event) {
  if (event.button === 0 && this.props.slider.value === this.state.history.length) {
    this.setState({ redoHistory: [] })
    this.context.strokeStyle = this.props.doodle.color
    this.context.fillStyle = this.props.doodle.color
    this.context.lineWidth = this.props.doodle.lineWidth
    let mousePos = this.getMousePos(this.canvas, event)
    let tempNewHistory = null
    switch (this.props.doodle.tool) {
      case "free":
      this.context.beginPath() //begins path
      this.context.moveTo(mousePos.x, mousePos.y)
      tempNewHistory = this.state.history
      tempNewHistory.push({[this.props.doodle.tool]: {start: {x: mousePos.x, y: mousePos.y, color: this.props.doodle.color, lineWidth: this.context.lineWidth}, lines: []}})
      this.setState({ history: tempNewHistory})
      break
      case "line":
      this.context.beginPath()
      this.context.moveTo(mousePos.x, mousePos.y)
      tempNewHistory = this.state.history
      tempNewHistory.push({[this.props.doodle.tool]: {x1: mousePos.x, y1: mousePos.y, x2: 0, y2: 0, color: this.props.doodle.color, lineWidth: this.context.lineWidth}})
      this.setState({ history: tempNewHistory})
      break
      case "rectangle":
      this.context.beginPath()
      tempNewHistory = this.state.history
      tempNewHistory.push({[this.props.doodle.tool]: {x1: mousePos.x, y1: mousePos.y, x2: 0, y2: 0, color: this.props.doodle.color, lineWidth: this.context.lineWidth}})
      this.setState({ history: tempNewHistory})
      break
      case "circle":
      this.context.beginPath()
      tempNewHistory = this.state.history
      tempNewHistory.push({[this.props.doodle.tool]: {startX: mousePos.x, startY: mousePos.y, color: this.props.doodle.color, lineWidth: this.context.lineWidth, midX: null, midY: null, r: null}})
      this.setState({ history: tempNewHistory})
      break
      case "image":
      let image = new Image()
      image.src = this.props.doodle.imageSrc
      tempNewHistory = this.state.history
      if (image.complete) {
          this.context.drawImage(image, mousePos.x - image.width / 2, mousePos.y - image.height / 2)
          tempNewHistory.push({[this.props.doodle.tool]: {x: mousePos.x - image.width / 2, y: mousePos.y - image.height / 2, src: image.src}})
          this.setState({ history: tempNewHistory})
      } else {
          image.onload = () => {
              this.context.drawImage(image, mousePos.x - image.width / 2, mousePos.y - image.height / 2) 
              tempNewHistory.push({[this.props.doodle.tool]: {x: mousePos.x - image.width / 2, y: mousePos.y - image.height / 2, src: image.src}})
              this.setState({ history: tempNewHistory})
              this.props.setSliderValue(this.state.history.length)
          }
      }
      break
      case "text":
        tempNewHistory = this.state.history
        tempNewHistory.push({[this.props.doodle.tool]: {x: mousePos.x, y: mousePos.y, text: '', font: `${this.props.doodle.fontSize}px serif`, color: '#000'}})
        this.setState({ history: tempNewHistory, isDrawingText: true })
      break
      default:
      break
    }
    this.setState({
      isPainting: true
    })
    this.props.setSliderValue(this.state.history.length)
  }
}

export function mouseMoveEventListener(event) {
  if (this.state.isPainting && this.props.slider.value === this.state.history.length) {
    let mousePos = this.getMousePos(this.canvas, event)
    let tempNewHistory = null
    switch (this.props.doodle.tool) {
      case "free":
      this.context.lineTo(mousePos.x, mousePos.y)
      this.context.stroke() //path gets a stroke
      tempNewHistory = this.state.history
      tempNewHistory[tempNewHistory.length-1].free.lines.push({x: mousePos.x, y: mousePos.y})
      this.setState({ history: tempNewHistory })
      break
      case "rectangle":
      this.context.rect(this.state.history[this.state.history.length-1].rectangle.x1, this.state.history[this.state.history.length-1].rectangle.y1, mousePos.x - this.state.history[this.state.history.length-1].rectangle.x1, mousePos.y - this.state.history[this.state.history.length-1].rectangle.y1)
      this.context.fill()
      tempNewHistory = this.state.history
      tempNewHistory[tempNewHistory.length-1].rectangle.x2 = mousePos.x - tempNewHistory[tempNewHistory.length-1].rectangle.x1
      tempNewHistory[tempNewHistory.length-1].rectangle.y2 = mousePos.y - tempNewHistory[tempNewHistory.length-1].rectangle.y1
      this.setState({ history: tempNewHistory })
      break
      case "circle":
      let circleInfo = this.state.history[this.state.history.length-1].circle
      let dx = Math.abs(circleInfo.startX - mousePos.x)
      let dy = Math.abs(circleInfo.startY - mousePos.y)
      let midX = (circleInfo.startX + mousePos.x) / 2
      let midY = (circleInfo.startY + mousePos.y) / 2
      let r = Math.sqrt(dx * dx + dy * dy) / 2
      this.context.arc(midX, midY, r, 0, 2 * Math.PI)
      this.context.fillStyle = circleInfo.color
      this.context.lineWidth = circleInfo.lineWidth
      this.context.fill()

      tempNewHistory = this.state.history
      tempNewHistory[tempNewHistory.length-1].circle.midX = midX
      tempNewHistory[tempNewHistory.length-1].circle.midY = midY
      tempNewHistory[tempNewHistory.length-1].circle.r = r
      this.setState({ history: tempNewHistory })
      break
      default:
      break
    }
    this.setState({
      historyLength: this.state.history.length
    })
  }
}

export function mouseUpEventListener(event) {
  let mousePos = this.getMousePos(this.canvas, event)
  let tempNewHistory = null
  if (this.props.slider.value === this.state.history.length) {
    switch (this.props.doodle.tool) {
      case "line":
      this.context.lineTo(mousePos.x, mousePos.y)
      this.context.stroke()

      tempNewHistory = this.state.history
      tempNewHistory[tempNewHistory.length-1].line.x2 = mousePos.x
      tempNewHistory[tempNewHistory.length-1].line.y2 = mousePos.y
      this.setState({ history: tempNewHistory })
      this.setState({
        historyLength: this.state.history.length
      })
      this.props.setSliderValue(this.state.history.length)
      break
      case "free":
      if (this.state.history[this.state.history.length-1].free.lines.length === 0) {
        tempNewHistory = this.state.history
        tempNewHistory = tempNewHistory.slice(0, tempNewHistory.length-1)
        this.setState({ history: tempNewHistory })
        this.props.setSliderValue(this.state.history.length)
      }
      break
      default:
      break
    }
  }
  this.setState({ isPainting: false })
}

export function keyPressEventListener(event) {
  if (this.props.slider.value === this.state.history.length && this.state.isDrawingText && event.target.nodeName !== 'INPUT') {
    event.preventDefault()
    let tempNewHistory = this.state.history
    tempNewHistory[tempNewHistory.length-1].text.text += event.key
    this.context.font = tempNewHistory[tempNewHistory.length - 1].text.font
    this.context.fillText(tempNewHistory[tempNewHistory.length-1].text.text, tempNewHistory[tempNewHistory.length - 1].text.x, tempNewHistory[tempNewHistory.length - 1].text.y)
    this.setState({ history: tempNewHistory })
  }
}
