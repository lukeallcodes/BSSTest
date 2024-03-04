const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { AngularWebpackPlugin } = require('@ngtools/webpack');
const webpack = require('webpack');
module.exports = {
  entry: './server.ts', // Adjusted entry point to main.ts
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: '@ngtools/webpack',
      },
     
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Add loaders for other file types (images, fonts, etc.) as needed
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new AngularWebpackPlugin({
      tsconfig: './tsconfig.app.json',
      entryModule: './src/app/app.module#AppModule',
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      apiUrl: JSON.stringify('/api'), // Replace with your actual API URL
    }),
  ],

};
