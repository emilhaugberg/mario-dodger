var $ = require('jquery')
var R = require('ramda')

var dimensions = {
  width: 600,
  height: 600
}

var state = {
  enemies: [],
  keypresses: {
    left: false,
    right: false,
    up: false,
    down: false
  },
  player: {
    x: dimensions.width / 2,
    y: dimensions.height / 2,
    r: 20
  }
}

var SPEED = 5

var keyDownHandler = (e) => {

    if (e.keyCode === 37) {
      state.keypresses.left = true
    }
    else if (e.keyCode === 39) {
      state.keypresses.right = true
    }
    else if (e.keyCode === 38) {
      state.keypresses.up = true
    }
    else if (e.keyCode === 40) {
      state.keypresses.down = true
    }
}

var keyUpHandler = (e) => {
  if (e.keyCode === 37) {
    state.keypresses.left = false
  }
  else if (e.keyCode === 39) {
    state.keypresses.right = false
  }
  else if (e.keyCode === 38) {
    state.keypresses.up = false
  }
  else if (e.keyCode === 40) {
    state.keypresses.down = false
  }
}

var drawPlayer = (ctx) => {
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

var draw = (canvas, ctx) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPlayer(ctx)

  if (state.keypresses.left) {
    state.player.x -= SPEED
  }

  if (state.keypresses.right) {
    state.player.x += SPEED
  }

  if (state.keypresses.up) {
    state.player.y -= SPEED
  }

  if (state.keypresses.down) {
    state.player.y += SPEED
  }
}

var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

$(document).keydown(keyDownHandler)
$(document).keyup(keyUpHandler)

setInterval(() => draw(canvas, ctx), 10)
