import { describe, expect, it, vi } from 'vitest'
import { getHtmlWebpackPlugin } from '../src/helper/getHtmlWebpackPlugin'

describe('expect get HtmlWebpackPlugin', () => {
  it('get HtmlWebpackPlugin', async () => {
    const HtmlWebpackPlugin = await getHtmlWebpackPlugin()
    expect(HtmlWebpackPlugin).not.toBeNull()
  })

  it('failed get HtmlWebpackPlugin', async () => {
    vi.doMock('html-webpack-plugin', () => {})
    try {
      await getHtmlWebpackPlugin()
    }
    catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('failed get HtmlWebpackPlugin don\'t throw', async () => {
    vi.doMock('html-webpack-plugin', () => {})
    const result = await getHtmlWebpackPlugin(false)
    expect(result).toBeFalsy()
  })
})
