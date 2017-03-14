'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    __PRODUCTION__: process.env.NODE_ENV === 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: '[name].[hash].bundle.js'
  }),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    inject: 'body',
    minify: false
  })
];

const devPlugins = [];

const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    mangle: false,
    compress: {
      warnings: false
    }
  })
  // static assets
  // new CopyWebpackPlugin([
  //   {
  //     from: 'src/assets',
  //     to: 'assets'
  //   }
  // ]),
];

const plugins = basePlugins
  .concat(process.env.NODE_ENV === 'production' ? prodPlugins : devPlugins);


module.exports = {

  entry: {
    app: './src/main.ts',
    vendor: [
      'es6-shim',
      'es6-promise',
      'angular2/bundles/angular2-polyfills',
      'angular2/bootstrap',
      'angular2/platform/browser',
      'angular2/platform/common_dom',
      'angular2/core',
      'angular2/router',
      'angular2/http',
      'firebase',
      'ng2-firebase-observables/ng2-firebase-observables'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/',
    sourceMapFilename: '[name].[hash].js.map',
    chunkFilename: '[id].chunk.js'
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },

  plugins: plugins,

  module: {
    rules: [
      { test: /\.ts$/, loader: 'tslint-loader', enforce: 'pre' },
      { test: /\.ts$/,                      loader: 'ts-loader',    exclude: /node_modules/ },
      { test: /\.html$/,                    loader: 'exports-loader?module.exports.toString()!html-loader' },
      { test: /\.css$/,                     loader: 'exports-loader?module.exports.toString()!css-loader' },
      { test: /\.scss$/,                    loader: 'exports-loader?module.exports.toString()!css-loader!sass-loader' },
      { test: /\.(svg|eot|woff|woff2|ttf)/, loader: 'file-loader?name=fonts/[name].[ext]' },
      { test: /\.(jpeg|jpg|png|gif)/,       loader: 'file-loader?name=[path][name].[ext]&attrs=img:src link:href' }
    ],
    noParse: [ /zone\.js\/dist\/.+/, /angular2\/bundles\/.+/ ]
  }

}
