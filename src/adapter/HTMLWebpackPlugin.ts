import type { Compilation, Compiler } from 'webpack'
import type { HtmlTagDescriptor } from 'vite'
import type { RspackCompiler } from 'unplugin'
import { getHTMLWebpackPlugin } from '../helper/getHTMLWebpackPlugin'
import type { AssetsSet, Options } from '../types'
import { getTagsAttributes } from '../helper/getTagsAttributes'
import { serializeTags } from '../helper/serializer'

export function htmlWebpackPluginAdapter(args: {
  name: string
  compiler: Compiler | RspackCompiler
  options: Options
  customInject: RegExp
}) {
  const { name, compiler, options, customInject } = args
  compiler.hooks.compilation.tap(name, async (compilation) => {
    const logger = compilation.getLogger(name)
    const HTMLWebpackPlugin = await getHTMLWebpackPlugin()
    const hooks = HTMLWebpackPlugin.default.getHooks(compilation as Compilation)
    let tagsAttributes: any[] = []

    hooks.alterAssetTagGroups.tapAsync(
      name,
      (data, cb) => {
        let outputs: string[] = []
        const assets: AssetsSet = new Set()
        let assetsInfo: Compilation['assetsInfo'] = new Map()

        // webpack
        if ('assetsInfo' in compilation) {
          assetsInfo = compilation.assetsInfo
          outputs = Array.from(compilation.assetsInfo.keys()).sort()
        }
        // rspack
        else {
          const assetsStats = compilation.getStats().toJson({ all: false, assets: true }).assets || []
          assetsInfo = new Map(assetsStats.map(asset => [asset.name, asset.info]))
          outputs = Array.from(assetsStats.map(asset => asset.name)).sort()
        }

        outputs.forEach((output) => {
          const entry = assetsInfo.get(output)?.sourceFilename || ''
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
}
