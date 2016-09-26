'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const path = require('path');
const configsPath = 'config/webpack';
const TARGET = process.env.npm_lifecycle_event;

let env;
switch (TARGET) {
  case "assets":
    env = 'development';
    break
  default:
    env = 'production';
    break
}
let config = require(path.join(__dirname, configsPath, env));

const PATHS = {
  src: path.join(__dirname, 'assets/src/js'),
  build: path.join(__dirname, 'assets/dist')
};

process.env.BABEL_ENV = TARGET;

module.exports = merge.smart({
  context: PATHS.src,
  entry: {
    src: ['./index']
    // src: PATHS.src
  },
  output: {
    path: PATHS.build,
    // publicPath: "/",
    filename: "bundle.[hash:8].js",
    // filename: "bundle.js",
    chunkFilename: "chunk_[name].[chunkhash:6].js"
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        exclude: 'node_modules/*',
        include: PATHS.src
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.src
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: 'node_modules/*'
      },
      { 
        test: /\.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /<!-- @SOCKETIO_URL -->/ig,
              replacement: (match, p1, offset, string) => process.env.SOCKETIO_URL.replace(/[\n\r]+/g, '')
            }
          ]})
      }
    ],
  },

  plugins: [
    // Делаем переменную jQuery видимой в каждом модуле
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new StringReplacePlugin()
  ],

  resolve: {
    modulesDirectories: [ 'node_modules', PATHS.src ],
    extensions: [ '', '.js', '.jsx' ]
  }
},
config(__dirname));