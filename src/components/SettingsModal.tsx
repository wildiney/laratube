import { FC } from 'react';
import { clearPreferences } from '../lib/videoPreferences';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleClearPreferences = () => {
        if (window.confirm('Tem certeza que deseja limpar todas as preferências (favoritos e ocultos)? Esta ação não pode ser desfeita.')) {
            clearPreferences();
            window.location.reload();
        }
    };

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent settingsModal" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <h2>Configurações</h2>
                    <button className="closeBtn" onClick={onClose} aria-label="Fechar">
                        ✕
                    </button>
                </div>
                <div className="modalBody">
                    <p>Gerencie as preferências da aplicação.</p>
                    <button className="clearBtn" onClick={handleClearPreferences}>
                        Limpar preferências
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
