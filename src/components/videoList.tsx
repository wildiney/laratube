import { useState, useMemo, MouseEvent } from "react";

import type { Video } from "../model/video";
import type { VideoPreferences } from "../lib/videoPreferences";
import VideoModal from "./VideoModal";
import {
  toggleFavorite as toggleFavoritePref,
  hideVideo as hideVideoPref,
} from "../lib/videoPreferences";
import { extractYoutubeId } from "../lib/youtube";

interface VideoListProps {
  videos: Video[];
  preferences: VideoPreferences;
  onUpdatePreferences: (prefs: VideoPreferences) => void;
  onOpenSettings: () => void;
}

const VideoList = ({ videos, preferences, onUpdatePreferences, onOpenSettings }: VideoListProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [pendingHideId, setPendingHideId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const applyToggleFavorite = (id: string) => {
    onUpdatePreferences(toggleFavoritePref(id, preferences));
  };

  const toggleFavorite = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    applyToggleFavorite(id);
  };

  const requestHide = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setPendingHideId(id);
  };

  const confirmHide = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    onUpdatePreferences(hideVideoPref(id, preferences));
    setPendingHideId(null);
  };

  const cancelHide = (e: MouseEvent) => {
    e.stopPropagation();
    setPendingHideId(null);
  };

  const reversedVideos = useMemo(() => [...videos].reverse(), [videos]);

  const visibleVideos = useMemo(() => {
    let result = reversedVideos.filter((v) => !preferences.hidden.has(v.id));
    if (showFavoritesOnly) {
      result = result.filter((v) => preferences.favorites.has(v.id));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(q));
    }
    return result;
  }, [reversedVideos, preferences, showFavoritesOnly, searchQuery]);

  const totalVisible = reversedVideos.filter((v) => !preferences.hidden.has(v.id)).length;
  const favoritesCount = preferences.favorites.size;
  const hiddenCount = preferences.hidden.size;

  const allHidden = totalVisible === 0 && hiddenCount > 0;
  const noResults = visibleVideos.length === 0 && !allHidden;

  return (
    <>
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbarRow">
          <div className="searchWrapper">
            <span className="searchIcon">🔍</span>
            <input
              className="searchInput"
              type="search"
              placeholder="Buscar vídeos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar vídeos"
            />
          </div>
          <button
            className={`filterBtn ${showFavoritesOnly ? "active" : ""}`}
            onClick={() => setShowFavoritesOnly((v) => !v)}
            aria-pressed={showFavoritesOnly}
            title="Mostrar só favoritos"
          >
            ❤ Favoritos {favoritesCount > 0 && `(${favoritesCount})`}
          </button>
        </div>
        <div className="toolbarStats">
          {visibleVideos.length} vídeo{visibleVideos.length !== 1 ? "s" : ""}
          {favoritesCount > 0 && ` · ${favoritesCount} favorito${favoritesCount !== 1 ? "s" : ""}`}
          {hiddenCount > 0 && ` · ${hiddenCount} oculto${hiddenCount !== 1 ? "s" : ""}`}
        </div>
      </div>

      {/* Estado: todos ocultos */}
      {allHidden && (
        <div className="emptyState">
          <div className="emptyIcon">🙈</div>
          <h2>Todos os vídeos estão ocultos</h2>
          <p>Você ocultou todos os vídeos. Restaure os ocultos nas configurações.</p>
          <button className="emptyStateBtn" onClick={onOpenSettings}>
            Abrir configurações
          </button>
        </div>
      )}

      {/* Estado: sem resultados na busca/filtro */}
      {noResults && !allHidden && (
        <div className="emptyState">
          <div className="emptyIcon">{showFavoritesOnly ? "❤" : "🔍"}</div>
          <h2>{showFavoritesOnly ? "Nenhum favorito ainda" : "Nenhum resultado"}</h2>
          <p>
            {showFavoritesOnly
              ? "Marque vídeos como favoritos para vê-los aqui."
              : `Nenhum vídeo corresponde a "${searchQuery}".`}
          </p>
          {showFavoritesOnly && (
            <button className="emptyStateBtn" onClick={() => setShowFavoritesOnly(false)}>
              Ver todos os vídeos
            </button>
          )}
        </div>
      )}

      {/* Grid de vídeos */}
      {visibleVideos.length > 0 && (
        <div className="videoGrid">
          {visibleVideos.map((video) => {
            const videoId = extractYoutubeId(video.url);
            const isFav = preferences.favorites.has(video.id);
            return (
              <div
                key={video.id}
                className="videoCard"
                onClick={() => setSelectedVideo(video)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedVideo(video)}
                aria-label={`Assistir: ${video.title}`}
              >
                <div className="videoThumbnail">
                  {videoId && (
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                      alt={video.title}
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                  )}
                  <div className="playOverlay">
                    <div className="playIcon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="videoCardContent">
                  <h3>{video.title}</h3>
                  <div className="videoCardActions">
                    <button
                      className={`favBtn ${isFav ? "active" : ""}`}
                      onClick={(e) => toggleFavorite(video.id, e)}
                      title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      aria-pressed={isFav}
                    >
                      {isFav ? "❤" : "♡"}
                    </button>
                    {!isFav && (
                      <button
                        className="hideBtn"
                        onClick={(e) => requestHide(video.id, e)}
                        title="Ocultar vídeo"
                        aria-label="Ocultar vídeo"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {pendingHideId === video.id && (
                    <div className="hideConfirm" onClick={(e) => e.stopPropagation()}>
                      <span>Ocultar "{video.title}"?</span>
                      <button className="hideConfirmYes" onClick={(e) => confirmHide(video.id, e)} aria-label="Confirmar ocultar">Sim</button>
                      <button className="hideConfirmNo" onClick={cancelHide} aria-label="Cancelar">Não</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          isFavorite={preferences.favorites.has(selectedVideo.id)}
          onToggleFavorite={() => applyToggleFavorite(selectedVideo.id)}
        />
      )}
    </>
  );
};

export default VideoList;
