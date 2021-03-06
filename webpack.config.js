const path = require('path');
const modulesPath = path.resolve(__dirname, 'node_modules');
const srcPath = path.resolve(__dirname, 'src');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
    path: path.resolve(__dirname, 'lib'),
  },
};
