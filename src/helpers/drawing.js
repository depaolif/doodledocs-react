export function drawImage(context, history) {
  context.clearRect(0, 0, 1500, 1500)
  for (let i = 0; i < history.length; i++) {
    switch (Object.keys(history[i])[0]) {
      case "free":
      drawFree(context, history[i])
      break
      case "rectangle":
      drawRect(context, history[i].rectangle)
      break
      case "circle":
      drawCircle(context, history[i].circle)
      break
      case "line":
      drawLine(context, history[i].line)
      break
      case "image":
      let image = new Image()
      image.src = history[i].image.src
      if (image.complete) {
          context.drawImage(image, history[i].image.x, history[i].image.y)
      } else {
          image.onload = () => {
              context.drawImage(image, history[i].image.x, history[i].image.y)
          }
      }
      break
      case "text":
        context.fillStyle = history[i].text.color
        context.font = history[i].text.font
        context.fillText(history[i].text.text, history[i].text.x, history[i].text.y)
      break
      default:
      break
    }
  }
}

export function drawFree(context, picture, undo) {
  context.beginPath()
  context.moveTo(picture.free.start.x, picture.free.start.y)
  context.strokeStyle = picture.free.start.color
  context.lineWidth = picture.free.start.lineWidth
  for (let j = 0; j < picture.free.lines.length; j++) {
    context.lineTo(picture.free.lines[j].x, picture.free.lines[j].y)
    context.stroke()
  }
}

export function drawRect(context, rect) {
  context.beginPath()
  context.fillStyle = rect.color
  context.rect(rect.x1, rect.y1, rect.x2, rect.y2)
  context.fill()
}

export function drawCircle(context, circle) {
  context.beginPath()
  context.arc(circle.midX, circle.midY, circle.r, 0, 2 * Math.PI)
  context.fillStyle = circle.color
  context.lineWidth = circle.lineWidth
  context.fill()
}

export function drawLine(context, line) {
  context.beginPath()
  context.moveTo(line.x1, line.y1)
  context.strokeStyle = line.color
  context.lineWidth = line.lineWidth
  context.lineTo(line.x2, line.y2)
  context.stroke()
}
