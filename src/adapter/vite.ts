import type { HtmlTagDescriptor, Logger } from 'vite'
import type { OutputBundle } from 'rollup'
import { getAssetsForViteJS } from '../helper/getAssets'
import type { Options } from '../types'
import { getTagsAttributes } from '../helper/getTagsAttributes'
import { injectToCustom } from '../helper/html'

export function viteAdapter(args: {
  bundle: OutputBundle
  html: string
  options: Options
  viteBasePath: string
  viteLogger: Logger
}) {
  const {
    bundle,
    html,
    options,
    viteBasePath,
    viteLogger,
  } = args

  const injectTo
          = (options.injectTo && options.injectTo !== 'custom')
            ? options.injectTo
            : 'head-prepend'

  const assets = getAssetsForViteJS(bundle)
  const tags: HtmlTagDescriptor[] = []
  const tagsAttributes = getTagsAttributes(
    assets,
    options,
    viteBasePath,
    viteLogger,
  )

  tagsAttributes.forEach((attrs) => {
    tags.push({
      tag: 'link',
      attrs,
      injectTo,
    })
  })

  if (options.injectTo === 'custom')
    return injectToCustom(html, tags)
  else
    return tags
}
