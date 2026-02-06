import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadPreferences,
  savePreferences,
  toggleFavorite,
  hideVideo,
  clearPreferences,
  type VideoPreferences,
} from './videoPreferences'

describe('videoPreferences - loadPreferences', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('retorna estado vazio quando não há chave no localStorage', () => {
    const prefs: VideoPreferences = loadPreferences()

    expect(prefs.favorites.size).toBe(0)
    expect(prefs.hidden.size).toBe(0)
  })

  it('retorna estado vazio quando o JSON salvo é inválido', () => {
    window.localStorage.setItem('laratube:video-preferences', '{invalid-json')

    const prefs: VideoPreferences = loadPreferences()

    expect(prefs.favorites.size).toBe(0)
    expect(prefs.hidden.size).toBe(0)
  })
})

describe('videoPreferences - toggleFavorite e hideVideo', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('persiste corretamente o favorito ao alternar e salvar', () => {
    const initial: VideoPreferences = {
      favorites: new Set(),
      hidden: new Set(),
    }

    const updated = toggleFavorite('video-1', initial)
    savePreferences(updated)

    const reloaded = loadPreferences()

    expect(reloaded.favorites.has('video-1')).toBe(true)
    expect(reloaded.hidden.has('video-1')).toBe(false)
  })

  it('mantém estado persistido coerente ao ocultar um vídeo favorito', () => {
    const initial: VideoPreferences = {
      favorites: new Set(['video-1']),
      hidden: new Set(),
    }

    const afterHide = hideVideo('video-1', initial)
    savePreferences(afterHide)

    const reloaded = loadPreferences()

    expect(reloaded.favorites.has('video-1')).toBe(false)
    expect(reloaded.hidden.has('video-1')).toBe(true)
  })
})

describe('videoPreferences - clearPreferences', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('remove as preferências salvas no localStorage', () => {
    const initial: VideoPreferences = {
      favorites: new Set(['video-1']),
      hidden: new Set(['video-2']),
    }

    savePreferences(initial)

    // sanity check: antes de limpar, há dados
    expect(window.localStorage.getItem('laratube:video-preferences')).not.toBeNull()

    clearPreferences()

    const afterClearRaw = window.localStorage.getItem('laratube:video-preferences')
    const afterClear = loadPreferences()

    expect(afterClearRaw).toBeNull()
    expect(afterClear.favorites.size).toBe(0)
    expect(afterClear.hidden.size).toBe(0)
  })
})
