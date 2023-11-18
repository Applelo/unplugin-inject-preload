import type { Compilation } from 'webpack'
import type { HtmlTagDescriptor } from 'vite'
import { getHTMLWebpackPlugin } from '../helper/getHTMLWebpackPlugin'
import type { Options, UnpluginCompiler } from '../types'
import { getTagsAttributes } from '../helper/getTagsAttributes'
import { serializeTags } from '../helper/serializer'
import { getAssetsForWebpackOrRspack } from '../helper/getAssets'

export function htmlWebpackPluginAdapter(args: {
  name: string
  compiler: UnpluginCompiler
  options: Options
  customInject: RegExp
}) {
  const { name, compiler, options, customInject } = args
  compiler.hooks.compilation.tap(name, async (compilation) => {
    const isWebpack = 'assetsInfo' in compilation
    const logger = compilation.getLogger(name)
    const HTMLWebpackPlugin = await getHTMLWebpackPlugin(isWebpack)
    if (!HTMLWebpackPlugin)
      return

    const hooks = HTMLWebpackPlugin.default.getHooks(compilation as Compilation)
    let tagsAttributes: any[] = []

    hooks.alterAssetTagGroups.tapAsync(
      name,
      (data, cb) => {
        const assets = getAssetsForWebpackOrRspack(compilation)

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
}
