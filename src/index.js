var $ = require('jquery')
var R = require('ramda')

var frames = 0

var SPEED = 5
var goombaSPEED = 5

var width = 75
var height = 75

var dimensions = {
  width: 1430,
  height: 745
}

var keyCodes = {
  left: 37,
  right: 39
}

var keysPressed = {
  left: false,
  right: false
}

var directions = {
  left: 'left',
  right: 'right'
}

var goombas = []

var mario = {
  x: 0,
  y: dimensions.height - height - 85,
  direction: directions.right
}

var marioImages = [
  { image: '/assets/images/standing-mario.png', direction: directions.right },
  { image: '/assets/images/standing-mario-flipped.png', direction: directions.left},
]

var random = (min, max) => Math.random() * (max - min) + min

var addgoomba = () => {
  var randomR = Math.floor(random(10, 20))
  var randomAttr = random(25, 75)
  var mush = {
    x: Math.floor(random(randomR, dimensions.width - randomR)),
    y: 0,
    height: Math.floor(randomAttr),
    width: Math.floor(randomAttr)
  }

  goombas = R.append(mush, goombas)
}

var drawgoombas = () => {
  R.forEach((mush) => {
    var img = new Image()
    img.src = '/assets/images/goomba.png'
    ctx.drawImage(img, mush.x, mush.y, mush.width, mush.height)
  }, goombas)
}

var movegoombas = () => {
  goombas = R.map((mush) => {
    return { x: mush.x, y: mush.y += goombaSPEED, width: mush.width, height: mush.height }
  }, goombas)
}

var filtergoombas = () => {
  goombas = R.reject((mush) => mush.y > dimensions.height, goombas)
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
  ctx.drawImage(img, mario.x, mario.y, width, height)
}

var keyDownHandler = (e) => {
  if (e.keyCode == keyCodes.right) {
    mario.direction = directions.right
    keysPressed.right = true
  }
  else if (e.keyCode == keyCodes.left && mario.x > 0) {
    mario.direction = directions.left
    keysPressed.left = true
  }
}

var keyUpHandler = (e) => {
  if (e.keyCode == keyCodes.right) {
    keysPressed.right = false
    mario.direction = directions.right
  }
  else if (e.keyCode == keyCodes.left) {
    keysPressed.left = false
    mario.direction = directions.left
  }
}

var draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawMario(ctx, mario)

  if (frames % 20 == 0) addgoomba()

  drawgoombas()
  movegoombas()
  filtergoombas()

  if (keysPressed.right && mario.x + width < dimensions.width) {
    mario.x += SPEED
  }
  else if (keysPressed.left && mario.x > 0) {
    mario.x -= SPEED
  }

  frames += 1
}

var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

$(document).keydown(keyDownHandler)
$(document).keyup(keyUpHandler)

var main = setInterval(() => draw(), 10)
