import { useState, MouseEvent } from "react";
import type { Video } from "../model/video";
import VideoModal from "./VideoModal";
import {
  loadPreferences,
  savePreferences,
  toggleFavorite as toggleFavoritePref,
  hideVideo as hideVideoPref,
} from "../lib/videoPreferences";

const VideoList = ({ videos }: { videos: Video[] }) => {
  // Inicializa estado lendo do localStorage (lazy initialization)
  const [preferences, setPreferences] = useState(() => loadPreferences());
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const toggleFavorite = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const newPrefs = toggleFavoritePref(id, preferences);
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const toggleHidden = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const video = videos.find((v) => v.id === id);
    if (video && window.confirm(`Ocultar "${video.title}"?`)) {
      const newPrefs = hideVideoPref(id, preferences);
      setPreferences(newPrefs);
      savePreferences(newPrefs);
    }
  };

  const reversedVideos = [...videos].reverse();
  const visibleVideos = reversedVideos.filter((v) => !preferences.hidden.has(v.id));

  return (
    <>
      <div className="videoGrid">
        {visibleVideos.map((video) => (
          <div
            key={video.id}
            className="videoCard"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="videoThumbnail">
              <img src={`https://img.youtube.com/vi/${video.url.split("/")[4]}/maxresdefault.jpg`} alt="Thumbnail" style={{ objectFit: "cover", aspectRatio: "16/9", width: "100%" }} />
            </div>
            <div className="videoCardContent">
              <h3>{video.title}</h3>
              <div className="videoCardActions">
                <button
                  className={`favBtn ${preferences.favorites.has(video.id) ? "active" : ""
                    }`}
                  onClick={(e) => toggleFavorite(video.id, e)}
                  title="Favoritar"
                  aria-label="Favoritar"
                >
                  {preferences.favorites.has(video.id) ? "❤️" : "🤍"}
                </button>
                {!preferences.favorites.has(video.id) && (
                  <button
                    className="hideBtn"
                    onClick={(e) => toggleHidden(video.id, e)}
                    title="Ocultar"
                    aria-label="Ocultar"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          isFavorite={preferences.favorites.has(selectedVideo.id)}
          onToggleFavorite={() => {
            const newPrefs = toggleFavoritePref(selectedVideo.id, preferences);
            setPreferences(newPrefs);
            savePreferences(newPrefs);
          }}
        />
      )}
    </>
  );
};

export default VideoList;
