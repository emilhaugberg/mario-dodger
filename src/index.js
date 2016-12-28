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

var restart = () => {
  state = initialState
  game = setInterval(main, 10)
}

var updateMario = (state) => () => {
  var mario = state.mario
  var moveR = state.keysPressed.right && Game.canMoveRight(mario.x + mario.width)
  var moveL = state.keysPressed.left && Game.canMoveLeft(mario.x > 0)
  var newMarioPos = moveR
                  ? state.mario.x + mario.speed
                  : moveL ? state.mario.x - mario.speed
                  : state.mario.x

  updateState(['mario', 'x'], newMarioPos, state)()
}

var updateGoombas = (oldState) => {
  var newGoombas = Game.updateGoombas(oldState)

  return () => updateState(['goombas'], newGoombas, oldState)()
}

var updateScore = (oldState) => {
  var score = R.add(1, oldState.score)

  return () => updateState(['score'], score, oldState)()
}

var updateFrames = (oldState) => {
  var newFrames = oldState.frames + 1
  return () => updateState(['frames'], newFrames, oldState)()
}

var detectCollision = (state, ctx) => () => {
  var thereIsCollision = Game.marioCollided(state.mario, state.goombas)
  if (thereIsCollision) {
    stop()
    Draw.gameOver(ctx, state)()
    updateState(['gameOver'], true, state)()
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
  var shouldRestart = state.gameOver && R.equals(e.keyCode, Config.keyCodes.restart)
  var update = () => {
    state = Game.updatePressedKeys(
      Game.keyCodeToDirection(e.keyCode),
      false,
      state
    )
  }

  if (!shouldRestart) { update() } else { restart() }
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
  detectCollision(state, ctx)()
}

var game = setInterval(main, 10)

// Remove comments for audio ;)
// var audio = new Audio('/assets/audio/mario.mp3')
// audio.play()
