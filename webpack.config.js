const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve('src'),
  entry: './index.js',
  output: {
    path: path.resolve('public'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
    ],
  },
  devtool: '#eval-source-map',
  devServer: {
    contentBase: path.join('.', 'public'),
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new CopyWebpackPlugin([
      { from: 'pwa' },
      { from: 'css' },
      { from: 'deploy' },
    ]),
  ],
};

if (process.env.NODE_ENV === 'production') { // only add in production
  module.exports.devtool = undefined;
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new BabiliPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new OfflinePlugin({
      caches: {
        main: [
          'bundle.js',
          'index.html',
        ],
      },
      autoUpdate: true,
    }),
  ]);
} else { // Only add in development
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.NamedModulesPlugin(),
  ]);
}
