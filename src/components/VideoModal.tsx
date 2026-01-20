import { useEffect } from "react";
import type { Video } from "../model/video";

interface VideoModalProps {
  video: Video;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const VideoModal = ({
  video,
  onClose,
  isFavorite,
  onToggleFavorite,
}: VideoModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>{video.title}</h2>
          <div className="modalActions">
            <button
              className={`favBtn ${isFavorite ? "active" : ""}`}
              onClick={onToggleFavorite}
              title="Favoritar"
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
            <button className="closeBtn" onClick={onClose} title="Fechar (ESC)">
              ✕
            </button>
          </div>
        </div>
        <div className="videoContainer">
          <iframe
            width="100%"
            height="100%"
            src={video.url}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
