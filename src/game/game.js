var R = require('ramda')
var Config = require('./config.js')

var random = (min, max) => Math.floor(Math.random() * (max - min) + min)

var canMoveRight = (x) => x < Config.canvas.width
var canMoveLeft =  (x) => x > 0

var updateState = R.assocPath

var shouldScoreUpdate = (frames) => R.equals(R.modulo(frames, 100), 0)

var keyCodeToDirection = R.cond([
  [ R.equals(Config.keyCodes.left),  R.always(Config.directions.left)     ],
  [ R.equals(Config.keyCodes.right), R.always(Config.directions.right)    ],
  [ R.T,                             R.always(Config.directions.standing) ],
])

var directionToImage = (direction) => {
  var equalDirection = R.compose(R.equals(direction), R.prop('direction'))
  return R.find(equalDirection, Config.images)
}

var updatePressedKeys = (direction, moving, state) => {
  return R.compose(
    updateState(['mario', 'direction'], direction),
    updateState(['keysPressed', direction], moving)
  )(state)
}

var createGoomba = (dim, x) => {
  return {
    x: x,
    y: 0,
    height: dim,
    width: dim
  }
}

var addGoomba = (goombas) => {
  var randomD = random(Config.goomba.width.min, Config.goomba.width.max)
  var randomX = random(0, Config.canvas.width - randomD)
  var goomba = createGoomba(randomD, randomX)

  return R.append(goomba, goombas)
}

var addGoombaCond = (state) => {
  var shouldAddGoomba = (frames) =>
    R.always(
      R.equals(R.modulo(frames, 10), 0)
    )

  return R.ifElse(
    shouldAddGoomba(state.frames),
    addGoomba,
    R.identity
  )
}

var moveGoombas = R.map(
  (goomba) => R.assoc('y', R.add(goomba.y, Config.goomba.speed), goomba)
)

var filterGoombas = R.reject(
  R.compose(
    R.flip(R.gt)(Config.canvas.height),
    R.prop('y')
  )
)

var updateGoombas = (state) => {
  return R.compose(
    addGoombaCond(state),
    moveGoombas,
    filterGoombas,
    R.prop('goombas')
  )(state)
}

var gameOver = R.compose(R.isEmpty, R.prop('lifes'))

module.exports = {
  updateGoombas: updateGoombas,
  updateState: updateState,
  updatePressedKeys: updatePressedKeys,
  canMoveLeft: canMoveLeft,
  canMoveRight: canMoveRight,
  keyCodeToDirection: keyCodeToDirection,
  directionToImage: directionToImage,
  gameOver: gameOver,
  shouldScoreUpdate: shouldScoreUpdate
}
