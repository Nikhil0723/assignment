import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react'

import useFetchPhotos from '../hooks/useFetchPhotos'
import PhotoCard from './PhotoCard'
import SearchBar from './SearchBar'
import PhotoViewer from './PhotoViewer'

import favouritesReducer, {
    loadFavourites,
    saveFavourites,
} from '../reducers/favouritesReducer'

export default function Gallery() {
    const { photos, loading, error } = useFetchPhotos()

    const [search, setSearch] = useState('')
    const [viewerIndex, setViewerIndex] = useState(null)

    const [favourites, dispatch] = useReducer(
        favouritesReducer,
        undefined,
        loadFavourites
    )

    useEffect(() => {
        saveFavourites(favourites)
    }, [favourites])

    const handleSearchChange = useCallback((value) => {
        setSearch(value)
    }, [])

    const handleToggleFavourite = useCallback((id) => {
        dispatch({ type: 'TOGGLE_FAVOURITE', id })
    }, [])

    const authors = useMemo(
        () =>
            [...new Set(photos.map((photo) => photo.author))].sort(
                (a, b) => a.localeCompare(b)
            ),
        [photos]
    )

    const filteredPhotos = useMemo(() => {
        const query = search.trim().toLowerCase()

        if (!query) return photos

        return photos.filter((photo) =>
            photo.author.toLowerCase().includes(query)
        )
    }, [photos, search])

    const closeViewer = useCallback(() => {
        setViewerIndex(null)
    }, [])

    const isViewerOpen =
        viewerIndex !== null && Boolean(filteredPhotos[viewerIndex])

    return (
        <main className="mx-auto w-[90%] max-w-7xl flex-1 py-9 sm:py-12 lg:py-14">
            {/* Heading and search */}
            <section className="mb-7 grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] md:gap-10">
                <div className="min-w-0">
                    <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-[#4f925b]">
                        THE PHOTO COLLECTION
                    </p>

                    <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-[#a5c9a8] sm:text-4xl lg:text-[48px]">
                        Moments,{' '}
                        <span className="font-normal text-[#4f925b]">
                            beautifully framed.
                        </span>
                    </h1>
                </div>

                <div className="w-full md:justify-self-end">
                    <SearchBar
                        value={search}
                        onChange={handleSearchChange}
                        authors={authors}
                    />
                </div>
            </section>

            {/* Results count */}
            {!loading && !error && (
                <div className="mb-6 flex items-center justify-between border-t border-gray-200 py-4">
                    <p className="text-xs text-gray-500" aria-live="polite">
                        {filteredPhotos.length === 1
                            ? '1 photograph'
                            : `${filteredPhotos.length} photographs`}
                    </p>
                </div>
            )}

            {loading && (
                <div
                    className="flex min-h-[270px] flex-col items-center justify-center gap-4 text-center text-gray-500"
                    role="status"
                >
                    <span className="size-7 animate-spin rounded-full border-2 border-[#e2eee3] border-t-[#4f925b]" />
                    <p className="text-sm">Gathering beautiful moments...</p>
                </div>
            )}

            {error && (
                <div
                    className="flex min-h-[270px] flex-col items-center justify-center gap-3 text-center"
                    role="alert"
                >
                    <h2 className="text-xl font-medium text-gray-800">
                        We couldn't load the gallery.
                    </h2>

                    <p className="max-w-md text-sm leading-7 text-gray-500">
                        {error}
                    </p>

                    <button
                        type="button"
                        className="mt-2 rounded border border-[#d6e5d7] px-4 py-2.5 text-sm text-[#3d7d49] transition-colors hover:bg-[#f0f7f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f925b]"
                        onClick={() => window.location.reload()}
                    >
                        Try again
                    </button>
                </div>
            )}

            {!loading && !error && filteredPhotos.length > 0 && (
                <section
                    className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4"
                    aria-label="Photo gallery"
                >
                    {filteredPhotos.map((photo, index) => (
                        <PhotoCard
                            key={photo.id}
                            photo={photo}
                            index={index}
                            isFavourite={favourites.includes(String(photo.id))}
                            onToggleFavourite={handleToggleFavourite}
                            onView={() => setViewerIndex(index)}
                        />
                    ))}
                </section>
            )}

            {!loading && !error && filteredPhotos.length === 0 && (
                <div className="flex min-h-[270px] flex-col items-center justify-center gap-3 text-center">
                    <span className="font-serif text-5xl text-[#a5c9a8]">
                        ⌕
                    </span>

                    <h2 className="text-xl font-medium text-gray-800">
                        No photographs found
                    </h2>

                    <p className="max-w-md text-sm leading-7 text-gray-500">
                        We couldn't find an author matching "{search}". Try another name.
                    </p>

                    <button
                        type="button"
                        className="mt-2 rounded border border-[#d6e5d7] px-4 py-2.5 text-sm text-[#3d7d49] transition-colors hover:bg-[#f0f7f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f925b]"
                        onClick={() => setSearch('')}
                    >
                        Clear search
                    </button>
                </div>
            )}

            {isViewerOpen && (
                <PhotoViewer
                    photos={filteredPhotos}
                    currentIndex={viewerIndex}
                    onClose={closeViewer}
                    onNavigate={setViewerIndex}
                    favourites={favourites}
                    onToggleFavourite={handleToggleFavourite}
                />
            )}
        </main>
    )
}
