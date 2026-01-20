import { useState } from "react";
import type { Video } from "../model/video";
import VideoModal from "./VideoModal";

const VideoList = ({ videos }: { videos: Video[] }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const toggleHidden = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videos.find((v) => v.id === id);
    if (video && window.confirm(`Ocultar "${video.title}"?`)) {
      setHidden((prev) =>
        prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
      );
    }
  };

  const visibleVideos = videos.filter((v) => !hidden.includes(v.id));

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
                  className={`favBtn ${favorites.includes(video.id) ? "active" : ""
                    }`}
                  onClick={(e) => toggleFavorite(video.id, e)}
                  title="Favoritar"
                >
                  {favorites.includes(video.id) ? "❤️" : "🤍"}
                </button>
                <button
                  className="hideBtn"
                  onClick={(e) => toggleHidden(video.id, e)}
                  title="Ocultar"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          isFavorite={favorites.includes(selectedVideo.id)}
          onToggleFavorite={() => {
            setFavorites((prev) =>
              prev.includes(selectedVideo.id)
                ? prev.filter((fav) => fav !== selectedVideo.id)
                : [...prev, selectedVideo.id]
            );
          }}
        />
      )}
    </>
  );
};

export default VideoList;
