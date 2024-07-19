const rspack = require('@rspack/core')
const UnpluginInjectPreload = require('unplugin-inject-preload/rspack').default
// const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    // new HtmlWebpackPlugin({
    //   inject: false,
    //   minify: false,
    //   templateContent: ({ htmlWebpackPlugin }) => `
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <!--__unplugin-inject-preload__-->
    //       ${htmlWebpackPlugin.tags.headTags}
    //     </head>
    //     <body>
    //       <h1>Hello World</h1>
    //       ${htmlWebpackPlugin.tags.bodyTags}
    //     </body>
    //   </html>
    // `,
    // }),
    UnpluginInjectPreload({
      injectTo: 'custom',
      files: [
        {
          outputMatch: /Roboto-(?:[^\n\rA-Za-z\u2028\u2029][-\da-z]*|[A-Za-z]+(?:[^\n\rA-Za-z\u2028\u2029][-\da-z]*)?)\.woff2$/,
        },
        {
          outputMatch: /^(?!main).*\.(css|js)$/,
        },
      ],
    }),
  ],
}
module.exports = config
