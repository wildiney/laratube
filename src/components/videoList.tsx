import { useEffect, useState } from "react";
import type { Video } from "../model/video";

const VideoList = ({ videos }: { videos: Video[] }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [loadedVideos, setLoadedVideos] = useState<Video[]>([]); // Armazena os vídeos carregados
  const [loadingIndex, setLoadingIndex] = useState(0); // Índice do vídeo sendo carregado atualmente

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("laratube") || "{}");
    setFavorites(savedData.favorites || []);
    setHidden(savedData.hidden || []);
  }, []);

  useEffect(() => {
    if (loadingIndex < videos.length) {
      const timer = setTimeout(() => {
        const video = videos[loadingIndex];
        if (!hidden.includes(video.id)) {
          setLoadedVideos((prev) => [...prev, video]); // Adiciona o próximo vídeo
        }
        setLoadingIndex((prev) => prev + 1); // Incrementa o índice
      }, 500); // Tempo entre carregamentos (ajustável)
      return () => clearTimeout(timer); // Limpa o timeout
    }
  }, [loadingIndex, videos, hidden]);

  const updateStorage = (favorites: string[], hidden: string[]) => {
    const data = { favorites, hidden };
    localStorage.setItem("laratube", JSON.stringify(data));
  };

  const toggleFavorite = (id: string) => {
    const videoToHide = loadedVideos.find(video => video.id === id)
    if (videoToHide && window.confirm(`Tem certeza que deseja ocultar o video ${videoToHide.title}?`)) {
      const updatedFavorites = favorites.includes(id)
        ? favorites.filter((fav) => fav !== id)
        : [...favorites, id];
      setFavorites(updatedFavorites);
      updateStorage(updatedFavorites, hidden);
    }
  };

  const toggleHidden = (id: string) => {
    const videoToHide = loadedVideos.find((video) => video.id === id);

    if (
      videoToHide &&
      window.confirm(`Tem certeza que deseja ocultar o vídeo "${videoToHide.title}"?`)
    ) {
      const updatedHidden = hidden.includes(id)
        ? hidden.filter((hide) => hide !== id)
        : [...hidden, id];
      setHidden(updatedHidden);
      setLoadedVideos((prevVideos) => prevVideos.filter((video) => video.id !== id));
      updateStorage(favorites, updatedHidden);
    }
  };

  return (
    <div className="videoList">
      {loadedVideos.map((video) => (
        <div key={video.id} className="videoItem">
          <div className="videoHeader">
            <h2>{video.title}</h2>
            <span className="buttons">
              <button onClick={() => toggleFavorite(video.id)}>
                {favorites.includes(video.id) ? "❤️" : "🤍"}
              </button>
              {favorites.includes(video.id) ? null : (
                <button onClick={() => toggleHidden(video.id)}>
                  {hidden.includes(video.id) ? "❌" : "✖"}
                </button>
              )}
            </span>
          </div>
          <iframe
            width="100%"
            src={video.url}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      ))}

      {loadingIndex < videos.length && (
        <div className="loading">Carregando vídeos...</div>
      )}
    </div>
  );
};

export default VideoList
