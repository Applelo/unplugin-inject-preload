import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Configuration } from '@rspack/core'
import { rspack } from '@rspack/core'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import UnpluginInjectPreload from './../src/rspack'
import type { Options } from './../src/types'
import configs from './fixtures/configs'

async function buildRspack(pluginConfig: Options, config: Configuration = {}) {
  return new Promise((resolve, reject) => {
    const compiler = rspack({
      mode: 'production',
      context: join(__dirname, 'fixtures/webpack'),
      entry: join(__dirname, 'fixtures/src/main.ts'),
      output: {
        path: join(__dirname, 'fixtures/webpack/dist'),
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
        // @ts-expect-error work as expected
        new HtmlWebpackPlugin({
          minify: false,
          inject: false,
          template: join(__dirname, 'fixtures/webpack/index.html'),
        }),
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

      const result = readFileSync(
        join(__dirname, 'fixtures/webpack/dist/index.html'),
        'utf8',
      )

      resolve(result)
    })
  })
}

describe('excerpt rspack', () => {
  for (const key in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, key)) {
      const config = configs[key]
      it(`test ${key}`, async () => {
        const output = await buildRspack(config)
        expect(output).toMatchSnapshot()
      }, 8000)

      it(`test ${key} with basePath`, async () => {
        const output = await buildRspack(config, { output: { publicPath: '/base' } })
        expect(output).toMatchSnapshot()
      }, 8000)
    }
  }
})
