/**
 * This entry file is for Webpack plugin.
 *
 * @module
 */

import unplugin from './index'

/**
 * Webpack plugin
 *
 * @example
 *```ts
 * // webpack.config.js
 * const HtmlWebpackPlugin = require('html-webpack-plugin')
 * const UnpluginInjectPreload = require('unplugin-inject-preload/webpack')
 *
 * module.exports = {
 *   plugins: [
 *     HtmlWebpackPlugin({ your_options }),
 *     UnpluginInjectPreload({ your_options }),
 *   ]
 * }
 *```
 */
export default unplugin.webpack
