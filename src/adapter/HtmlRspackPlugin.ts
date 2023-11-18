import type { Compiler } from '@rspack/core/dist/Compiler'
import { RawSource } from 'webpack-sources'
import type { Options } from '../types'

export function htmlRspackPluginAdapter(args: {
  name: string
  compiler: Compiler
  options: Options
  customInject: RegExp
}) {
  const { name, compiler, options, customInject } = args

  compiler.hooks.emit.tapAsync(name, (compilation, callback) => {
    const asset = compilation.getAsset('index.html')
    if (!asset)
      return

    const currentSourceString = asset.source.source()
    if (typeof currentSourceString !== 'string')
      return
    const data = currentSourceString.replace('<!--__unplugin-inject-preload__-->', 'cheese')

    const newSource = new RawSource(data)

    compilation.updateAsset(asset.name, newSource, asset.info)
    callback()
  })
}
