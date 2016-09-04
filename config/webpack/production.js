'use strict';

const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = () => ({
	plugins: [
		new CleanWebpackPlugin('dist', {
			root: `${__dirname}/../../assets`,
			verbose: true,
			dry: false
		})
	]
});