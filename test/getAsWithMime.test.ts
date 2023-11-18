import { describe, expect, it } from 'vitest'
import { getAsWithMime } from '../src/helper/getAsWithMime'

describe('getAsWithMime', () => {
  it('test with basic mime', () => {
    expect(getAsWithMime('font/woff2', console)).toBe('font')
    expect(getAsWithMime('text/css', console)).toBe('style')
    expect(getAsWithMime('font/cheese', console)).toBe('font')
    expect(getAsWithMime('application/javascript', console)).toBe('script')
    expect(getAsWithMime('text/vtt', console)).toBe('track')
  })

  it('test with wrong values', () => {
    expect(getAsWithMime('text/plain', console)).toBe(undefined)
    expect(getAsWithMime('cheese/font', console)).toBe(undefined)
    expect(getAsWithMime('', console)).toBe(undefined)
    expect(getAsWithMime('test', console)).toBe(undefined)
  })
})
