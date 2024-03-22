/**
 * This entry file is for Vite plugin.
 *
 * @module
 */

import unplugin from './index'

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
export default unplugin.vite
