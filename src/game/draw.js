var R = require('ramda')

var Config = require('./config')
var Game = require('./game')

var drawGoomba = (ctx) => (goomba) => {
  var img = new Image()
  img.src = '/assets/images/goomba.png'

  ctx.drawImage(img, goomba.x, goomba.y, goomba.width, goomba.height)
}

var goombas = (ctx, state) => {
  return () =>
    R.forEach(drawGoomba(ctx), state.goombas)
}

var drawMario = (ctx) => (mario) => {
  var marioImg = R.compose(R.prop('image'), Game.directionToImage)(mario.direction)
  var img = new Image()
  img.src = marioImg

  return () =>
    ctx.drawImage(
      img,
      mario.x,
      mario.y,
      Config.mario.width,
      Config.mario.height
    )
}

var mario = (ctx, state) => {
  return drawMario(ctx)(state.mario)
}

var score = (ctx, state) => {
  return () => {
    ctx.font = ('50px VT323')
    ctx.fillStyle = 'white'
    ctx.fillText('Score: ' + state.score, Config.score.x, Config.score.y)
  }
}

var mushroom = (ctx, x) => {
  return () => {
    var img = new Image()
    img.src = '/assets/images/mushroom.png'
    ctx.drawImage(img, x, 70, 50, 50)
  }
}

var draw = (ctx, state) => {
  return () => {
    mario(ctx, state)()
    goombas(ctx, state)()
    score(ctx, state)()
  }
}

var clear = (ctx) => () => {
  ctx.clearRect(0, 0, Config.canvas.width, Config.canvas.height)
}

var gameOver = (ctx, state) => () => {
  clear(ctx)()
  ctx.font = ('150px VT323')
  ctx.fillStyle = 'white'
  ctx.fillText('GAME OVER', Config.canvas.width / 2 - 250, Config.canvas.height / 2 - 50)
  ctx.font = ('50px VT323')
  ctx.fillText('press R to restart', Config.canvas.width / 2 - 250, Config.canvas.height / 2)
  ctx.font = ('50px VT323')
  ctx.fillText('Score:' + state.score, Config.canvas.width / 2 + 130, Config.canvas.height / 2)
}

module.exports = {
  draw: draw,
  clear: clear,
  gameOver: gameOver
}
