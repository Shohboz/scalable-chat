const fs = require("fs");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

exports.fontLoader = (options = {}) => ({
  module: {
    rules: [
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        use: [
          {
            loader: "file-loader",
            options
          }
        ]
      }
    ]
  }
});

exports.styleLoader = () => ({
  module: {
    rules: [
      {
        test: /\.css$|\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  }
});

exports.eslintLoader = () => ({
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ]
  }
});

exports.devServer = (
  {
    publicPath,
    host,
    port,
    stats = "errors-only",
    disableHostCheck = true
  } = {}
) => ({
  devServer: {
    historyApiFallback: true,
    stats,
    host,
    port,
    overlay: {
      errors: true,
      warnings: true
    },
    publicPath,
    disableHostCheck,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
});

exports.babelLoader = () => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ],
        exclude: path.join(__dirname, "node_modules/*")
      }
    ]
  }
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg)$/,
        include,
        exclude,

        use: {
          loader: "url-loader",
          options
        }
      }
    ]
  }
});

const findByExtension = (arr, regex) => arr.find(item => item.match(regex));
const ASSETS_CONFIG_PATH = path.join(__dirname, "assets.config.json");

module.exports.generateAssetsConfig = () => {
  return function() {
    this.plugin("done", statsData => {
      const stats = statsData.toJson();
      if (!stats.errors.length) {
        const { assetsByChunkName: { src } } = stats;
        const js = findByExtension(src, /\.js$/);
        const css = findByExtension(src, /\.css$/);

        fs.writeFileSync(ASSETS_CONFIG_PATH, `${JSON.stringify({ css, js })}`);
      }
    });
  };
};

const requireNoCache = assetsPath => {
  delete require.cache[require.resolve(assetsPath)];
  return require(assetsPath);
};

module.exports.reload = () => requireNoCache(ASSETS_CONFIG_PATH);

module.exports.load = () => require(ASSETS_CONFIG_PATH);
