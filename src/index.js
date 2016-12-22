var $ = require('jquery')
var R = require('ramda')

var dr = require('./game/draw')
var cs = require('./game/config')

var config = cs.config
var state = cs.state

var canMoveRight = (x) => x < config.canvas.width
var canMoveLeft =  (x) => x > 0

var updateState = R.assocPath

var keyCodeToDirection = R.cond([
  [ R.equals(config.keyCodes.left),  R.always(config.directions.left)     ],
  [ R.equals(config.keyCodes.right), R.always(config.directions.right)    ],
  [ R.T,                             R.always(config.directions.standing) ],
])

var updateDirection = (direction, moving, state) => {
  return R.compose(
    updateState(['mario', 'direction'], direction),
    updateState(['keysPressed', direction], moving)
  )(state)
}

var keyDownHandler = (e) => {
  state = updateDirection(keyCodeToDirection(e.keyCode), true, state)
}

var keyUpHandler = (e) => {
  state = updateDirection(keyCodeToDirection(e.keyCode), false, state)
}

var draw = (ctx, state) => {
  return () => {
    dr.drawMario(ctx, state)()
    dr.drawgoombas(ctx, state)()

    dr.drawScore(ctx, state)()
    dr.drawLifes(ctx, state)()
    dr.drawLifeText(ctx)()
  }
}

var updateGoombas = (state) => {
  return R.compose(
    dr.addgoomba(state),
    dr.movegoombas,
    dr.filtergoombas,
    R.prop('goombas')
  )(state)
}

var moveMario = () => () => {
  var mario = state.mario
  if (state.keysPressed.right && canMoveRight(mario.x + config.mario.width)) {
    state.mario.x += config.mario.speed
  }
  else if (state.keysPressed.left && canMoveLeft(mario.x > 0)) {
    state.mario.x -= config.mario.speed
  }
}

var updateScore = () => () => {
  if (state.frames % 100 == 0) state.score += 1
  state.frames += 1
}

// main game loop
var main = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  updateScore()()
  state.goombas = updateGoombas(state)
  moveMario()()
  draw(ctx, state)()
}

var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

$(document).keydown(keyDownHandler)
$(document).keyup(keyUpHandler)

var interval = setInterval(() => main(), 10)
