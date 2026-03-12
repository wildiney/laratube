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
    return <VideoList videos={videos} preferences={preferences} onUpdatePreferences={setPreferences} />
  }

  return render(<Wrapper />)
}

describe('VideoList - favoritos e exclusão', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('não exibe botão de ocultar para vídeos favoritados', () => {
    renderVideoList([createVideo()])

    expect(screen.getByRole('button', { name: /ocultar/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /favoritar/i }))

    expect(screen.queryAllByRole('button', { name: /ocultar/i }).length).toBe(0)
  })

  it('desfavoritar reexibe o botão de ocultar', () => {
    renderVideoList([createVideo()])

    const favoriteButton = screen.getByRole('button', { name: /favoritar/i })

    fireEvent.click(favoriteButton)
    expect(screen.queryAllByRole('button', { name: /ocultar/i }).length).toBe(0)

    fireEvent.click(favoriteButton)
    expect(screen.getByRole('button', { name: /ocultar/i })).toBeInTheDocument()
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
