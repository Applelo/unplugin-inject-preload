import { describe, expect, it } from 'vitest'
import { getAsWithMime } from '../src/helper/getAsWithMime'

describe('getAsWithMime', () => {
  it('test with basic mime', () => {
    expect(getAsWithMime('font/woff2')).toBe('font')
    expect(getAsWithMime('text/css')).toBe('style')
    expect(getAsWithMime('font/cheese')).toBe('font')
    expect(getAsWithMime('application/javascript')).toBe('script')
    expect(getAsWithMime('text/vtt')).toBe('track')
  })

  it('test with wrong values', () => {
    expect(getAsWithMime('text/plain')).toBe(undefined)
    expect(getAsWithMime('cheese/font')).toBe(undefined)
    expect(getAsWithMime('')).toBe(undefined)
    expect(getAsWithMime('test')).toBe(undefined)
  })
})
