'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const configsPath = 'config/webpack';

const _configs = {
  // Загружаем production, development конфиги
  production: require(path.join(__dirname, configsPath, 'production')),
  development: require(path.join(__dirname, configsPath, 'development'))
};

let config = ((environment) => {
  // Проверяем существование конфига
  if (!_configs[environment]) {
    throw 'Can\'t find enviroments see _configs object';
  }
  // Возвращает загруженный конфиг согласно переменной окружения
  return _configs[environment](__dirname);
})(process.env.NODE_ENV);

const PATHS = {
  src: path.join(__dirname, 'assets/js'),
  build: path.join(__dirname, 'assets/dist')
};
const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

module.exports = merge.smart({
  // context: PATHS.src,
  entry: {
    // src: ['./index']
    src: PATHS.src
  },
  output: {
    path: PATHS.build,
    // publicPath: "/",
    // filename: "bundle.[hash:8].js",
    filename: "bundle.js",
    chunkFilename: "chunk_[name].[chunkhash:6].js"
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jshint-loader'
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
      }
    ],
  },

  plugins: [
    // Делаем переменную jQuery видимой в каждом модуле
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],

  resolve: {
    modulesDirectories: [ 'node_modules', PATHS.src ],
    extensions: [ '', '.js', '.jsx' ]
  }
},
config);