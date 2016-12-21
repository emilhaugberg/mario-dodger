var $ = require('jquery')
var R = require('ramda')

window.R = R

var directions = { left: 'left', right: 'right', up: 'up', down: 'down' }

var keys = [
  { code: 37, direction: directions.left  },
  { code: 39, direction: directions.right },
  { code: 38, direction: directions.up    },
  { code: 40, direction: directions.down  }
]

var dimensions = {
  width: 600,
  height: 600
}

var state = {
  enemies: [],
  keyspressed: [],
  keypresses: {
    left: false,
    right: false,
    up: false,
    down: false
  },
  player: {
    x: dimensions.width / 2,
    y: dimensions.height / 2,
    r: 20
  }
}

var SPEED = 5

var getDirections = R.map(
  R.compose(
    R.prop('direction'),
    (code) => R.find(R.propEq('code', code), keys)
  )
)

var update = (path) => (value) =>
  { state = R.assocPath(path, value, state) }

var move = () => {
  var keyspressed = R.slice(0, 2, getDirections(state.keyspressed))
  R.forEach((key) => state.keypresses[key] = true, keyspressed)
}

var keyDownHandler = (e) => {
    var addKeyCodes = R.compose(
      update(['keyspressed']),
      R.uniq,
      R.append(e.which) // add keycode
    )

    addKeyCodes(state.keypresses)
    move()
}

var keyUpHandler = () => {
  update(['keypressed'])([])
  update(['keypresses'])({ left: false, right: false, up: false, down: false })
}

var drawPlayer = (ctx) => {
  ctx.beginPath();
  ctx.arc(state.player.x, state.player.y, state.player.r, 0, Math.PI * 2, false);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

var draw = (canvas, ctx) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPlayer(ctx)

  if (state.keypresses.left && state.keypresses.up) {
    state.player.x -= SPEED
    state.player.y -= SPEED
  } else if (state.keypresses.right && state.keypresses.up) {
    state.player.x += SPEED
    state.player.y -= SPEED
  } else if (state.keypresses.left && state.keypresses.down) {
    state.player.x -= SPEED
    state.player.y += SPEED
  } else if (state.keypresses.right && state.keypresses.down) {
    state.player.x += SPEED
    state.player.y += SPEED
  } else if (state.keypresses.left) {
    state.player.x -= SPEED
  } else if (state.keypresses.right) {
    state.player.x += SPEED
  } else if (state.keypresses.up) {
    state.player.y -= SPEED
  } else if (state.keypresses.down) {
    state.player.y += SPEED
  }
}

var canvas = $('#game')[0]
var ctx = canvas.getContext('2d')

$(document).keydown((e) => keyDownHandler(e))
$(document).keyup(keyUpHandler)

setInterval(() => draw(canvas, ctx), 10)
