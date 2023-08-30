import type { HtmlTagDescriptor } from 'vite'
import { lookup as mimeLookup } from 'mime-types'
import type { AssetsSet, Options } from '../types'
import { getAsWithMime } from './getAsWithMime'

export function getTagsAttributes(
  assetsSet: AssetsSet,
  options: Options,
  basePath = '',
  warn = console.warn,
) {
  const tagsAttributes = []
  const assets = Array.from(assetsSet)

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i]

    for (let index = 0; index < options.files.length; index++) {
      const file = options.files[index]
      if (!(file.entryMatch || file.outputMatch)) {
        warn('[unplugin-inject-preload] You should have at least one option between entryMatch and outputMatch.')
        continue
      }
      if (file.outputMatch && !file.outputMatch.test(asset.output))
        continue
      if (file.entryMatch && !file.entryMatch.test(asset.entry))
        continue

      const attrs: HtmlTagDescriptor['attrs'] = file.attributes || {}
      const href = `${basePath}${asset}`
      const type = attrs.type ? attrs.type : mimeLookup(asset.output)
      const as
        = typeof type === 'string' ? getAsWithMime(type) : undefined

      const finalAttrs = Object.assign(
        {
          rel: 'preload',
          href,
          type,
          as,
        },
        attrs,
      )

      // Remove any undefined values
      Object.keys(finalAttrs).forEach(
        key =>
          typeof finalAttrs[key] === 'undefined' && delete finalAttrs[key],
      )

      tagsAttributes.push(finalAttrs)
    }
  }

  return tagsAttributes
}
