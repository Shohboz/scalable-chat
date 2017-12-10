const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const parts = require("./webpack.parts");
const CONFIG_PATH = "config/webpack";

const PATHS = {
  src: path.resolve(__dirname, "assets/src"),
  build: path.resolve(__dirname, "static")
};

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const environment = (target => {
  switch (target) {
    case "test":
      return "test";
    case "build:client":
      return "production";
    default:
      return "development";
  }
})(TARGET);

module.exports = require("webpack-merge").smart(
  parts.babelLoader(),
  parts.styleLoader(),
  // parts.eslintLoader(),
  parts.fontLoader({
    outputPath: "/fonts/",
    publicPath: "/static/"
  }),
  parts.loadImages(),
  {
    context: PATHS.src,

    entry: {
      src: ["index"]
    },

    output: {
      path: PATHS.build,
      publicPath: "/",
      filename: "bundle.[hash:8].js",
      chunkFilename: "chunk_[name].[chunkhash:6].js"
    },

    plugins: [
      new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery",
        "window.jQuery": "jquery"
      }),
      new ExtractTextPlugin({
        filename: "bundle.[hash:8].css",
        allChunks: true
      }),
      parts.generateAssetsConfig()
    ],

    resolve: {
      modules: ["node_modules", PATHS.src],
      extensions: [".js", ".jsx"]
    }
  },
  require(path.join(__dirname, CONFIG_PATH, environment))(__dirname)
);
