# unplugin-inject-preload

[![NPM version](https://img.shields.io/npm/v/unplugin-inject-preload?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-inject-preload)

This plugin adds preload links.

Supporting:
- Vite 3 and 4 (on build only)
- Webpack 5 (with HTMLWebpackPlugin 5)
<!-- - Rspack -->
<!-- - Nuxt 3 -->

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
import UnpluginInjectPreload from '../../src/vite'

export default defineConfig({
  plugins: [
    UnpluginInjectPreload({ /* options */ }),
  ],
})
```

Example: [`playground/vitejs`](./playground/vitejs)

<br></details>

<details>
<summary>Webpack 5 (with HTMLWebpackPlugin 5)</summary><br>

```ts
// webpack.config.js
module.exports = {
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
import UnpluginInjectPreload from 'unplugin-inject-preload'

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
import UnpluginInjectPreload from 'unplugin-inject-preload'

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
          rel: 'modulepreload',
          type: undefined,
          match: /lazy.[a-z-0-9]*.(js)$/,
        }
      ],
      injectTo: 'head-prepend'
    })
  ]
}
```

## 👨‍💼 Licence

MIT