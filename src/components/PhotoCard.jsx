import { Heart, Expand } from 'lucide-react'

export default function PhotoCard({
    photo,
    isFavourite,
    onToggleFavourite,
    onView,
    index = 0,
}) {
    return (
        <article className="group min-w-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#f2f4f1]">
                <button
                    type="button"
                    onClick={onView}
                    aria-label={`View photo by ${photo.author} `}
                    className="absolute inset-0 z-0 h-full w-full cursor-zoom-in"
                >
                    <img
                        src={`https://picsum.photos/id/${photo.id}/600/750`}
                        alt={`Photograph by ${photo.author}`}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                    />
                </button >

                <button
                    type="button"
                    onClick={() => onToggleFavourite(photo.id)}
                    aria-label={
                        isFavourite
                            ? `Remove ${photo.author}'s photo from favourites`
                            : `Add ${photo.author}'s photo to favourites`
                    }
                    aria-pressed={isFavourite}
                    className={`absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-sm transition-all duration-200 ${isFavourite
                        ? 'text-[#4f925b]'
                        : 'text-gray-600 md:opacity-0 md:group-hover:opacity-100'
                        }`}
                >
                    <Heart
                        size={21}
                        strokeWidth={1.8}
                        fill={isFavourite ? 'currentColor' : 'none'}
                    />
                </button>

                <button
                    type="button"
                    onClick={onView}
                    aria-label={`Open photo by ${photo.author}`}
                    className="absolute bottom-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm transition hover:bg-[#edf5ed] hover:text-[#3d7d49] md:opacity-0 md:group-hover:opacity-100"
                >
                    <Expand size={17} />
                </button>
            </div >

            <div className="flex items-center justify-between gap-2 pt-3">
                <span className="truncate text-xs font-medium text-[#555555]">
                    {photo.author}
                </span>

                {isFavourite && (
                    <span className="shrink-0 text-[10px] font-medium text-[#4f925b]">
                        Saved
                    </span>
                )}
            </div>
        </article >
    )
}