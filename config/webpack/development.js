'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const base = `${__dirname}/../../assets/`;
const PATHS = {
  root: base,
  build: path.join(base, 'dist'),
};

module.exports = () => ({
  devtool: 'source-map',
  output: {
    path: PATHS.build,
    filename: "bundle.js"
  },
  plugins: [
    new CleanWebpackPlugin('dist', {
      root: PATHS.root,
      verbose: true,
      dry: false
    })
  ]
});