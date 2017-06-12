"use strict";

const fs = require("fs");
const path = require("path");
const findByExtension = (arr, regex) => arr.find(item => item.match(regex));
const ASSETS_CONFIG_PATH = path.join(__dirname, "..", "assets.config.js");

module.exports.AssetsConfigPlugin = function() {
  return function() {
    this.plugin("done", statsData => {
      const stats = statsData.toJson();
      if (!stats.errors.length) {
        const { assetsByChunkName: { src } } = stats;
        let js = findByExtension(src, /\.js$/);
        let css = findByExtension(src, /\.css$/);
        fs
          .createWriteStream(ASSETS_CONFIG_PATH)
          .write(`module.exports = ${JSON.stringify({ css, js })};`);
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

module.exports.requireNoCache = requireNoCache;

module.exports.ASSETS_CONFIG_PATH = ASSETS_CONFIG_PATH;
