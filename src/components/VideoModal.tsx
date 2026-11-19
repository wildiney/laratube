import { useEffect } from "react";
import type { Video } from "../model/video";
import { getPlatform, getIframeSrc } from "../lib/videoPlatform";

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
  const platform = getPlatform(video.url);
  const iframeSrc = getIframeSrc(video.url);

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
        <div className={`videoContainer ${platform === "tiktok" ? "vertical" : ""}`}>
          {platform === "youtube" && iframeSrc && (
            <iframe
              width="100%"
              height="100%"
              src={iframeSrc}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
          {platform === "tiktok" && iframeSrc && (
            <iframe
              src={iframeSrc}
              title={video.title}
              frameBorder="0"
              allow="fullscreen; autoplay; encrypted-media"
              // Blocks popups and top-level navigation, so clicks inside the
              // player cannot send the user to tiktok.com's endless feed.
              sandbox="allow-scripts allow-same-origin allow-presentation"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}
          {!platform && (
            <p>URL de vídeo inválida.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
