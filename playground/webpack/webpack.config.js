const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UnpluginInjectPreload = require('./../../dist/webpack')

module.exports = {
  entry: path.resolve(__dirname, './../src/main.ts'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: '[name].[hash][ext][query]',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Unplugin Inject Preload',
      template: 'index.html',
      minify: false,
    }),
    new UnpluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
        },
        {
          match: /lazy.[a-z-0-9]*.(css|js)$/,
        },
      ],
    }),
  ],
}
