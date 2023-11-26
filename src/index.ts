import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { IndexHtmlTransformContext, Logger } from 'vite'
import type { Options } from './types'
import { htmlRspackPluginAdapter } from './adapter/HtmlRspackPlugin'
import { htmlWebpackPluginAdapter } from './adapter/HtmlWebpackPlugin'
import { viteAdapter } from './adapter/vite'
import { checkPluginsDeps } from './helper/checkPluginsDeps'

let viteBasePath: string
let viteLogger: Logger
const name = 'unplugin-inject-preload'

export const unpluginFactory: UnpluginFactory<Options> = options => ({
  name,
  vite: {
    apply: 'build',
    configResolved(config) {
      // Base path is sanitized by vite with the final trailing slash
      viteBasePath = config.base
      viteLogger = config.logger
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle: IndexHtmlTransformContext['bundle'] = ctx.bundle

        // ignore next because the bundle will be always here on build
        /* c8 ignore next */
        if (!bundle)
          return html

        return viteAdapter({
          bundle,
          html,
          options,
          viteBasePath,
          viteLogger,
        })
      },
    },
  },
  webpack: (compiler) => {
    checkPluginsDeps(name, compiler, ['HtmlWebpackPlugin'])

    htmlWebpackPluginAdapter({
      name,
      compiler,
      options,
    })
  },
  rspack: (compiler) => {
    checkPluginsDeps(name, compiler, ['HtmlWebpackPlugin', 'HtmlRspackPlugin'])

    const adapterObj = {
      name,
      compiler,
      options,
    }
    htmlRspackPluginAdapter(adapterObj)
    htmlWebpackPluginAdapter(adapterObj)
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
