import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsModal from './SettingsModal'

describe('SettingsModal', () => {
    const onCloseMock = vi.fn()
    const onClearPreferencesMock = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        window.localStorage.clear()
    })

    it('renderiza corretamente', () => {
        render(<SettingsModal isOpen={true} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)
        expect(screen.getByText('Configurações')).toBeInTheDocument()
        expect(screen.getByText('Limpar preferências')).toBeInTheDocument()
    })

    it('não renderiza quando isOpen é false', () => {
        render(<SettingsModal isOpen={false} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)
        expect(screen.queryByText('Configurações')).not.toBeInTheDocument()
    })

    it('ao clicar em limpar preferências, exibe confirmação inline', () => {
        render(<SettingsModal isOpen={true} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)

        fireEvent.click(screen.getByText('Limpar preferências'))

        expect(screen.getByText('Sim, limpar')).toBeInTheDocument()
        expect(screen.getByText('Cancelar')).toBeInTheDocument()
        expect(onClearPreferencesMock).not.toHaveBeenCalled()
    })

    it('ao confirmar, chama onClearPreferences e onClose', () => {
        render(<SettingsModal isOpen={true} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)

        fireEvent.click(screen.getByText('Limpar preferências'))
        fireEvent.click(screen.getByText('Sim, limpar'))

        expect(onClearPreferencesMock).toHaveBeenCalledTimes(1)
        expect(onCloseMock).toHaveBeenCalledTimes(1)
    })

    it('ao cancelar, não chama onClearPreferences', () => {
        render(<SettingsModal isOpen={true} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)

        fireEvent.click(screen.getByText('Limpar preferências'))
        fireEvent.click(screen.getByText('Cancelar'))

        expect(onClearPreferencesMock).not.toHaveBeenCalled()
        expect(screen.getByText('Limpar preferências')).toBeInTheDocument()
    })

    it('confirmação é resetada ao fechar e reabrir o modal', () => {
        const { rerender } = render(<SettingsModal isOpen={true} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)

        fireEvent.click(screen.getByText('Limpar preferências'))
        expect(screen.getByText('Sim, limpar')).toBeInTheDocument()

        rerender(<SettingsModal isOpen={false} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)
        rerender(<SettingsModal isOpen={true} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)

        expect(screen.queryByText('Sim, limpar')).not.toBeInTheDocument()
        expect(screen.getByText('Limpar preferências')).toBeInTheDocument()
    })

    it('botão de fechar chama onClose', () => {
        render(<SettingsModal isOpen={true} onClose={onCloseMock} onClearPreferences={onClearPreferencesMock} />)
        fireEvent.click(screen.getByLabelText('Fechar'))
        expect(onCloseMock).toHaveBeenCalled()
    })
})
