import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { HtmlTagDescriptor, IndexHtmlTransformContext, Logger } from 'vite'
import type { Options } from './types'
import { getTagsAttributes } from './helper/getTagsAttributes'
import { serializeTags } from './helper/serializer'
import { getAssetsForViteJS } from './helper/getAssets'
import { htmlRspackPluginAdapter } from './adapter/HtmlRspackPlugin'
import { htmlWebpackPluginAdapter } from './adapter/HTMLWebpackPlugin'

const customInject = /([ \t]*)<!--__unplugin-inject-preload__-->/i
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

        const injectTo
          = (options.injectTo && options.injectTo !== 'custom')
            ? options.injectTo
            : 'head-prepend'

        const assets = getAssetsForViteJS(bundle)
        const tags: HtmlTagDescriptor[] = []
        const tagsAttributes = getTagsAttributes(
          assets,
          options,
          viteBasePath,
          viteLogger,
        )

        tagsAttributes.forEach((attrs) => {
          tags.push({
            tag: 'link',
            attrs,
            injectTo,
          })
        })

        if (options.injectTo === 'custom') {
          return html.replace(
            customInject,
            (match, p1) => `\n${serializeTags(tags, p1)}`,
          )
        }
        else {
          return tags
        }
      },
    },
  },
  webpack: (compiler) => {
    htmlWebpackPluginAdapter({
      name,
      compiler,
      options,
      customInject,
    })
  },
  rspack: (compiler) => {
    htmlRspackPluginAdapter({
      name,
      compiler,
      options,
      customInject,
    })

    htmlWebpackPluginAdapter({
      name,
      compiler,
      options,
      customInject,
    })
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
