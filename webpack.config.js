var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'app'),
    publicPath: '/assets/'
    filename: 'bundle.js'
  }
};
