import { describe, it, expect } from 'vitest'
import {
  getPlatform,
  isValidEmbedUrl,
  isValidTikTokPlayerUrl,
  extractTikTokId,
  getIframeSrc,
} from './videoPlatform'

const YT = 'https://www.youtube.com/embed/f8-uvmL58nE'
const TT = 'https://www.tiktok.com/player/v1/6718335390845095173'

describe('videoPlatform', () => {
  it('detecta YouTube', () => {
    expect(getPlatform(YT)).toBe('youtube')
    expect(isValidEmbedUrl(YT)).toBe(true)
  })

  it('detecta TikTok', () => {
    expect(getPlatform(TT)).toBe('tiktok')
    expect(isValidTikTokPlayerUrl(TT)).toBe(true)
    expect(extractTikTokId(TT)).toBe('6718335390845095173')
  })

  it.each([
    'https://vm.tiktok.com/ZMabc123/',
    'https://www.tiktok.com/@scout2015/video/6718335390845095173',
    'https://www.tiktok.com/player/v1/abc',
    'https://www.tiktok.com/player/v1/6718335390845095173?rel=1',
    'https://www.tiktok.com/player/v1/6718335390845095173/',
    'http://www.tiktok.com/player/v1/6718335390845095173',
    'https://evil.com/https://www.tiktok.com/player/v1/6718335390845095173',
    'https://www.tiktok.com.evil.com/player/v1/6718335390845095173',
    'not a url',
    '',
  ])('rejeita URL inválida: %s', (url) => {
    expect(getPlatform(url)).toBeNull()
    expect(isValidEmbedUrl(url)).toBe(false)
    expect(getIframeSrc(url)).toBeNull()
  })

  it('monta src do TikTok com rel=0 e sem info extra', () => {
    const src = getIframeSrc(TT)!
    expect(src.startsWith(TT + '?')).toBe(true)
    expect(src).toContain('rel=0')
    expect(src).toContain('description=0')
    expect(src).toContain('music_info=0')
  })

  it('monta src do YouTube com rel=0', () => {
    expect(getIframeSrc(YT)).toBe(YT + '?rel=0')
  })
})
