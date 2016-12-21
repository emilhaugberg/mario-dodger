var $ = require('jquery')
var R = require('ramda')

var LEFT = 'left'
var RIGHT = 'right'

var CANVASWIDTH = 600
var CANVASHEIGHT = 600

var PLAYERRADIUS = 20

var SPEED = 5

var keyPresses = {
  right: false,
  left: false
}

var keyCodes = {
  left: 37,
  right: 39
}

var position = {
  x: CANVASWIDTH / 2,
  y: CANVASHEIGHT / 2,
  r: PLAYERRADIUS
}

var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

$(document).keydown(keyDownHandler)
$(document).keyup(keyUpHandler)

function move(direction) {
  if(direction === LEFT) {
    keyPresses.left = true
  } else {
    keyPresses.right = true
  }
}

function keyDownHandler (e) {
  var keyCode = e.keyCode
  if (keyCode === keyCodes.left) {
    move(LEFT)
  } else if (keyCode === keyCodes.right) {
    move(RIGHT)
  }
}

function keyUpHandler () {
  keyPresses.left = false
  keyPresses.right = false
}

function drawPlayer (ctx) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, position.r, 0, Math.PI * 2, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  if ( keyPresses.right ) {
    position.x += SPEED
  } else if ( keyPresses.left ) {
    position.x -= SPEED
  }
}

function draw (canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPlayer(ctx)
}

setInterval(function() {
  draw(canvas, ctx)
}, 10)
