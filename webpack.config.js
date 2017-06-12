"use strict";

const webpack = require("webpack");
const StringReplacePlugin = require("string-replace-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const configsPath = "config/webpack";
const AssetsConfigPlugin = require("./plugins/webpack.assets")
  .AssetsConfigPlugin;
const TARGET = process.env.npm_lifecycle_event;

let env;
switch (TARGET) {
  case "assets":
    env = "development";
    break;
  default:
    env = "production";
    break;
}

const PATHS = {
  src: path.join(__dirname, "assets/src"),
  build: path.join(__dirname, "static")
};

process.env.BABEL_ENV = TARGET;

module.exports = require("webpack-merge").smart(
  {
    context: PATHS.src,
    entry: {
      src: ["index"],
      vendor: "bootstrap-loader"
    },
    output: {
      path: PATHS.build,
      publicPath: "/",
      filename: "bundle.[hash:8].js",
      // filename: "bundle.js",
      chunkFilename: "chunk_[name].[chunkhash:6].js"
    },
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg)$/,
          use: {
            loader: "url-loader"
          }
        },
        {
          test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath: "/static/"
              }
            }
          ]
        },
        {
          test: /\.css$|\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", "sass-loader"]
          })
        },
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: "babel-loader"
          },
          exclude: path.join(__dirname, "node_modules/*")
        },
        {
          test: /\.js$/,
          use: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /<!-- @SOCKETIO_URL -->/gi,
                replacement: (match, p1, offset, string) =>
                  process.env.SOCKETIO_URL.replace(/[\n\r]+/g, "")
              }
            ]
          })
        }
      ]
    },

    plugins: [
      // Делаем переменную jQuery видимой в каждом модуле
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
        "window.jQuery": "jquery"
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        filename: "vendor.js"
      }),
      new StringReplacePlugin()
    ],

    resolve: {
      modules: ["node_modules", PATHS.src],
      extensions: [".js", ".jsx"]
    }
  },
  require(path.join(__dirname, configsPath, env))(__dirname),
  {
    plugins: [AssetsConfigPlugin()]
  }
);
