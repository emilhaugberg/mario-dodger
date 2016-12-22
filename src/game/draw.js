var R = require('ramda')
var cs = require('./config')
var config = cs.config
var state = cs.state

var images = [
  { image: '/assets/images/standing-mario.png', direction: config.directions.right },
  { image: '/assets/images/standing-mario-flipped.png', direction: config.directions.left},
  { image: '/assets/images/standing-mario.png', direction: config.directions.standing},
]

var random = (min, max) => Math.floor(Math.random() * (max - min) + min)

var addgoomba = (state) => (goombas) => {
  var randomDimension = random(
    config.goombas.dimensions.width.min,
    config.goombas.dimensions.width.max
  )

  var mush = {
    x: random(randomDimension, config.canvas.width - randomDimension),
    y: 0,
    height: randomDimension,
    width: randomDimension
  }

  return R.ifElse(
    () => state.frames % 10 == 0,
    R.append(mush),
    R.identity
  )(goombas)
}

var movegoombas = R.map((mush) => {
  return { x: mush.x, y: mush.y += config.goombas.speed, width: mush.width, height: mush.height }
})

var filtergoombas = (goombas) => {
  return R.reject((mush) => mush.y > config.canvas.height, goombas)
}

var drawgoombas = (ctx, state) => {
  return () =>
    R.forEach((mush) => {
      var img = new Image()
      img.src = '/assets/images/goomba.png'
      ctx.drawImage(img, mush.x, mush.y, mush.width, mush.height)
    }, state.goombas)
}

var drawMario = (ctx, state) => {
  var mario = state.mario

  var directionToImage = (direction) => {
    return R.find(
      R.compose(R.equals(direction), R.prop('direction'))
    , images)
  }

  var img = new Image()
  img.src = R.compose(R.prop('image'), directionToImage)(mario.direction)

  return () =>
    ctx.drawImage(img, mario.x, mario.y, config.mario.width, config.mario.height)
}

var drawScore = (ctx, state) => {
  return () => {
    ctx.font = ('50px VT323')
    ctx.fillStyle = 'white'
    ctx.fillText('Score: ' + state.score, 1175, 65)
  }
}

var drawMushroom = (ctx, x) => {
  return () => {
    var img = new Image()
    img.src = '/assets/images/mushroom.png'
    ctx.drawImage(img, x, 70, 50, 50)
  }
}

var drawLifeText = (ctx) => {
  return () => {
    ctx.font = ('50px VT323')
    ctx.fillStyle = 'white'
    ctx.fillText('Lifes', 75, 50)
  }
}

var drawLifes = (ctx, state) => {
  return () => {
    R.forEach((i) =>
      drawMushroom(ctx, i * 50)()
    , state.lifes)
  }
}

var draw = (ctx, state) => {
  return () => {
    drawMario(ctx, state)()
    drawgoombas(ctx, state)()

    drawScore(ctx, state)()
    drawLifes(ctx, state)()
    drawLifeText(ctx)()
  }
}

var updateGoombas = (state) => {
  return R.compose(
    addgoomba(state),
    movegoombas,
    filtergoombas,
    R.prop('goombas')
  )(state)
}

module.exports = {
  draw: draw,
  updateGoombas: updateGoombas
}
