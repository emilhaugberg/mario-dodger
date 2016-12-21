var $ = require('jquery')
var R = require('ramda')

var directions = {
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down'
}

var CANVASWIDTH = 600
var CANVASHEIGHT = 600

var PLAYERRADIUS = 20

var SPEED = 5

var keyPressed = {
  right: false,
  left: false,
  up: false,
  down: false
}

var keyCodes = {
  left: 37,
  right: 39,
  down: 40,
  up: 38
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
  switch (direction) {
    case LEFT:
      keyPressed.left = true
      break
    case RIGHT:
      keyPressed.right = true
      break
    case UP:
      keyPressed.up = true
      break
    case DOWN:
      keyPressed.down = true
      break
  }
}

function keyDownHandler (e) {
  var keyCode = e.keyCode
  if (keyCode === keyCodes.left) {
    move(directions.left)
  } else if (keyCode === keyCodes.right) {
    move(directions.right)
  } else if (keyCode === keyCodes.up) {
    move(directions.up)
  } else if (keyCode === keyCodes.down) {
    move(directions.down)
  }
}

function keyUpHandler () {
  keyPressed.left = false
  keyPressed.right = false
  keyPressed.up = false
  keyPressed.down = false
}

function drawPlayer (ctx) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, position.r, 0, Math.PI * 2, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  if ( keyPressed.right ) {
    position.x += SPEED
  } else if ( keyPressed.left ) {
    position.x -= SPEED
  } else if ( keyPressed.up ) {
    position.y -= SPEED
  } else if ( keyPressed.down ) {
    position.y += SPEED
  }
}

function draw (canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPlayer(ctx)
}

setInterval(function() {
  draw(canvas, ctx)
}, 10)
