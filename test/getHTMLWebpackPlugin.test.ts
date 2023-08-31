import { describe, expect, it, vi } from 'vitest'
import { getHTMLWebpackPlugin } from '../src/helper/getHTMLWebpackPlugin'

describe('excerpt get HTMLWebpackPlugin', () => {
  it('get HTMLWebpackPlugin', async () => {
    const HTMLWebpackPlugin = await getHTMLWebpackPlugin()
    expect(HTMLWebpackPlugin).not.toBeNull()
  })

  it('failed get HTMLWebpackPlugin', async () => {
    vi.doMock('html-webpack-plugin', () => {})
    try {
      await getHTMLWebpackPlugin()
    }
    catch (error) {
      expect(error).toBeDefined()
    }
  })
})
