import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Video } from '../model/video'
import VideoList from './videoList'

const createVideo = (overrides?: Partial<Video>): Video => ({
  id: 'video-1',
  title: 'Vídeo de teste',
  url: 'https://www.youtube.com/embed/test-id',
  ...overrides,
})

describe('VideoList - favoritos e exclusão', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('não exibe botão de excluir para vídeos favoritados', () => {
    const videos: Video[] = [createVideo()]

    render(<VideoList videos={videos} />)

    const deleteButtonBefore = screen.getByRole('button', { name: /ocultar/i })
    expect(deleteButtonBefore).toBeInTheDocument()

    const favoriteButton = screen.getByRole('button', { name: /favoritar/i })
    fireEvent.click(favoriteButton)

    const deleteButtonsAfter = screen.queryAllByRole('button', { name: /ocultar/i })
    expect(deleteButtonsAfter.length).toBe(0)
  })

  it('desfavoritar reexibe o botão de excluir', () => {
    const videos: Video[] = [createVideo()]

    render(<VideoList videos={videos} />)

    const favoriteButton = screen.getByRole('button', { name: /favoritar/i })

    // Favoritar (esconde o botão de ocultar)
    fireEvent.click(favoriteButton)
    expect(screen.queryAllByRole('button', { name: /ocultar/i }).length).toBe(0)

    // Desfavoritar (reexibe o botão de ocultar)
    fireEvent.click(favoriteButton)
    const deleteButton = screen.getByRole('button', { name: /ocultar/i })
    expect(deleteButton).toBeInTheDocument()
  })

  it('clicar em excluir pede confirmação e remove o vídeo se confirmado', () => {
    const videos: Video[] = [createVideo()]

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<VideoList videos={videos} />)

    const deleteButton = screen.getByRole('button', { name: /ocultar/i })
    fireEvent.click(deleteButton)

    // Verifica chamadas
    expect(confirmSpy).toHaveBeenCalled()

    // Verifica remoção da UI
    expect(screen.queryByText('Vídeo de teste')).not.toBeInTheDocument()

    // Verifica persistência (assumindo que o componente salva no localStorage)
    // Nota: O teste real pode precisar limpar o localStorage antes ou ajustar mocks
    const stored = window.localStorage.getItem('laratube:video-preferences')
    expect(stored).toContain('"hidden":["video-1"]')

    confirmSpy.mockRestore()
  })

  it('não exibe vídeos marcados como ocultos no carregamento', () => {
    // Setup initial state in localStorage
    window.localStorage.setItem(
      'laratube:video-preferences',
      JSON.stringify({ favorites: [], hidden: ['video-1'] })
    )

    const videos: Video[] = [createVideo({ id: 'video-1', title: 'Hidden Video' }), createVideo({ id: 'video-2', title: 'Visible Video' })]

    render(<VideoList videos={videos} />)

    expect(screen.queryByText('Hidden Video')).not.toBeInTheDocument()
    expect(screen.getByText('Visible Video')).toBeInTheDocument()
  })
})

