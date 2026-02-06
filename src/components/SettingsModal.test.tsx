import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsModal from './SettingsModal'
import * as videoPreferences from '../lib/videoPreferences'

describe('SettingsModal', () => {
    const onCloseMock = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        window.localStorage.clear()
    })

    it('renderiza corretamente', () => {
        render(<SettingsModal isOpen={true} onClose={onCloseMock} />)
        expect(screen.getByText('Configurações')).toBeInTheDocument()
        expect(screen.getByText('Limpar preferências')).toBeInTheDocument()
    })

    it('não renderiza quando isOpen é false', () => {
        render(<SettingsModal isOpen={false} onClose={onCloseMock} />)
        expect(screen.queryByText('Configurações')).not.toBeInTheDocument()
    })

    it('ao clicar em limpar, pede confirmação', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
        render(<SettingsModal isOpen={true} onClose={onCloseMock} />)

        fireEvent.click(screen.getByText('Limpar preferências'))

        expect(confirmSpy).toHaveBeenCalled()
        expect(onCloseMock).not.toHaveBeenCalled()
        confirmSpy.mockRestore()
    })

    it('ao confirmar limpeza, chama clearPreferences e reload', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
        const clearSpy = vi.spyOn(videoPreferences, 'clearPreferences')

        // Mock window.location.reload
        const reloadMock = vi.fn()
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { reload: reloadMock }
        })

        render(<SettingsModal isOpen={true} onClose={onCloseMock} />)

        fireEvent.click(screen.getByText('Limpar preferências'))

        expect(clearSpy).toHaveBeenCalled()
        expect(reloadMock).toHaveBeenCalled()

        confirmSpy.mockRestore()
    })

    it('botão de fechar chama onClose', () => {
        render(<SettingsModal isOpen={true} onClose={onCloseMock} />)
        fireEvent.click(screen.getByLabelText('Fechar'))
        expect(onCloseMock).toHaveBeenCalled()
    })
})
