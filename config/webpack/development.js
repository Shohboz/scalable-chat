'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const PATHS = {
  build: `${__dirname}/../../assets/dist`
};

module.exports = () => ({
  watch: true,
  devtool: 'source-map',
  output: {
    path: PATHS.build,
    filename: "bundle.js"
  },
  plugins: [
    new CleanWebpackPlugin('dist', {
      root: PATHS.build,
      verbose: true,
      dry: false
    })
  ]
});