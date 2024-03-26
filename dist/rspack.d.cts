import * as unplugin from 'unplugin';
import { Options } from './types.cjs';
import 'vite';
import 'webpack';
import '@rspack/core';

/**
 * This entry file is for Rspack plugin.
 *
 * @module
 */
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
declare const _default: (options: Options) => unplugin.RspackPluginInstance;

export = _default;
