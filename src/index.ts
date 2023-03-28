import { createUnplugin } from 'unplugin'
import type { HtmlTagDescriptor, IndexHtmlTransformContext } from 'vite'
import type { Options } from './types'
import { getHTMLWebpackPlugin } from './helper/getHTMLWebpackPlugin'
import { getTagsAttributes } from './helper/getTagsAttributes'
import { serializeTags } from './helper/serializer'

const customInject = /([ \t]*)<!--__unplugin-inject-preload__-->/i
let viteBasePath:string

export default createUnplugin<Options>(options => ({
  name: 'unplugin-inject-preload',
  vite: {
    apply: 'build',
    configResolved(config) {
      // Base path is sanitized by vite with the final trailing slash
      viteBasePath = config.base
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        const bundle: IndexHtmlTransformContext['bundle'] = ctx.bundle
        // ignore next because the bundle will be always here on build
        /* c8 ignore next */
        if (!bundle)
          return html

        const injectTo =
          options.injectTo && options.injectTo !== 'custom'
            ? options.injectTo
            : 'head-prepend'

        const assets = new Set(Object.keys(bundle)
          .sort())

        const tags: HtmlTagDescriptor[] = []
        const tagsAttributes = getTagsAttributes(assets, options, viteBasePath)

        tagsAttributes.forEach(attrs => {
          tags.push({
            tag: 'link',
            attrs,
            injectTo
          })
        })

        if (options.injectTo === 'custom') {
          return html.replace(
            customInject,
            (match, p1) => `\n${serializeTags(tags, p1)}`
          )
        } else {
          return tags
        }
      },
    },
  },
  webpack: async (compiler) => {
    const HTMLWebpackPlugin = await getHTMLWebpackPlugin()

    compiler.hooks.compilation.tap('unplugin-inject-preload', (compilation) => {
      const hooks = HTMLWebpackPlugin.getHooks(compilation);

      hooks.alterAssetTagGroups.tapAsync(
        'unplugin-inject-preload',
        (data, cb) => {
          const assets = new Set(Object.keys(compilation.assets));
          compilation.chunks.forEach(chunk => {
            chunk.files.forEach((file: string) => assets.add(file));
          });

          const tags = data.headTags
          const tagsAttributes = getTagsAttributes(assets, options, data.publicPath)

          data.headTags = tags
          cb(null, data)
        }
      )
    })
  },
}))
