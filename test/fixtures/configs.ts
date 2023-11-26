import type { Options } from './../../src/types'

export default {
  injectBottom: {
    files: [
      {
        outputMatch: /Roboto-[a-zA-Z]*-[a-zA-Z-0-9]*\.woff2$/,
      },
      {
        outputMatch: /lazy.[a-zA-Z-0-9]*.(css|js)$/,
      },
    ],
    injectTo: 'head',
  },
  customAttributes: {
    files: [
      {
        outputMatch: /Roboto-[a-zA-Z]*-[a-zA-Z-0-9]*\.woff2$/,
        attributes: {
          'as': 'font',
          'crossorigin': 'anonymous',
          'data-font': 'Roboto',
          'type': 'font/woff2',
        },
      },
    ],
  },
  auto: {
    files: [
      {
        outputMatch: /Roboto-[a-zA-Z]*-[a-zA-Z-0-9]*\.woff2$/,
      },
      {
        outputMatch: /lazy.[a-zA-Z-0-9]*.(css|js)$/,
      },
    ],
  },
  customPosition: {
    files: [
      {
        outputMatch: /Roboto-[a-zA-Z]*-[a-zA-Z-0-9]*\.woff2$/,
        attributes: {
          'data-vite-plugin-inject-preload': true,
        },
      },
      {
        outputMatch: /lazy.[a-zA-Z-0-9]*.(css|js)$/,
      },
    ],
    injectTo: 'custom',
  },
  wrongAttributes: {
    files: [
      {
        outputMatch: /Roboto-[a-zA-Z]*-[a-zA-Z-0-9]*\.woff2$/,
        attributes: {
          href: './yolo.woff2',
        },
      },
    ],
  },
  noType: {
    files: [
      {
        outputMatch: /Roboto-[a-zA-Z]*-[a-zA-Z-0-9]*\.woff2$/,
        attributes: {
          type: undefined,
        },
      },
    ],
  },
  modulepreload: {
    files: [
      {
        outputMatch: /lazy.[a-zA-Z-0-9]*.(js)$/,
        attributes: {
          rel: 'modulepreload',
        },
      },
    ],
  },
  entryMatch: {
    files: [
      {
        entryMatch: /Roboto-[a-zA-Z]*\.woff2$/,
      },
    ],
    injectTo: 'head',
  },
  noMatch: {
    files: [
      {
        attributes: {
          rel: 'modulepreload',
        },
      },
    ],
  },
} satisfies Record<string, Options>
