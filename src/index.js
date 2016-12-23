var R = require('ramda')

var Config = require('./game/config')
var Game = require('./game/game')
var Draw = require('./game/draw')

var initialState = Config.initialState
var state = R.clone(initialState)

var updateState = (propPath, value, oldState) => {
  var newState = R.assocPath(propPath, value, oldState)

  return () => {
    state = newState
  }
}

var stop = () => clearInterval(game)

var updateMario = (state) => () => {
  var mario = state.mario
  var moveR = state.keysPressed.right && Game.canMoveRight(mario.x + Config.mario.width)
  var moveL = state.keysPressed.left && Game.canMoveLeft(mario.x > 0)

  if (moveR) {
    var newMarioPos = state.mario.x + Config.mario.speed
    updateState(['mario', 'x'], newMarioPos, state)()
  }
  else if (moveL) {
    var newMarioPos = state.mario.x - Config.mario.speed
    updateState(['mario', 'x'], newMarioPos, state)()
  }
}

var updateGoombas = (oldState) => {
  var newGoombas = Game.updateGoombas(oldState)

  return () => updateState(['goombas'], newGoombas, oldState)()
}

var updateScore = (oldState) => {
  var score = Game.shouldScoreUpdate(oldState.frames)
            ? state.score + 1
            : state.score

  return () => updateState(['score'], score, oldState)()
}

var updateFrames = (oldState) => {
  var newFrames = oldState.frames + 1
  return () => updateState(['frames'], newFrames, oldState)()
}

var detectCollition = (state, ctx) => () => {
  var thereIsCollision = Game.marioCollided(state.mario, state.goombas)
  if (thereIsCollision) {
    stop()
    Draw.gameOver(ctx)()
  }
}

var draw = (ctx, state) => {
  return () => {
    Draw.clear(ctx, Config.canvas)()
    Draw.draw(ctx, state)()
  }
}

var keyDownHandler = (e) => {
  state = Game.updatePressedKeys(
    Game.keyCodeToDirection(e.keyCode),
    true,
    state
  )
}

var keyUpHandler = (e) => {
  state = Game.updatePressedKeys(
    Game.keyCodeToDirection(e.keyCode),
    false,
    state
  )
}

document.onkeydown = keyDownHandler
document.onkeyup = keyUpHandler

var canvas = document.getElementById('game')
var ctx = canvas.getContext('2d')

// main game loop
var main = () => {
  draw(ctx, state)()
  updateGoombas(state)()
  updateMario(state)()
  updateScore(state)()
  updateFrames(state)()
  detectCollition(state, ctx)()
}

var game = setInterval(main, 10)

// var audio = new Audio('/assets/audio/mario.mp3')
// audio.play()
