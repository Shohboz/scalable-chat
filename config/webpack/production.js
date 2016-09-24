'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const PATHS = {
  root: `${__dirname}/../../assets`
};

module.exports = () => ({
	plugins: [
		new CleanWebpackPlugin('dist', {
			root: PATHS.root,
			verbose: true,
			dry: false
		})
	]
});