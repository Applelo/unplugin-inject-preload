const path = require('node:path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UnpluginInjectPreload = require('unplugin-inject-preload/webpack').default

module.exports = {
  entry: path.resolve(__dirname, './../src/main.ts'),
  output: {
    publicPath: 'dist',
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      minify: false,
      templateContent: ({ htmlWebpackPlugin }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <!--__unplugin-inject-preload__-->
          ${htmlWebpackPlugin.tags.headTags}
        </head>
        <body>
          <h1>Hello World</h1>
          ${htmlWebpackPlugin.tags.bodyTags}
        </body>
      </html>
    `,
    }),
    UnpluginInjectPreload({
      injectTo: 'custom',
      files: [
        {
          outputmatch: /Roboto-[a-zA-Z]*.[a-z-0-9]*\.woff2$/,
        },
        {
          outputMatch: /^(?!main).*\.(css|js)$/,
        },
      ],
    }),
  ],
}
