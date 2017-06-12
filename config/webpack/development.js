"use strict";

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = () =>
  require("webpack-merge").smart({
    devtool: "source-map",
    devServer: {
      host: "localhost",
      port: 8080,
      historyApiFallback: true,
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    },
    plugins: [
      new ExtractTextPlugin({
        filename: "style/bundle.[chunkhash:6].css",
        allChunks: true
      })
    ]
  });
