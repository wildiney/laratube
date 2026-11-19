import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import type { Video } from '../model/video'
import type { VideoPreferences } from '../lib/videoPreferences'
import VideoList from './videoList'

const createVideo = (overrides?: Partial<Video>): Video => ({
  id: 'video-1',
  title: 'Vídeo de teste',
  url: 'https://www.youtube.com/embed/test-id',
  ...overrides,
})

const renderVideoList = (videos: Video[], initialPrefs?: { favorites?: string[], hidden?: string[] }) => {
  const initial: VideoPreferences = {
    favorites: new Set(initialPrefs?.favorites ?? []),
    hidden: new Set(initialPrefs?.hidden ?? []),
  }

  const Wrapper = () => {
    const [preferences, setPreferences] = useState(initial)
    return <VideoList videos={videos} preferences={preferences} onUpdatePreferences={setPreferences} onOpenSettings={() => {}} />
  }

  return render(<Wrapper />)
}

describe('VideoList - favoritos e exclusão', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('não exibe botão de ocultar para vídeos favoritados', () => {
    renderVideoList([createVideo()])

    expect(screen.getByRole('button', { name: /ocultar vídeo/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /adicionar aos favoritos/i }))

    expect(screen.queryAllByRole('button', { name: /ocultar vídeo/i }).length).toBe(0)
  })

  it('desfavoritar reexibe o botão de ocultar', () => {
    renderVideoList([createVideo()])

    const favoriteButton = screen.getByRole('button', { name: /adicionar aos favoritos/i })

    fireEvent.click(favoriteButton)
    expect(screen.queryAllByRole('button', { name: /ocultar vídeo/i }).length).toBe(0)

    fireEvent.click(screen.getByRole('button', { name: /remover dos favoritos/i }))
    expect(screen.getByRole('button', { name: /ocultar vídeo/i })).toBeInTheDocument()
  })

  it('clicar em ocultar exibe confirmação inline', () => {
    renderVideoList([createVideo()])

    fireEvent.click(screen.getByRole('button', { name: /ocultar/i }))

    expect(screen.getByRole('button', { name: /confirmar ocultar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('confirmar ocultar remove o vídeo da lista', () => {
    renderVideoList([createVideo()])

    fireEvent.click(screen.getByRole('button', { name: /ocultar/i }))
    fireEvent.click(screen.getByRole('button', { name: /confirmar ocultar/i }))

    expect(screen.queryByText('Vídeo de teste')).not.toBeInTheDocument()
  })

  it('cancelar ocultar mantém o vídeo visível', () => {
    renderVideoList([createVideo()])

    fireEvent.click(screen.getByRole('button', { name: /ocultar/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.getByText('Vídeo de teste')).toBeInTheDocument()
  })

  it('card do TikTok mostra placeholder em vez de thumbnail do YouTube', () => {
    renderVideoList([
      createVideo({
        id: 'tt-1',
        title: 'Vídeo TikTok',
        url: 'https://www.tiktok.com/player/v1/6718335390845095173',
      }),
    ])

    expect(screen.getByText('TikTok')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('card do YouTube válido mostra thumbnail e não o placeholder', () => {
    renderVideoList([
      createVideo({ url: 'https://www.youtube.com/embed/f8-uvmL58nE' }),
    ])

    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.queryByText('TikTok')).not.toBeInTheDocument()
  })

  it('abrir vídeo do TikTok renderiza iframe com sandbox restrito', () => {
    renderVideoList([
      createVideo({
        id: 'tt-1',
        title: 'Vídeo TikTok',
        url: 'https://www.tiktok.com/player/v1/6718335390845095173',
      }),
    ])

    fireEvent.click(screen.getByRole('button', { name: /assistir: vídeo tiktok/i }))

    const iframe = document.querySelector('iframe')!
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute('src')).toContain('tiktok.com/player/v1/6718335390845095173')
    expect(iframe.getAttribute('src')).toContain('rel=0')
    const sandbox = iframe.getAttribute('sandbox') ?? ''
    expect(sandbox).toContain('allow-scripts')
    expect(sandbox).not.toContain('allow-popups')
    expect(sandbox).not.toContain('allow-top-navigation')
    expect(document.querySelector('.videoContainer.vertical')).toBeTruthy()
  })

  it('abrir vídeo com URL inválida mostra mensagem de erro', () => {
    renderVideoList([createVideo({ url: 'https://vm.tiktok.com/ZMabc123/' })])

    fireEvent.click(screen.getByRole('button', { name: /assistir/i }))

    expect(screen.getByText('URL de vídeo inválida.')).toBeInTheDocument()
    expect(document.querySelector('iframe')).toBeNull()
  })

  it('não exibe vídeos marcados como ocultos', () => {
    const videos: Video[] = [
      createVideo({ id: 'video-1', title: 'Hidden Video' }),
      createVideo({ id: 'video-2', title: 'Visible Video' }),
    ]

    renderVideoList(videos, { hidden: ['video-1'] })

    expect(screen.queryByText('Hidden Video')).not.toBeInTheDocument()
    expect(screen.getByText('Visible Video')).toBeInTheDocument()
  })
})
