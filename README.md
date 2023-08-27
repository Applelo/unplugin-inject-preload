# unplugin-inject-preload

[![NPM version](https://img.shields.io/npm/v/unplugin-inject-preload?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-inject-preload) [![node-current](https://img.shields.io/node/v/unplugin-inject-preload)](https://nodejs.org/) [![Coverage Status](https://coveralls.io/repos/github/Applelo/unplugin-inject-preload/badge.svg?branch=main)](https://coveralls.io/github/Applelo/unplugin-inject-preload?branch=main)

This plugin adds preload links by getting output assets from the build tools your using.

Supporting:
- Vite 3 and 4 (on build only)
- Webpack 5 (with HTMLWebpackPlugin 5)
<!-- - Rspack -->

> This plugin combines [vite-plugin-inject-preload](https://github.com/Applelo/vite-plugin-inject-preload) and [html-webpack-inject-preload](https://github.com/principalstudio/html-webpack-inject-preload) into one package.

## Install

```bash
#npm
npm i -D unplugin-inject-preload
#yarn
yarn add -D unplugin-inject-preload
#pnpm
pnpm i -D unplugin-inject-preload
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import UnpluginInjectPreload from 'unplugin-inject-preload/vite'

export default defineConfig({
  plugins: [
    UnpluginInjectPreload({ /* options */ }),
  ],
})
```

Example: [`playground/vitejs`](./playground/vitejs)

<br></details>

<details>
<summary>Webpack (with HTMLWebpackPlugin)</summary><br>

```ts
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UnpluginInjectPreload = require('unplugin-inject-preload/webpack')

module.exports = {
  plugins: [
    HtmlWebpackPlugin(),
    UnpluginInjectPreload({ /* options */ }),
  ]
}
```

Example: [`playground/webpack`](./playground/webpack)

<br></details>

## 👨‍💻 Usage

All the files needs to be process by the bundler to be find by the plugin. For example, if I load this CSS file :

```css
@font-face {
  font-family: 'Roboto';
  src: url('./../fonts/Roboto-Italic.woff2');
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: 'Roboto';
  src: url('./../fonts/Roboto-Regular.woff2');
  font-weight: 400;
  font-style: normal;
}
```

I can make the following configuration for UnpluginInjectPreload :

```js
// vite.config.js / vite.config.ts
import UnpluginInjectPreload from 'unplugin-inject-preload/vite'

export default {
  plugins: [
    UnpluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/
        },
        {
          match: /lazy.[a-z-0-9]*.(css|js)$/,
        }
      ]
    })
  ]
}
```

### Options

* files: An array of files object
  * match: A regular expression to target build files you want to preload
  * attributes (optional):
  If this option is ommited, it will determine the `mime` and the `as` attributes automatically.
  You can also add/override any attributes you want.
* injectTo (optional): By default, the preload links are injected with the `'head-prepend'` options. But you can pass `'head'` to inject preload links at bottom of the head tag if you need it.<br> You can pass the `'custom'` option and put `<!--__unplugin-inject-preload__-->` in your `.html` file where you want to inject the preload links.

With the full options usage, you can do something like this :

```js
// vite.config.js / vite.config.ts
import UnpluginInjectPreload from 'unplugin-inject-preload/vite'

export default {
  plugins: [
    UnpluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
          attributes: {
            'type': 'font/woff2',
            'as': 'font',
            'crossorigin': 'anonymous',
            'data-font': 'Roboto'
          }
        },
        {
          match: /lazy.[a-z-0-9]*.(js)$/,
          attributes: {
            rel: 'modulepreload',
            type: undefined,
          }
        }
      ],
      injectTo: 'head-prepend'
    })
  ]
}
```

## 👨‍💼 Licence

MIT
