import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { Configuration } from 'webpack'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import UnpluginInjectPreload from './../src/webpack'
import type { Options } from './../src/types'
import configs from './fixtures/configs'

async function buildWebpack(pluginConfig: Options, config: Configuration = {}) {
  return new Promise(((resolve, reject) => {
    const compiler = webpack({
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
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },
          // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
          {
            test: /\.([cm]?ts|tsx)$/,
            loader: 'ts-loader',
          },
        ],
      },
      plugins: [
        new MiniCssExtractPlugin(),
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

      const statsErrors = stats ? stats.compilation.errors : []
      if (statsErrors.length > 0) {
        console.error(statsErrors)
        reject(statsErrors)
      }

      const result = readFileSync(
        join(__dirname, 'fixtures/webpack/dist/index.html'),
        'utf8',
      )

      resolve(result)
    })
  }))
}

describe('excerpt webpack', () => {
  for (const key in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, key)) {
      const config = configs[key] as Options
      it(`test ${key}`, async () => {
        const output = await buildWebpack(config)
        expect(output).toMatchSnapshot()
      })

      it(`test ${key} with basePath`, async () => {
        const output = await buildWebpack(config, { output: { publicPath: '/base' } })
        expect(output).toMatchSnapshot()
      })
    }
  }
})
