
const STORAGE_KEY = 'celebrare-favourites'

export function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return []

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) return []

    return [...new Set(
      parsed.filter(id =>
        typeof id === 'string' || typeof id === 'number'
      ).map(String)
    )]
  } catch {
    return []
  }
}

export function saveFavourites(favourites) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favourites)
    )
  } catch (error) {
    console.error('Could not save favourites:', error)
  }
}

export default function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
      const id = String(action.id)

      if (state.includes(id)) {
        return state.filter(
          favouriteId => favouriteId !== id
        )
      }

      return [...state, id]
    }

    default:
      return state
  }
}
