import { resolve } from 'node:path'
import type { OutputAsset, RollupOutput } from 'rollup'
import { type InlineConfig, build } from 'vite'
import { describe, expect, it } from 'vitest'
import UnpluginInjectPreload from './../src/vite'
import type { Options } from './../src/types'
import configs from './fixtures/configs'

async function buildVite(pluginConfig: Options, config: InlineConfig = {}) {
  const { output } = (await build({
    root: resolve(__dirname, './fixtures/vitejs'),
    plugins: [UnpluginInjectPreload(pluginConfig)],
    ...config,
  })) as RollupOutput

  const { source: indexSource } = output.find(
    item => item.fileName === 'index.html',
  ) as OutputAsset

  return indexSource.toString()
}

describe('expect vitejs', () => {
  for (const key in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, key)) {
      const config = configs[key]
      it(`test ${key}`, async () => {
        const output = await buildVite(config)
        expect(output).toMatchSnapshot()
      })

      it.concurrent(`test ${key} with basePath`, async () => {
        const output = await buildVite(config, { base: '/base' })
        expect(output).toMatchSnapshot()
      })
    }
  }
})
