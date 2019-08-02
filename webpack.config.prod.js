const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
	entry: {
		main: './src/index.tsx',
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].[contenthash].js',
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
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							modules: {
								mode: 'local',
								localIdentName: '[hash:base64:5]',
							},
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
						},
					},
				], 
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
				test: /\.less$/,
				exclude: /node_modules/,
				loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
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
		new HtmlWebpackPlugin({
			template: './src/template.html',
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new CopyWebpackPlugin([{ context: './src/assets', from: '**', to: 'assets' }]),
	],

	devtool: 'source-map',
};
