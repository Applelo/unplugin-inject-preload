import type { HtmlTagDescriptor } from 'vite'

// From https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/html.ts
// Modified to keep only unary tags supports

const customInject = /([ \t]*)<!--__unplugin-inject-preload__-->/i
const headInjectRE = /([ \t]*)<\/head>/i
const headPrependInjectRE = /([ \t]*)<head[^>]*>/i

export function injectToHead(
  html: string,
  tags: HtmlTagDescriptor[],
  prepend = false,
) {
  if (tags.length === 0)
    return html

  if (prepend) {
    // inject as the first element of head
    if (headPrependInjectRE.test(html)) {
      return html.replace(
        headPrependInjectRE,
        (match, p1) => `${match}\n${serializeTags(tags, incrementIndent(p1))}`,
      )
    }
  }
  else {
    // inject before head close
    if (headInjectRE.test(html)) {
      // respect indentation of head tag
      return html.replace(
        headInjectRE,
        (match, p1) => `${serializeTags(tags, incrementIndent(p1))}${match}`,
      )
    }
  }

  return html
}

export function injectToCustom(str: string, tags: HtmlTagDescriptor[]) {
  return str.replace(
    customInject,
    (match, p1) => `\n${serializeTags(tags, p1)}`,
  )
}

function serializeAttrs(attrs: HtmlTagDescriptor['attrs']): string {
  let res = ''
  for (const key in attrs) {
    if (typeof attrs[key] === 'boolean')
      res += attrs[key] ? ` ${key}` : ''
    else
      res += ` ${key}=${JSON.stringify(attrs[key])}`
  }
  return res
}

function serializeTag({ tag, attrs }: HtmlTagDescriptor): string {
  return `<${tag}${serializeAttrs(attrs)}>`
}

export function serializeTags(tags: HtmlTagDescriptor[], indent = ''): string {
  return tags.map(tag => `${indent}${serializeTag(tag)}\n`).join('')
}

function incrementIndent(indent: string = '') {
  return `${indent}${indent[0] === '\t' ? '\t' : '  '}`
}
