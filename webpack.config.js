const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
	entry: {
		main: './src/index.tsx',
	},
	devtool: 'inline-source-map',
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].js',
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use:[
					'css-hot-loader',
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1,
							modules: {
								mode: 'local',
								localIdentName: '[name]__[local]--[hash:base64:5]',
							},
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							ident: 'postcss',
						},
					},
				], 
			},
			{
				test: /\.less$/,
				exclude: /node_modules/,
				loaders: ['css-hot-loader', MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'url-loader',
			},
			{
				test: /\.(tsx|ts)?$/,
				exclude: /node_modules/,
				loader: 'awesome-typescript-loader',
				options: {
					getCustomTransformers: () => ({ before: [styledComponentsTransformer] }),
				},
			},
		],
	},

	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './src/template.html',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].css',
		}),
	],

	devServer: {
		contentBase: './public',
		hot: true,
		port: 8888,
		host: 'localhost',
		historyApiFallback: true,
	},
};
