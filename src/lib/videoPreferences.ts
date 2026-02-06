/**
 * Gerencia as preferências de vídeos (favoritos e ocultos) usando localStorage.
 *
 * - Entrada/saída externa (localStorage): `{ favorites: string[], hidden: string[] }`
 * - Representação interna em memória: `Set<string>` para acesso O(1).
 *
 * Esta função é resiliente a erros de leitura/parse:
 * - Se a chave não existir ou o JSON estiver inválido, retorna estado vazio.
 */
export type VideoPreferences = {
  favorites: Set<string>
  hidden: Set<string>
}

const STORAGE_KEY = 'laratube:video-preferences'

const emptyPreferences = (): VideoPreferences => ({
  favorites: new Set<string>(),
  hidden: new Set<string>(),
})

/**
 * Carrega as preferências de vídeos do localStorage.
 * Nunca lança erro: em caso de falha retorna estado vazio.
 */
export function loadPreferences(): VideoPreferences {
  if (typeof window === 'undefined' || !window.localStorage) {
    return emptyPreferences()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return emptyPreferences()
    }

    const parsed = JSON.parse(raw) as {
      favorites?: string[]
      hidden?: string[]
    } | null

    if (!parsed || typeof parsed !== 'object') {
      return emptyPreferences()
    }

    const favorites = Array.isArray(parsed.favorites)
      ? new Set(parsed.favorites.filter((id) => typeof id === 'string'))
      : new Set<string>()

    const hidden = Array.isArray(parsed.hidden)
      ? new Set(parsed.hidden.filter((id) => typeof id === 'string'))
      : new Set<string>()

    return { favorites, hidden }
  } catch {
    // Em caso de qualquer erro (parse, acesso negado, etc.), não quebrar a UI.
    return emptyPreferences()
  }
}

/**
 * Salva as preferências de vídeos no localStorage.
 * A operação é melhor-esforço: falhas são engolidas para não quebrar a UI.
 */
export function savePreferences(prefs: VideoPreferences): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    const payload = {
      favorites: Array.from(prefs.favorites),
      hidden: Array.from(prefs.hidden),
    }

    const serialized = JSON.stringify(payload)
    window.localStorage.setItem(STORAGE_KEY, serialized)
  } catch {
    // Ignorar erros de quota, acesso negado, etc. A aplicação continua funcionando.
  }
}

/**
 * Limpa todas as preferências de vídeos armazenadas.
 */
export function clearPreferences(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Falha silenciosa; a UI não deve quebrar por não conseguir limpar.
  }
}

/**
 * Alterna o estado de favorito de um vídeo, sem efeitos colaterais externos.
 * Retorna um novo objeto de preferências.
 */
export function toggleFavorite(id: string, prefs: VideoPreferences): VideoPreferences {
  const favorites = new Set(prefs.favorites)
  const hidden = new Set(prefs.hidden)

  if (favorites.has(id)) {
    favorites.delete(id)
  } else {
    favorites.add(id)
  }

  return { favorites, hidden }
}

/**
 * Marca um vídeo como oculto, removendo-o de favoritos se necessário.
 * Retorna um novo objeto de preferências.
 */
export function hideVideo(id: string, prefs: VideoPreferences): VideoPreferences {
  const favorites = new Set(prefs.favorites)
  const hidden = new Set(prefs.hidden)

  favorites.delete(id)
  hidden.add(id)

  return { favorites, hidden }
}




