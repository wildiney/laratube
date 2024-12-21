import { useEffect, useState } from "react"
import type { Video } from "../model/video"

const VideoList = ({ videos }: { videos: Video[] }) => {
  const [favorites, setFavorites] = useState<string[]>([])
  const [hidden, setHidden] = useState<string[]>([])

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('laratube') || "{}")
    setFavorites(savedData.favorites || [])
    setHidden(savedData.hidden || [])
  }, [])

  const updateStorage = (favorites: string[], hidden: string[]) => {
    const data = { favorites, hidden }
    localStorage.setItem('laratube', JSON.stringify(data))
  }

  const toggleFavorite = (id: string) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id]
    setFavorites(updatedFavorites)
    updateStorage(updatedFavorites, hidden)
  }
  const toggleHidden = (id: string) => {
    const updatedHidden = hidden.includes(id)
      ? hidden.filter(hide => hide !== id)
      : [...hidden, id]
    setHidden(updatedHidden)
    updateStorage(favorites, updatedHidden)
  }

  return (
    <div className="videoList">
      {videos.filter(video => !hidden.includes(video.id)).map(video => (
        <div key={video.id} className="videoItem">
          <div className="videoHeader">
            <h2>{video.title}</h2>
            <span className="buttons">
              <button onClick={() => { toggleFavorite(video.id) }}>
                {favorites.includes(video.id) ? '❤️' : '🤍'}
              </button>
              {favorites.includes(video.id) ? null :
                <button onClick={() => { toggleHidden(video.id) }}>
                  {hidden.includes(video.id) ? '' : '✖'}
                </button>
              }
            </span>
          </div>
          <iframe width="100%" src={video.url} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      ))}
    </div>
  )
}
export default VideoList