var R = require('ramda')

var Config = require('./game/config')
var Game = require('./game/game')
var Draw = require('./game/draw')

var initialState = Config.initialState
var state = R.clone(initialState)

var moveMario = () => () => {
  var mario = state.mario
  var moveR = state.keysPressed.right && Game.canMoveRight(mario.x + Config.mario.width)
  var moveL = state.keysPressed.left && Game.canMoveLeft(mario.x > 0)

  if (moveR) {
    state.mario.x += Config.mario.speed
  }
  else if (moveL) {
    state.mario.x -= Config.mario.speed
  }
}

var updateScore = () => () => {
  if (state.frames % 100 == 0) state.score += 1
  state.frames += 1
}

var keyDownHandler = (e) => {
  state = Game.updateDirection(
    Game.keyCodeToDirection(e.keyCode),
    true,
    state
  )
}

var keyUpHandler = (e) => {
  state = Game.updateDirection(
    Game.keyCodeToDirection(e.keyCode),
    false,
    state
  )
}


// main game loop
var main = () => {
  Draw.clear(ctx, Config.canvas)()
  state.goombas = Game.updateGoombas(state)
  Draw.draw(ctx, state)()
  moveMario()()
  updateScore()()

  // dr.gameOver(ctx, config.canvas, state)
  // collisionDetection(state.mario, state.goombas)
  // detectCollition()
}

var canvas = document.getElementById('game')
var ctx = canvas.getContext('2d')

document.onkeydown = keyDownHandler
document.onkeyup = keyUpHandler

var game = setInterval(() => main(), 10)

// var audio = new Audio('/assets/audio/mario.mp3')
// audio.play()

// var removeLife = () => {
//   var lifes = R.length(state.lifes) - 1
//
//   if (lifes >= 0) {
//     var newLifes = R.compose(R.head, R.splitAt(lifes))(state.lifes)
//     state.lifes = newLifes
//     // clearInterval(game)
//     // game = setInterval(() => main(), 10)
//   } else {
//     state.lifes = []
//   }
// }
//
// var detectCollition = () => {
//   if (collisionDetection(state.mario, state.goombas)) {
//     removeLife()
//   }
// }

// var collisionDetection = (mario, goombas) => {
//   var collided = (goomba) => {
//     return (
//          goomba.x >= mario.x
//       && goomba.x + goomba.width <= mario.x + config.mario.width
//       && goomba.y >= mario.y
//       && goomba.y + goomba.height <= mario.y + config.mario.height
//     )
//   }
//
//   return R.compose(R.any(R.equals(true)), R.map(collided))(goombas)
// }
