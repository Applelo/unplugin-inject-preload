import type { OutputBundle } from 'rollup'
import type { Compilation as WebpackCompilation } from 'webpack'
import type { AssetsSet, UnpluginCompilation } from './../types'

export function getAssetsForViteJS(bundle: OutputBundle) {
  const assets: AssetsSet = new Set()
  const outputs = Object.keys(bundle).sort()
  outputs.forEach((output) => {
    const entry = bundle[output].name || ''
    assets.add({ entry, output })
  })

  return assets
}

export function getAssetsForWebpackOrRspack(
  compilation: UnpluginCompilation,
) {
  const assets: AssetsSet = new Set()
  const isWebpack = 'assetsInfo' in compilation
  let outputs: string[] = []
  let assetsInfo: WebpackCompilation['assetsInfo'] = new Map()

  // webpack
  if (isWebpack) {
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

  return assets
}
