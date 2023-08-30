import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { HtmlTagDescriptor, IndexHtmlTransformContext } from 'vite'
import type { AssetsSet, Options, UnpluginLogger } from './types'
import { getHTMLWebpackPlugin } from './helper/getHTMLWebpackPlugin'
import { getTagsAttributes } from './helper/getTagsAttributes'
import { serializeTags } from './helper/serializer'

const customInject = /([ \t]*)<!--__unplugin-inject-preload__-->/i
let viteBasePath: string
let logger: UnpluginLogger
const name = 'unplugin-inject-preload'

export const unpluginFactory: UnpluginFactory<Options> = options => ({
  name,
  vite: {
    apply: 'build',
    configResolved(config) {
      // Base path is sanitized by vite with the final trailing slash
      viteBasePath = config.base
      logger = config.logger
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        const bundle: IndexHtmlTransformContext['bundle'] = ctx.bundle
        // ignore next because the bundle will be always here on build
        /* c8 ignore next */
        if (!bundle)
          return html

        const injectTo
          = (options.injectTo && options.injectTo !== 'custom')
            ? options.injectTo
            : 'head-prepend'

        const outputs = Object.keys(bundle).sort()
        const assets: AssetsSet = new Set()
        outputs.forEach((output) => {
          const entry = bundle[output].name || ''
          assets.add({ entry, output })
        })

        const tags: HtmlTagDescriptor[] = []
        const tagsAttributes = getTagsAttributes(
          assets,
          options,
          viteBasePath,
          logger,
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
    compiler.hooks.compilation.tap(name, async (compilation) => {
      logger = compilation.logger
      const HTMLWebpackPlugin = await getHTMLWebpackPlugin()
      const hooks = HTMLWebpackPlugin.default.getHooks(compilation)
      let tagsAttributes: any[] = []

      hooks.alterAssetTagGroups.tapAsync(
        name,
        (data, cb) => {
          const outputs = Object.keys(compilation.assetsInfo).sort()
          const assets: AssetsSet = new Set()
          outputs.forEach((output) => {
            const entry = compilation.assetsInfo.get(output)?.sourceFilename || ''
            assets.add({ entry, output })
          })
          tagsAttributes = getTagsAttributes(
            assets,
            options,
            data.publicPath,
            logger,
          )
          cb(null, data)
        },
      )

      if (options.injectTo === 'custom') {
        hooks.beforeEmit.tapAsync(
          name,
          (data, cb) => {
            const tags: HtmlTagDescriptor[] = []
            tagsAttributes.forEach((attrs) => {
              tags.push({
                tag: 'link',
                attrs,
              })
            })

            data.html = data.html.replace(
              customInject,
              (match, p1) => `\n${serializeTags(tags, p1)}`,
            )
            cb(null, data)
          },
        )
      }
      else {
        hooks.alterAssetTagGroups.tapAsync(
          name,
          (data, cb) => {
            tagsAttributes.forEach((attributes) => {
              data.headTags[
                options.injectTo === 'head'
                  ? 'push'
                  : 'unshift'
              ](
                {
                  tagName: 'link',
                  attributes,
                  voidTag: true,
                  meta: {
                    plugin: name,
                  },
                },
              )
            })

            cb(null, data)
          },
        )
      }
    })
  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
