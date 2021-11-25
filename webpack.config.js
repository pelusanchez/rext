const path = require('path');
const modulesPath = path.resolve(__dirname, 'node_modules');
const srcPath = path.resolve(__dirname, 'src');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      { 
          test: /\.(vert|frag)$/i,
          use: 'raw-loader',
          include: srcPath,
          exclude: modulesPath,
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    library: "RextEditor",
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: false,
    port: 9000,
    hot: true,
  },
};
