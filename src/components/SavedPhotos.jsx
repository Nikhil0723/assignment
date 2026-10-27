import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'

import useFetchPhotos from '../hooks/useFetchPhotos'
import PhotoCard from './PhotoCard'
import PhotoViewer from './PhotoViewer'

import favouritesReducer, {
  loadFavourites,
  saveFavourites,
} from '../reducers/favouritesReducer'

export default function SavedPhotos() {
  const { photos, loading, error } = useFetchPhotos()

  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    loadFavourites
  )

  const [viewerIndex, setViewerIndex] = useState(null)

  useEffect(() => {
    saveFavourites(favourites)
  }, [favourites])

  const savedPhotos = useMemo(
    () => photos.filter((photo) => favourites.includes(String(photo.id))),
    [photos, favourites]
  )

  const handleToggleFavourite = useCallback((id) => {
    dispatch({
      type: 'TOGGLE_FAVOURITE',
      id,
    })
  }, [])



  return (
    <main className="mx-auto w-[90%] max-w-7xl flex-1 py-9 sm:py-12 lg:py-14">
      <section className="mb-7">
        <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-[#4f925b]">
          YOUR PERSONAL COLLECTION
        </p>

        <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#a5c9a8] sm:text-4xl lg:text-[48px]">
          Saved{' '}
          <span className="font-normal text-[#4f925b]">moments.</span>
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500">
          The photographs you love, all in one place.
        </p>
      </section>

      {!loading && !error && (
        <div className="mb-6 border-t border-gray-200 py-4">
          <p className="text-xs text-gray-500" aria-live="polite">
            {savedPhotos.length === 1
              ? '1 saved photograph'
              : `${savedPhotos.length} saved photographs`}
          </p>
        </div>
      )}

      {loading && (
        <div
          className="flex min-h-[270px] flex-col items-center justify-center gap-4 text-center text-gray-500"
          role="status"
        >
          <span className="size-7 animate-spin rounded-full border-2 border-[#e2eee3] border-t-[#4f925b]" />
          <p className="text-sm">Loading your saved photos...</p>
        </div>
      )}

      {error && (
        <div
          className="flex min-h-[270px] flex-col items-center justify-center gap-3 text-center"
          role="alert"
        >
          <h2 className="text-xl font-medium text-gray-800">
            We couldn't load your photos.
          </h2>

          <p className="max-w-md text-sm leading-7 text-gray-500">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded border border-[#d6e5d7] px-4 py-2.5 text-sm text-[#3d7d49] transition-colors hover:bg-[#f0f7f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f925b]"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && savedPhotos.length > 0 && (
        <section
          className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Saved photos"
        >
          {savedPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              isFavourite
              onToggleFavourite={handleToggleFavourite}
              onView={() => setViewerIndex(index)}
            />
          ))}
        </section>
      )}

      {!loading && !error && savedPhotos.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center px-4 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-[#edf5ed] text-[#4f925b]">
            <Heart size={28} strokeWidth={1.5} />
          </div>

          <h2 className="text-xl font-medium text-gray-800">
            No saved photos yet
          </h2>

          <p className="mt-2 max-w-md text-sm leading-7 text-gray-500">
            When you find a photograph you love, tap its heart to keep it in
            your collection.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#4f925b] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3d7d49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f925b]"
          >
            Explore all photos
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
      {viewerIndex !== null && savedPhotos[viewerIndex] && (
        <PhotoViewer
          photos={savedPhotos}
          currentIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onNavigate={setViewerIndex}
          favourites={favourites}
          onToggleFavourite={handleToggleFavourite}
        />
      )}
    </main>
  )
}