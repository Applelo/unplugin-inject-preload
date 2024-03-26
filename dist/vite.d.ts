import * as vite from 'vite';
import { Options } from './types.js';
import 'webpack';
import '@rspack/core';

/**
 * This entry file is for Vite plugin.
 *
 * @module
 */
/**
 * Vite plugin
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import UnpluginInjectPreload from 'unplugin-inject-preload/vite'
 *
 * export default defineConfig({
 *   plugins: [
 *     UnpluginInjectPreload({ your_options }),
 *   ],
 * })
 * ```
 */
declare const _default: (options: Options) => vite.Plugin<any> | vite.Plugin<any>[];

export { _default as default };
