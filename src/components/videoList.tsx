import { useState, useMemo, MouseEvent } from "react";

import type { Video } from "../model/video";
import type { VideoPreferences } from "../lib/videoPreferences";
import VideoModal from "./VideoModal";
import {
  toggleFavorite as toggleFavoritePref,
  hideVideo as hideVideoPref,
} from "../lib/videoPreferences";

interface VideoListProps {
  videos: Video[];
  preferences: VideoPreferences;
  onUpdatePreferences: (prefs: VideoPreferences) => void;
}

const VideoList = ({ videos, preferences, onUpdatePreferences }: VideoListProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [pendingHideId, setPendingHideId] = useState<string | null>(null);

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
  const visibleVideos = reversedVideos.filter((v) => !preferences.hidden.has(v.id));

  return (
    <>
      <div className="videoGrid">
        {visibleVideos.map((video) => {
          const videoId = video.url.split("/")[4];
          return (
          <div
            key={video.id}
            className="videoCard"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="videoThumbnail">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt={video.title}
                style={{ objectFit: "cover", aspectRatio: "16/9", width: "100%" }}
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
            </div>
            <div className="videoCardContent">
              <h3>{video.title}</h3>
              <div className="videoCardActions">
                <button
                  className={`favBtn ${preferences.favorites.has(video.id) ? "active" : ""}`}
                  onClick={(e) => toggleFavorite(video.id, e)}
                  title="Favoritar"
                  aria-label="Favoritar"
                >
                  {preferences.favorites.has(video.id) ? "❤️" : "🤍"}
                </button>
                {!preferences.favorites.has(video.id) && (
                  <button
                    className="hideBtn"
                    onClick={(e) => requestHide(video.id, e)}
                    title="Ocultar"
                    aria-label="Ocultar"
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
