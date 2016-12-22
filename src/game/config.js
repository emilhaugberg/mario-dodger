var width = 75
var height = 75

var dimensions = {
  width: 1430,
  height: 745
}

var config = {
  mario: {
    speed: 5,
    width: 75,
    height: 75
  },
  goombas: {
    speed: 5,
    dimensions: {
      width: {
        min: 25,
        max: 65
      },
      height: {
        min: 25,
        max: 75
      }
    }
  },
  canvas: {
    width:  1430,
    height: 745
  },
  keyCodes: {
    left: 37,
    right: 39
  },
  directions: {
    left: 'left',
    right: 'right',
    standing: 'standing'
  }
}

var state = {
  frames: 0,
  score: 0,
  keysPressed: {
    left: false,
    right: false
  },
  goombas: [],
  lifes: [1,2,3],
  mario: {
    x: 0,
    y: config.canvas.height - height - 85,
    direction: config.directions.right
  }
}

module.exports = {
  state: state,
  config: config
}
