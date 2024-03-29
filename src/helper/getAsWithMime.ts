import type { UnpluginLogger } from '../types'

export function getAsWithMime(mime: string, log: UnpluginLogger | Console): RequestDestination | undefined {
  let destination = mime.split('/')[0] as RequestDestination
  const validDestinations: RequestDestination[] = [
    'audio',
    'audioworklet',
    'document',
    'embed',
    'font',
    'frame',
    'iframe',
    'image',
    'manifest',
    'object',
    'paintworklet',
    'report',
    'script',
    'sharedworker',
    'style',
    'track',
    'video',
    'worker',
    'xslt',
  ]

  if (['text/css'].includes(mime))
    destination = 'style'
  else if (['application/javascript'].includes(mime))
    destination = 'script'
  else if (['text/vtt'].includes(mime))
    destination = 'track'

  if (validDestinations.includes(destination))
    return destination

  log.warn(
    `[unplugin-inject-preload] No valid destinations for "${mime}". Define the 'as' attribute.`,
  )
  return undefined
}
