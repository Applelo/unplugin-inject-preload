import type { Compilation } from 'webpack'
import type { HtmlTagDescriptor } from 'vite'
import { getHtmlWebpackPlugin } from '../helper/getHtmlWebpackPlugin'
import type { Options, UnpluginCompiler } from '../types'
import { getTagsAttributes } from '../helper/getTagsAttributes'
import { injectToCustom } from '../helper/html'
import { getAssetsForWebpackOrRspack } from '../helper/getAssets'

export function htmlWebpackPluginAdapter(args: {
  name: string
  compiler: UnpluginCompiler
  options: Options
}) {
  const { name, compiler, options } = args
  compiler.hooks.compilation.tap(name, async (compilation) => {
    const isWebpack = 'assetsInfo' in compilation
    const logger = compilation.getLogger(name)
    const HtmlWebpackPlugin = await getHtmlWebpackPlugin(isWebpack)
    if (!HtmlWebpackPlugin)
      return

    const hooks = HtmlWebpackPlugin.default.getHooks(compilation as Compilation)
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

          data.html = injectToCustom(data.html, tags)
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
