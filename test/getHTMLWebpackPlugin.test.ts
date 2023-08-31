import { describe, expect, it } from 'vitest'
import { getHTMLWebpackPlugin } from '../src/helper/getHTMLWebpackPlugin'

describe('excerpt get HTMLWebpackPlugin', () => {
  it('get HTMLWebpackPlugin', async () => {
    const HTMLWebpackPlugin = await getHTMLWebpackPlugin()
    expect(HTMLWebpackPlugin).not.toBeNull()
  })
})
