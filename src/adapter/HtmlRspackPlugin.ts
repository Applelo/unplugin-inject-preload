import type { Compiler } from '@rspack/core/dist/Compiler'
import pkgWebpackSources from 'webpack-sources'
import type { HtmlTagDescriptor } from 'vite'
import type { Options } from '../types'
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

    const filenames: string[] = pluginInstances.flatMap(item => item && '_options' in item ? [item._options.filename || 'index.html'] : [])
    if (filenames.length === 0)
      return callback()

    const logger = compilation.getLogger(name)
    const assets = getAssetsForWebpackOrRspack(compilation)
    const tags: HtmlTagDescriptor[] = []
    const tagsAttributes = getTagsAttributes(
      assets,
      options,
      compilation.outputOptions.publicPath || '',
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

      compilation.updateAsset(
        asset.name,
        new RawSource(updateSourceString),
        asset.info,
      )
    })

    callback()
  })
}
