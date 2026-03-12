import { FC, useState, useEffect } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClearPreferences: () => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ isOpen, onClose, onClearPreferences }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!isOpen) setShowConfirm(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onClearPreferences();
        onClose();
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
                    {!showConfirm ? (
                        <>
                            <p>Gerencie as preferências da aplicação.</p>
                            <button className="clearBtn" onClick={() => setShowConfirm(true)}>
                                Limpar preferências
                            </button>
                        </>
                    ) : (
                        <div className="clearConfirm">
                            <p>Tem certeza? Favoritos e ocultos serão removidos. Esta ação não pode ser desfeita.</p>
                            <div className="clearConfirmActions">
                                <button className="clearBtn" onClick={handleConfirm}>
                                    Sim, limpar
                                </button>
                                <button className="cancelBtn" onClick={() => setShowConfirm(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
