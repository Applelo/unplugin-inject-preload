import type { HtmlTagDescriptor } from 'vite'
import { lookup as mimeLookup } from 'mime-types'
import type { Options } from '../types'
import { getAsWithMime } from './getAsWithMime'

export const getTagsAttributes = (assetsSet: Set<string>, options: Options, basePath = '') => {
  const tagsAttributes = []
  const assets = Array.from(assetsSet)

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i]

    for (let index = 0; index < options.files.length; index++) {
      const file = options.files[index]
      if (!file.match.test(asset))
        continue

      const attrs: HtmlTagDescriptor['attrs'] = file.attributes || {}
      const href = `${basePath}${asset}`
      const type = attrs.type ? attrs.type : mimeLookup(asset)
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
