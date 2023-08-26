import type { Options } from './../../src/types'

export default {
  injectBottom: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
      },
      {
        match: /lazy.[a-z-0-9]*.(css|js)$/,
      },
    ],
    injectTo: 'head',
  },
  customAttributes: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
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
        match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
      },
      {
        match: /lazy.[a-z-0-9]*.(css|js)$/,
      },
    ],
  },
  customPosition: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
        attributes: {
          'data-vite-plugin-inject-preload': true,
        },
      },
      {
        match: /lazy.[a-z-0-9]*.(css|js)$/,
      },
    ],
    injectTo: 'custom',
  },
  wrongAttributes: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
        attributes: {
          href: './yolo.woff2',
        },
      },
    ],
  },
  noType: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
        attributes: {
          type: undefined,
        },
      },
    ],
  },
  modulepreload: {
    files: [
      {
        match: /lazy.[a-z-0-9]*.(js)$/,
        attributes: {
          rel: 'modulepreload',
        },
      },
    ],
  },
} satisfies Record<string, Options>
