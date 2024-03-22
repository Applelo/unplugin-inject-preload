/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */

import unplugin from './index'

/**
 * Rspack plugin
 *
 * @example
 * ```ts
 * // rspack.config.js
 * const HtmlWebpackPlugin = require('html-webpack-plugin')
 * const UnpluginInjectPreload = require('unplugin-inject-preload/rspack')
 *
 * module.exports = {
 *   plugins: [
 *     HtmlWebpackPlugin({ your_options }),
 *     UnpluginInjectPreload({ your_options }),
 *   ]
 * }
 * ```
 */
export default unplugin.rspack
