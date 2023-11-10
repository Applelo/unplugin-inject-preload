const rspack = require('@rspack/core')

/** @type {import('@rspack/cli').Configuration} */
const config = {
  context: __dirname,
  entry: './../src/main.ts',
  output: {
    publicPath: 'dist',
    filename: 'main.js',
    path: 'dist',
    clean: true,
    assetModuleFilename: '[name].[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        type: 'css',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      minify: false,
      templateContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <!--__unplugin-inject-preload__-->
        </head>
        <body>
          <h1>Hello World</h1>
        </body>
      </html>`,
    }),
  ],
}
module.exports = config
