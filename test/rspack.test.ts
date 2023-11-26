import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Configuration } from '@rspack/core'
import { HtmlRspackPlugin, rspack } from '@rspack/core'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import UnpluginInjectPreload from './../src/rspack'
import type { Options } from './../src/types'
import configs from './fixtures/configs'

async function buildRspack(pluginConfig: Options, plugin: 'HtmlWebpackPlugin' | 'HtmlRspackPlugin' | 'none', config: Configuration = {}) {
  return new Promise((resolve, reject) => {
    let htmlPlugin: any = null

    if (plugin === 'HtmlRspackPlugin') {
      htmlPlugin = new HtmlRspackPlugin({
        title: 'Unplugin Inject Preload',
        minify: false,
        template: join(__dirname, 'fixtures/rspack/htmlRspackPlugin.html'),
      })
    }
    else if (plugin === 'HtmlWebpackPlugin') {
      htmlPlugin = new HtmlWebpackPlugin({
        title: 'Unplugin Inject Preload',
        minify: false,
        template: join(__dirname, 'fixtures/rspack/htmlWebpackPlugin.html'),
      })
    }

    const compiler = rspack({
      mode: 'production',
      context: join(__dirname, 'fixtures/rspack'),
      entry: join(__dirname, 'fixtures/src/main.ts'),
      output: {
        path: join(__dirname, 'fixtures/rspack/dist'),
        publicPath: config.output?.publicPath || '/',
        clean: true,
        assetModuleFilename: '[name]-[hash][ext][query]',
      },
      resolve: {
        extensions: ['.ts', '.js'],
        extensionAlias: {
          '.js': ['.js', '.ts'],
        },
      },
      module: {
        rules: [
          {
            test: /\.css$/i,
            type: 'css',
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },
        ],
      },
      plugins: [
        ...(htmlPlugin ? [htmlPlugin] : []),
        UnpluginInjectPreload(pluginConfig),
      ],
    })

    compiler.run((err, stats) => {
      if (err)
        reject(err)

      const statsErrors = stats ? stats?.toJson().errors : []
      if (statsErrors && statsErrors.length > 0) {
        console.error(statsErrors)
        reject(statsErrors)
      }

      try {
        const result = readFileSync(
          join(__dirname, 'fixtures/rspack/dist/index.html'),
          'utf8',
        )
        resolve(result)
      }
      catch (error) {
        reject(error)
      }
    })
  })
}

describe('expect rspack with HtmlWebpackPlugin', () => {
  for (const key in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, key)) {
      const config = configs[key]
      it(`test ${key}`, async () => {
        const output = await buildRspack(config, 'HtmlWebpackPlugin')
        expect(output).toMatchSnapshot()
      }, 8000)

      it(`test ${key} with basePath`, async () => {
        const output = await buildRspack(config, 'HtmlWebpackPlugin', { output: { publicPath: '/base' } })
        expect(output).toMatchSnapshot()
      }, 8000)
    }
  }
})

describe('expect rspack with HtmlRspackPlugin', () => {
  for (const key in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, key)) {
      const config = configs[key]
      it(`test ${key}`, async () => {
        const output = await buildRspack(config, 'HtmlRspackPlugin')
        expect(output).toMatchSnapshot()
      }, 8000)

      it(`test ${key} with basePath`, async () => {
        const output = await buildRspack(config, 'HtmlRspackPlugin', { output: { publicPath: '/base' } })
        expect(output).toMatchSnapshot()
      }, 8000)
    }
  }
})

it('expect checkDeps to fail', async () => {
  await expect(() => buildRspack(configs.auto, 'none')).rejects.toThrowError()
})
