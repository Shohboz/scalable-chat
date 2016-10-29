'use strict';

// const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PugWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const base = `${__dirname}/../../assets/`;
const PATHS = {
  root: base,
  build: path.join(base, 'dist'),
};

module.exports = () => ({
  debug: true,
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '/backend'),
    host: 'localhost',
    port: 8050,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  },
  module: {
    loaders: [
      {
        test: /\.pug$/,
        loader: 'pug'
      }
    ]
  },
  // output: {
  //   path: PATHS.build,
  //   filename: "bundle.js"
  // },
  plugins: [
    new HtmlWebpackPlugin({
      // filetype: 'pug',
      template: path.join(__dirname, '../../views/templates/chat.pug')
    }),
    // new PugWebpackPlugin()
    // new HtmlWebpackPlugin({
    //   template: 'test.pug',
    //   filename: 'index.pug',
    //   filetype:'pug'
    // }),
    // new PugWebpackPlugin({
    //   template: path.join(__dirname, '../../views/templates/chat.pug')
    // })
    // new HtmlWebpackPlugin({
    //   template: 'index.html'
    // })
  //   new CleanWebpackPlugin('dist', {
  //     root: PATHS.root,
  //     verbose: true,
  //     dry: false
  //   })
  ]
});