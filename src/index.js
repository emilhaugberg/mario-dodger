var $ = require('jquery')
var R = require('ramda')

var frames  = 0
var seconds = 0

var dimensions = {
  width: 1000,
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
  },
  balls: []
}

var SPEED = 5
var BALLSPEED = 3

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

var drawPlayer = () => {
  ctx.beginPath()
  ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2, false)
  ctx.fillStyle = "red"
  ctx.fill()
  ctx.closePath()
}

var movePlayer = () => {
  if (state.keypresses.left) {
    if (state.player.x > state.player.r) {
      state.player.x -= SPEED
    }
  }

  if (state.keypresses.right) {
    if (state.player.x < (dimensions.width - state.player.r)) {
      state.player.x += SPEED
    }
  }

  if (state.keypresses.up) {
    if (state.player.y > state.player.r) {
      state.player.y -= SPEED
    }
  }

  if (state.keypresses.down) {
    if (state.player.y < (dimensions.height - state.player.r)) {
      state.player.y += SPEED
    }
  }
}

var random = (min, max) => Math.random() * (max - min) + min

var addBall = () => {
  var randomR = Math.floor(random(10, 20))
  var ball = {
    x: Math.floor(random(randomR, dimensions.width - randomR)),
    y: 0,
    r: randomR
  }

  state.balls = R.append(ball, state.balls)
}

var drawBall = () => {
  R.forEach((ball) => {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, false)
    ctx.fillStyle = "blue"
    ctx.fill()
    ctx.closePath()
  }, state.balls)
}

var moveBalls = () => {
  state.balls = R.map((ball) => {
    return { x: ball.x, y: ball.y += BALLSPEED, r: ball.r }
  }, state.balls)
}

var removeObsoleteBalls = () => {
  state.balls = R.reject((ball) => {
    return (ball.y > dimensions.height - ball.r)
  }, state.balls)
}

var draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPlayer()
  movePlayer()

  frames += 1
  if (frames % 100 == 0) seconds += 1
  if (frames % 20 == 0) addBall()

  moveBalls()
  drawBall()
  removeObsoleteBalls()

  console.log(R.length(state.balls))

  $('#seconds').html(seconds)
}

var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

$(document).keydown(keyDownHandler)
$(document).keyup(keyUpHandler)

setInterval(() => draw(), 10)
