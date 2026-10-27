
import { useCallback, useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'

function ViewerImage({ photo }) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    const imageUrl = `https://picsum.photos/id/${photo.id}/1600/1200`

    return (
        <div className="relative flex h-full w-full items-center justify-center">
            {!imageLoaded && !imageError && (
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    role="status"
                    aria-label="Loading photo"
                >
                    <span className="size-8 animate-spin rounded-full border-2 border-[#e5eee5] border-t-[#4f925b]" />
                </div>
            )}

            {imageError ? (
                <p className="text-sm text-gray-500" role="alert">
                    This photo could not be loaded.
                </p>
            ) : (
                <img
                    src={imageUrl}
                    alt={`Photograph by ${photo.author}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    className={`block max-h-full max-w-full object-contain transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            )}
        </div>
    )
}

export default function PhotoViewer({
    photos,
    currentIndex,
    onClose,
    onNavigate,
    favourites,
    onToggleFavourite,
}) {
    const photo = photos[currentIndex]

    const isFavourite = photo
        ? favourites.includes(String(photo.id))
        : false

    const showPrevious = useCallback(() => {
        onNavigate((currentIndex - 1 + photos.length) % photos.length)
    }, [currentIndex, photos.length, onNavigate])

    const showNext = useCallback(() => {
        onNavigate((currentIndex + 1) % photos.length)
    }, [currentIndex, photos.length, onNavigate])

    useEffect(() => {
        if (!photo) return

        function handleKeyDown(event) {
            if (event.key === 'Escape') onClose()
            if (event.key === 'ArrowLeft') showPrevious()
            if (event.key === 'ArrowRight') showNext()
        }

        const previousOverflow = document.body.style.overflow

        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [photo, onClose, showPrevious, showNext])

    if (!photo) return null

    return (
        <div
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
        >

            <button
                type="button"
                onClick={onClose}
                aria-label="Close viewer"
                className="absolute right-5 top-5 z-20 flex size-10 items-center justify-center text-gray-500 transition-colors hover:text-[#4f925b] focus-visible:outline-2 focus-visible:outline-[#4f925b] sm:right-8 sm:top-6"
            >
                <X size={25} strokeWidth={1.3} />
            </button>

            <div className="flex h-full w-full items-center justify-center px-14 py-16 sm:px-24 sm:py-12">
                <div className="relative flex h-full w-full items-center justify-center">
                    {photos.length > 1 && (
                        <button
                            type="button"
                            onClick={showPrevious}
                            aria-label="Previous photo"
                            className="absolute left-[-38px] top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#cfcfcf] bg-white text-[#b7b7b7] transition-colors hover:border-[#4f925b] hover:text-[#4f925b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f925b] sm:left-[-64px] sm:size-[52px]"
                        >
                            <ChevronLeft size={27} strokeWidth={1.4} />
                        </button>
                    )}

                    {/* Image frame */}
                    <ViewerImage key={photo.id} photo={photo} />

                    {photos.length > 1 && (
                        <button
                            type="button"
                            onClick={showNext}
                            aria-label="Next photo"
                            className="absolute right-[-38px] top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#cfcfcf] bg-white text-[#b7b7b7] transition-colors hover:border-[#4f925b] hover:text-[#4f925b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f925b] sm:right-[-64px] sm:size-[52px]"
                        >
                            <ChevronRight size={27} strokeWidth={1.4} />
                        </button>
                    )}
                </div>
            </div>

            {/* Photo counter */}
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-wide text-gray-500">
                {currentIndex + 1} / {photos.length}
            </span>

            <button
                type="button"
                onClick={() => onToggleFavourite(photo.id)}
                aria-label={
                    isFavourite ? 'Remove from favourites' : 'Save to favourites'
                }
                aria-pressed={isFavourite}
                className={`absolute bottom-4 right-5 flex size-9 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-[#4f925b] sm:bottom-5 sm:right-8 ${isFavourite
                        ? 'text-[#4f925b]'
                        : 'text-gray-400 hover:text-[#4f925b]'
                    }`}
            >
                <Heart
                    size={21}
                    strokeWidth={1.4}
                    fill={isFavourite ? 'currentColor' : 'none'}
                />
            </button>
        </div>
    )
}