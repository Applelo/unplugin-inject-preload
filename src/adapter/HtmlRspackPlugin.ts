import type { Compiler } from '@rspack/core/dist/Compiler'
import type { HtmlTagDescriptor } from 'vite'
import type { Options } from '../types'
import pkgWebpackSources from 'webpack-sources'
import { getAssetsForWebpackOrRspack } from '../helper/getAssets'
import { getTagsAttributes } from '../helper/getTagsAttributes'
import { injectToCustom, injectToHead } from '../helper/html'

const { RawSource } = pkgWebpackSources

export function htmlRspackPluginAdapter(args: {
  name: string
  compiler: Compiler
  options: Options
}) {
  const { name, compiler, options } = args
  const injectTo = options.injectTo || 'head-prepend'

  compiler.hooks.emit.tapAsync(name, (compilation, callback) => {
    const pluginInstances = compilation.options.plugins.filter(plugin => plugin && plugin.name === 'HtmlRspackPlugin')
    if (!pluginInstances)
      return callback()

    const filenames: string[] = pluginInstances.flatMap(item => item && '_args' in item ? [item._args.filename || 'index.html'] : [])

    if (filenames.length === 0)
      return callback()

    const logger = compilation.getLogger(name)
    const assets = getAssetsForWebpackOrRspack(compilation)
    const tags: HtmlTagDescriptor[] = []

    const publicPath = compilation.getPath(
      compilation.outputOptions.publicPath || '',
    )

    const tagsAttributes = getTagsAttributes(
      assets,
      options,
      publicPath,
      logger,
    )

    tagsAttributes.forEach((attrs) => {
      tags.push({
        tag: 'link',
        attrs,
      })
    })

    filenames.forEach((filename) => {
      const asset = compilation.getAsset(filename)
      if (!asset)
        return
      const currentSourceString = asset.source.source()
      if (typeof currentSourceString !== 'string')
        return
      let updateSourceString: string

      if (injectTo === 'custom') {
        updateSourceString = injectToCustom(currentSourceString, tags)
      }
      else {
        updateSourceString = injectToHead(
          currentSourceString,
          tags,
          injectTo === 'head-prepend',
        )
      }

      const source = new RawSource(updateSourceString)

      compilation.updateAsset(
        asset.name,
        // @ts-expect-error Same source as webpack-sources
        source,
        asset.info,
      )
    })

    callback()
  })
}
