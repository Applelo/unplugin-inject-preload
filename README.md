# unplugin-inject-preload

[![NPM version](https://img.shields.io/npm/v/unplugin-inject-preload?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-inject-preload) [![node-current](https://img.shields.io/node/v/unplugin-inject-preload)](https://nodejs.org/) [![Coverage Status](https://coveralls.io/repos/github/Applelo/unplugin-inject-preload/badge.svg?branch=main)](https://coveralls.io/github/Applelo/unplugin-inject-preload?branch=main)

This plugin adds preload links by getting output assets from the build tools you are using.

Supporting:
- Vite 3 and 4 (on build only)
- Webpack 5 (with HTMLWebpackPlugin 5)
<!-- - Rspack -->

> This plugin combines [vite-plugin-inject-preload](https://github.com/Applelo/vite-plugin-inject-preload) and [html-webpack-inject-preload](https://github.com/principalstudio/html-webpack-inject-preload) into one package.

> See the [migration guide](#migrate) for `vite-plugin-inject-preload` and `html-webpack-inject-preload` .

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
          entryMatch: /Roboto-[a-zA-Z]*\.woff2$/,
        },
        {
          outputMatch: /lazy.[a-z-0-9]*.(css|js)$/,
        }
      ]
    })
  ]
}
```

### Options

* files: An array of files object
  * entryMatch: A regular expression to target entry files you want to preload
  * outputMatch: A regular expression to target output build files you want to preload
  > You need to set at least `entryMatch` or/and `outputMatch`. Be aware that entry file is not always present for webpack and `entryMatch` will do nothing.

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
          entryMatch: /Roboto-[a-zA-Z]*\.woff2$/,
          outputMatch: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
          attributes: {
            'type': 'font/woff2',
            'as': 'font',
            'crossorigin': 'anonymous',
            'data-font': 'Roboto'
          }
        },
        {
          outputMatch: /lazy.[a-z-0-9]*.(js)$/,
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

## Migration

### From vite-plugin-inject-preload

`package.json`

```diff
{
  "devDependencies": {
-   "vite-plugin-inject-preload": "*",
+   "unplugin-inject-preload": "^1.1.0",
  }
}
```

`vite.config.js`

```diff
- import VitePluginInjectPreload from 'vite-plugin-inject-preload'
+ import UnpluginInjectPreload from 'unplugin-inject-preload/vite'

export default {
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
-         match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
+         outputMatch: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
          attributes: {
            'type': 'font/woff2',
            'as': 'font',
            'crossorigin': 'anonymous',
            'data-font': 'Roboto'
          }
        },
      ],
      injectTo: 'head-prepend'
    })
  ]
}
```

### From html-webpack-inject-preload

`package.json`

```diff
{
  "devDependencies": {
-   "@principalstudio/html-webpack-inject-preload": "*",
+   "unplugin-inject-preload": "^1.1.0",
  }
}
```

```diff
const HtmlWebpackPlugin = require('html-webpack-plugin');
- const HtmlWebpackInjectPreload = require('@principalstudio/html-webpack-inject-preload');
+ const UnpluginInjectPreload = require('unplugin-inject-preload/webpack');

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin(),
-   new HtmlWebpackInjectPreload({
+   UnpluginInjectPreload({
      files: [
        {
-         match: /.*\.woff2$/,
+         outputMatch: /.*\.woff2$/,
          attributes: {
            as: 'font',
            type: 'font/woff2', crossorigin: true
          },
        },
      ]
    })
  ]
}
```

## 👨‍💼 Licence

MIT
