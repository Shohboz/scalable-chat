'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const PATHS = {
  build: `${__dirname}/../../assets/dist`
};

module.exports = () => ({
	plugins: [
		new CleanWebpackPlugin('dist', {
			root: PATHS.build,
			verbose: true,
			dry: false
		})
	]
});