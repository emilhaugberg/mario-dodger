var R = require('ramda')

var dr = require('./game/draw')
var cs = require('./game/config')

var config = cs.config
var state = cs.state

var canMoveRight = (x) => x < config.canvas.width
var canMoveLeft =  (x) => x > 0

var keyCodeToDirection = R.cond([
  [ R.equals(config.keyCodes.left),  R.always(config.directions.left)     ],
  [ R.equals(config.keyCodes.right), R.always(config.directions.right)    ],
  [ R.T,                             R.always(config.directions.standing) ],
])

var updateState = R.assocPath

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

  collisionDetection(state.mario, state.goombas)
  state.goombas = dr.updateGoombas(state)
  dr.draw(ctx, state)()
  moveMario()()
  updateScore()()

  if (collisionDetection(state.mario, state.goombas)) {
    clearInterval(game)
  }
}

var collisionDetection = (mario, goombas) => {
  // console.log(mario.x + ' ' + mario.y)
  var collided = (goomba) => {
    return (
         goomba.x >= mario.x
      && goomba.x + goomba.width <= mario.x + config.mario.width
      && goomba.y >= mario.y
      && goomba.y + goomba.height <= mario.y + config.mario.height
    )
  }

  return R.compose(R.any(R.equals(true)), R.map(collided))(goombas)
}

window.collisionDetection = collisionDetection
window.R = R

var canvas = document.getElementById('game')
var ctx = canvas.getContext('2d')

document.onkeydown = keyDownHandler
document.onkeyup = keyUpHandler

var audio = new Audio('/assets/audio/mario.mp3')
audio.play()

var game = setInterval(() => main(), 10)
