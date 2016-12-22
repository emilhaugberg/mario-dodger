var R = require('ramda')
var cs = require('./config')
var config = cs.config
var state = cs.state

var marioImages = [
  { image: '/assets/images/standing-mario.png', direction: config.directions.right },
  { image: '/assets/images/standing-mario-flipped.png', direction: config.directions.left},
  { image: '/assets/images/standing-mario.png', direction: config.directions.standing},
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

var drawgoombas = (ctx) => {
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

var drawScore = (ctx) => {
  ctx.font = ('50px VT323')
  ctx.fillStyle = 'white'
  ctx.fillText('Score: ' + state.score, 1175, 65)
}

var drawMushroom = (ctx, x) => {
  var img = new Image()
  img.src = '/assets/images/mushroom.png'
  ctx.drawImage(img, x, 70, 50, 50)
}

var drawLifes = (ctx) => {
  ctx.font = ('50px VT323')
  ctx.fillStyle = 'white'
  ctx.fillText('Lifes', 75, 50)
  R.forEach((i) => drawMushroom(ctx, i * 50) , state.lifes)
}

module.exports = {
  addgoomba: addgoomba,
  drawgoombas: drawgoombas,
  movegoombas: movegoombas,
  filtergoombas: filtergoombas,
  drawMario: drawMario,
  drawScore: drawScore,
  drawMushroom: drawMushroom,
  drawLifes: drawLifes
}
