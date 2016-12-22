var $ = require('jquery')
var R = require('ramda')

var draw = require('./game/draw')
console.log('DRAW: ', draw)
var cs = require('./game/config')
var config = cs.config
var state = cs.state

var keyDownHandler = (e) => {
  if (e.keyCode == config.keyCodes.right) {
    state.mario.direction = config.directions.right
    state.keysPressed.right = true
  }
  else if (e.keyCode == config.keyCodes.left && state.mario.x > 0) {
    state.mario.direction = config.directions.left
    state.keysPressed.left = true
  }
}

var keyUpHandler = (e) => {
  if (e.keyCode == config.keyCodes.right) {
    state.keysPressed.right = false
    state.mario.direction = config.directions.right
  }
  else if (e.keyCode == config.keyCodes.left) {
    state.keysPressed.left = false
    state.mario.direction = config.directions.left
  }
}

var main = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (state.frames % 20 == 0) draw.addgoomba()

  draw.drawMario(ctx, state.mario)
  draw.drawgoombas(ctx)
  draw.movegoombas(ctx)
  draw.filtergoombas(ctx)
  draw.drawScore(ctx)
  draw.drawLifes(ctx)

  if (state.keysPressed.right && state.mario.x + config.mario.width < config.canvas.width) {
    state.mario.x += config.mario.speed
  }
  else if (state.keysPressed.left && state.mario.x > 0) {
    state.mario.x -= config.mario.speed
  }

  state.frames += 1

  if (state.frames % 100 == 0) state.score += 1
}

var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

$(document).keydown(keyDownHandler)
$(document).keyup(keyUpHandler)

var interval = setInterval(() => main(), 10)
