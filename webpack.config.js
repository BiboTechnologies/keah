const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: 'index.js', // Your entry file
  output: {
    filename: 'bundle.js', // Output filename
    path: __dirname + '/dist', // Output directory
  },
  plugins: [
    new TerserPlugin(), // Add TerserPlugin to your list of plugins
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
