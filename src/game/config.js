var groundHeight = 75

var marioHeight = 75
var marioWidth = 45

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
  right: 39,
  restart: 82
}

var canvas = {
  width: 1280,
  height: 655
}

var score = {
  x: 1050,
  y: 65
}

var mario = {
  speed: 7,
  width: marioWidth,
  height: marioHeight,
  x: 0,
  y: canvas.height - marioHeight - groundHeight,
  direction: directions.right
}

var goomba = {
  speed: 10,
  height: goombaHeight,
  width: goombaWidth
}

var initialState = {
  mario: mario,
  goombas: [],
  lifes: 3,
  frames: 0,
  score: 0,
  keysPressed: {
    left: false,
    right: false
  },
  gameOver: false
}

module.exports = {
  directions: directions,
  keyCodes: keyCodes,
  canvas: canvas,
  mario: mario,
  goomba: goomba,
  initialState: initialState,
  images: images,
  score: score
}
