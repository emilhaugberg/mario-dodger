var $ = require('jquery')
var R = require('ramda')

var cs = require('./game/config')
var config = cs.config
var state = cs.state

var marioImages = [
  { image: '/assets/images/standing-mario.png', direction: config.directions.right },
  { image: '/assets/images/standing-mario-flipped.png', direction: config.directions.left},
]

var random = (min, max) => Math.random() * (max - min) + min

var addgoomba = () => {
  var randomDimension = random(config.goombas.dimensions.width.min, config.goombas.dimensions.width.max)
  var mush = {
    x: Math.floor(random(randomDimension, config.canvas.width - randomDimension)),
    y: 0,
    height: Math.floor(randomDimension),
    width: Math.floor(randomDimension)
  }

  state.goombas = R.append(mush, state.goombas)
}

var drawgoombas = () => {
  R.forEach((mush) => {
    var img = new Image()
    img.src = '/assets/images/goomba.png'
    ctx.drawImage(img, mush.x, mush.y, mush.width, mush.height)
  }, state.goombas)
}

var movegoombas = () => {
  state.goombas = R.map((mush) => {
    return { x: mush.x, y: mush.y += config.goombas.speed, width: mush.width, height: mush.height }
  }, state.goombas)
}

var filtergoombas = () => {
  state.goombas = R.reject((mush) => mush.y > config.canvas.height, state.goombas)
}

var drawMario = (ctx, mario) => {
  var directionToImage = (direction) => {
    return R.find(
      R.compose(R.equals(direction), R.prop('direction'))
    , marioImages)
  }

  var imageSrc = R.compose(R.prop('image'), directionToImage)(mario.direction)

  var img = new Image()
  img.src = imageSrc
  ctx.drawImage(img, mario.x, mario.y, config.mario.width, config.mario.height)
}

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

var drawScore = (ctx) => {
  ctx.font = ('50px VT323')
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + state.score, 1175, 65)
}

var drawMushroom = (x) => {
  var img = new Image()
  img.src = '/assets/images/mushroom.png'
  ctx.drawImage(img, x, 70, 50, 50)
}

var drawLifes = () => {
  ctx.font = ('50px VT323')
  ctx.fillStyle = 'white'
  ctx.fillText('Lifes', 75, 50)
  R.forEach((i) => drawMushroom(i * 50) , state.lifes)
}

var draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawMario(ctx, state.mario)

  if (state.frames % 20 == 0) addgoomba()

  drawgoombas()
  movegoombas()
  filtergoombas()
  drawScore(ctx)
  drawLifes()

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

var main = setInterval(() => draw(), 10)
