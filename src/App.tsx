import './App.css'
import VideoList from './components/videoList'
import SettingsModal from './components/SettingsModal'
import type { Video } from './model/video'
import { useState, useEffect, useCallback } from 'react'
import { loadPreferences, savePreferences, clearPreferences, clearHidden } from './lib/videoPreferences'
import type { VideoPreferences } from './lib/videoPreferences'

const VIDEOS_URL = 'https://raw.githubusercontent.com/wildiney/laratube/master/src/data/videos.json'
const SKELETON_COUNT = 12

function SkeletonGrid() {
  return (
    <div className="skeletonGrid">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div className="skeletonCard" key={i}>
          <div className="skeletonThumb" />
          <div className="skeletonBody">
            <div className="skeletonLine wide" />
            <div className="skeletonLine medium" />
            <div className="skeletonLine short" style={{ marginTop: '0.5rem' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="errorState">
      <div className="errorIcon">⚠️</div>
      <h2>Não foi possível carregar os vídeos</h2>
      <p>{message}</p>
      <button className="retryBtn" onClick={onRetry}>Tentar novamente</button>
    </div>
  )
}

function App() {
  const [videos, setVideos] = useState<Video[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [preferences, setPreferences] = useState<VideoPreferences>(() => loadPreferences())

  const updatePreferences = (newPrefs: VideoPreferences) => {
    setPreferences(newPrefs)
    savePreferences(newPrefs)
  }

  const handleClearPreferences = () => {
    clearPreferences()
    setPreferences(loadPreferences())
  }

  const handleClearHidden = () => {
    clearHidden()
    setPreferences(loadPreferences())
  }

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(VIDEOS_URL)
      if (!response.ok) throw new Error('Erro ao carregar dados')
      const data = await response.json()
      setVideos(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return (
    <>
      <header>
        <div className="headerMain">
          <svg height="36px" width="36px" viewBox="0 0 461.001 461.001" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#ff2d20" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728
              c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137
              C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607
              c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/>
          </svg>
          <h1>LaraTube</h1>
        </div>
        <button
          className="settingsBtn"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Configurações"
          title="Configurações"
        >
          ⚙
        </button>
      </header>

      {loading && <SkeletonGrid />}
      {!loading && error && <ErrorState message={error} onRetry={fetchVideos} />}
      {!loading && !error && (
        <VideoList
          videos={videos}
          preferences={preferences}
          onUpdatePreferences={updatePreferences}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearPreferences={handleClearPreferences}
        onClearHidden={handleClearHidden}
        preferences={preferences}
      />
    </>
  )
}

export default App
