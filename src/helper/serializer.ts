import type { HtmlTagDescriptor } from 'vite'

// From https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/html.ts
// Modified to keep only unary tags supports
const serializeAttrs = (attrs: HtmlTagDescriptor['attrs']): string => {
  let res = ''
  for (const key in attrs) {
    if (typeof attrs[key] === 'boolean')
      res += attrs[key] ? ` ${key}` : ''

    else
      res += ` ${key}=${JSON.stringify(attrs[key])}`
  }
  return res
}

const serializeTag = ({ tag, attrs }: HtmlTagDescriptor): string => {
  return `<${tag}${serializeAttrs(attrs)}>`
}

export const serializeTags = (
  tags: HtmlTagDescriptor[],
  indent = '',
): string => {
  return tags.map(tag => `${indent}${serializeTag(tag)}\n`).join('')
}
