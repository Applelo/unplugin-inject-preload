import * as webpack from 'webpack';
import { Options } from './types.js';
import 'vite';
import '@rspack/core';

/**
 * This entry file is for Webpack plugin.
 *
 * @module
 */
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
declare const _default: (options: Options) => webpack.WebpackPluginInstance;

export { _default as default };
