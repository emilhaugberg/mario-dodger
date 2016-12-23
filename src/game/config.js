var width = 75
var height = 75

var groundHeight = 85

var marioHeight = 75
var marioWidth = 75

var directions = {
  left: 'left',
  right: 'right',
  standing: 'standing'
}

var images = [
  {
    image: '/assets/images/standing-mario.png',
    direction: directions.right
  },
  {
    image: '/assets/images/standing-mario-flipped.png',
    direction: directions.left
  },
  {
    image: '/assets/images/standing-mario.png',
    direction: directions.standing
  }
]

var goombaWidth = {
  min: 25,
  max: 65
}

var goombaHeight = {
  min: 25,
  max: 65
}

var keyCodes = {
  left: 37,
  right: 39
}

var canvas = {
  width: 1430,
  height: 745
}

var mario = {
  speed: 7,
  width: marioWidth,
  height: marioHeight,
  pos: {
    x: 0,
    y: canvas.height - marioHeight - groundHeight,
    direction: directions.right
  }
}

var goomba = {
  speed: 10,
  height: goombaHeight,
  width: goombaWidth
}

var initialState = {
  mario: mario.pos,
  goombas: [],
  lifes: 3,
  frames: 0,
  score: 0,
  keysPressed: {
    left: false,
    right: false
  }
}

module.exports = {
  directions: directions,
  keyCodes: keyCodes,
  canvas: canvas,
  mario: mario,
  goomba: goomba,
  initialState: initialState,
  images: images
}
