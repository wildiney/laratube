import { FC, useState, useEffect } from 'react';
import type { VideoPreferences } from '../lib/videoPreferences';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearPreferences: () => void;
  onClearHidden: () => void;
  preferences: VideoPreferences;
}

type ConfirmAction = 'all' | 'hidden' | null;

const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onClearPreferences,
  onClearHidden,
  preferences,
}) => {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  useEffect(() => {
    if (!isOpen) setConfirmAction(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmAction === 'all') {
      onClearPreferences();
    } else if (confirmAction === 'hidden') {
      onClearHidden();
    }
    onClose();
  };

  const favCount = preferences.favorites.size;
  const hiddenCount = preferences.hidden.size;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent settingsModal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Configurações</h2>
          <button className="closeBtn" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div className="modalBody">

          {/* Stats */}
          <div className="statsGrid">
            <div className="statCard">
              <span className="statValue">{favCount}</span>
              <span className="statLabel">❤ Favorito{favCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="statCard">
              <span className="statValue">{hiddenCount}</span>
              <span className="statLabel">🙈 Oculto{hiddenCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <hr className="settingsDivider" />

          {/* Ações */}
          {confirmAction === null ? (
            <div className="settingsSection">
              <h3>Preferências</h3>
              {hiddenCount > 0 && (
                <button
                  className="clearBtn secondary"
                  onClick={() => setConfirmAction('hidden')}
                >
                  Restaurar {hiddenCount} vídeo{hiddenCount !== 1 ? 's' : ''} oculto{hiddenCount !== 1 ? 's' : ''}
                </button>
              )}
              <button
                className="clearBtn"
                onClick={() => setConfirmAction('all')}
  
              >
                Limpar todas as preferências
              </button>
            </div>
          ) : (
            <div className="clearConfirm">
              <p>
                {confirmAction === 'hidden'
                  ? `Restaurar ${hiddenCount} vídeo${hiddenCount !== 1 ? 's' : ''} oculto${hiddenCount !== 1 ? 's' : ''}? Os favoritos serão mantidos.`
                  : 'Tem certeza? Favoritos e ocultos serão removidos. Esta ação não pode ser desfeita.'}
              </p>
              <div className="clearConfirmActions">
                <button className="clearBtn" onClick={handleConfirm}>
                  {confirmAction === 'hidden' ? 'Sim, restaurar' : 'Sim, limpar'}
                </button>
                <button className="cancelBtn" onClick={() => setConfirmAction(null)}>
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
