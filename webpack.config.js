const webpack = require('webpack');
const Path = require('path');

module.exports =   {
  mode: 'development',
  entry: {
    TestEntry: './src/test/test-entry.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'window',
    path: Path.join(__dirname, 'dist', 'assets'),
    publicPath: '/assets',
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    winston: 'empty'
  },
  plugins: [
    new webpack.IgnorePlugin(/jsdom/),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    port: 1338
  },
};
