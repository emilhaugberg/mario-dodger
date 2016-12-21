var $ = require('jquery')
var R = require('ramda')

var CANVASWIDTH = 600
var CANVASHEIGHT = 600

var PLAYERRADIUS = 20

var initialPosition = {
  x: CANVASWIDTH / 2,
  y: CANVASHEIGHT / 2,
  r: PLAYERRADIUS
}

var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

function drawPlayer (ctx) {
  ctx.beginPath();
  ctx.arc(initialPosition.x, initialPosition.y, initialPosition.r, 0, Math.PI * 2, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function draw (canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPlayer (ctx)
}

setInterval(draw(canvas, ctx), 10)
