import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsModal from './SettingsModal'
import type { VideoPreferences } from '../lib/videoPreferences'

const emptyPrefs = (): VideoPreferences => ({
    favorites: new Set<string>(),
    hidden: new Set<string>(),
})

describe('SettingsModal', () => {
    const onCloseMock = vi.fn()
    const onClearPreferencesMock = vi.fn()
    const onClearHiddenMock = vi.fn()

    const defaultProps = {
        onClose: onCloseMock,
        onClearPreferences: onClearPreferencesMock,
        onClearHidden: onClearHiddenMock,
        preferences: emptyPrefs(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        window.localStorage.clear()
    })

    it('renderiza corretamente', () => {
        render(<SettingsModal isOpen={true} {...defaultProps} />)
        expect(screen.getByText('Configurações')).toBeInTheDocument()
        expect(screen.getByText('Limpar todas as preferências')).toBeInTheDocument()
    })

    it('não renderiza quando isOpen é false', () => {
        render(<SettingsModal isOpen={false} {...defaultProps} />)
        expect(screen.queryByText('Configurações')).not.toBeInTheDocument()
    })

    it('ao clicar em limpar preferências, exibe confirmação inline', () => {
        render(<SettingsModal isOpen={true} {...defaultProps} />)

        fireEvent.click(screen.getByText('Limpar todas as preferências'))

        expect(screen.getByText('Sim, limpar')).toBeInTheDocument()
        expect(screen.getByText('Cancelar')).toBeInTheDocument()
        expect(onClearPreferencesMock).not.toHaveBeenCalled()
    })

    it('ao confirmar, chama onClearPreferences e onClose', () => {
        render(<SettingsModal isOpen={true} {...defaultProps} />)

        fireEvent.click(screen.getByText('Limpar todas as preferências'))
        fireEvent.click(screen.getByText('Sim, limpar'))

        expect(onClearPreferencesMock).toHaveBeenCalledTimes(1)
        expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    it('ao cancelar, não chama onClearPreferences', () => {
        render(<SettingsModal isOpen={true} {...defaultProps} />)

        fireEvent.click(screen.getByText('Limpar todas as preferências'))
        fireEvent.click(screen.getByText('Cancelar'))

        expect(onClearPreferencesMock).not.toHaveBeenCalled()
        expect(screen.getByText('Limpar todas as preferências')).toBeInTheDocument()
    })

    it('confirmação é resetada ao fechar e reabrir o modal', () => {
        const { rerender } = render(<SettingsModal isOpen={true} {...defaultProps} />)

        fireEvent.click(screen.getByText('Limpar todas as preferências'))
        expect(screen.getByText('Sim, limpar')).toBeInTheDocument()

        rerender(<SettingsModal isOpen={false} {...defaultProps} />)
        rerender(<SettingsModal isOpen={true} {...defaultProps} />)

        expect(screen.queryByText('Sim, limpar')).not.toBeInTheDocument()
        expect(screen.getByText('Limpar todas as preferências')).toBeInTheDocument()
    })

    it('botão de fechar chama onClose', () => {
        render(<SettingsModal isOpen={true} {...defaultProps} />)
        fireEvent.click(screen.getByLabelText('Fechar'))
        expect(onCloseMock).toHaveBeenCalled()
    })

    it('exibe botão de restaurar ocultos quando há vídeos ocultos', () => {
        const prefsWithHidden: VideoPreferences = {
            favorites: new Set<string>(),
            hidden: new Set(['video-1', 'video-2']),
        }
        render(<SettingsModal isOpen={true} {...defaultProps} preferences={prefsWithHidden} />)
        expect(screen.getByText(/restaurar 2 vídeos ocultos/i)).toBeInTheDocument()
    })
})
