const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    path.join(__dirname, 'src', 'index.js'),
    'webpack-hot-middleware/client',
  ],

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'index.js',
    publicPath: '/',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel',
      },
    ],
  },

  devtool: 'source-map',

  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'isomorphic-fetch',
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
    }),

    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  babel: {
    presets: ['es2015', 'react'],
  },
};
