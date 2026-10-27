import { useEffect, useRef, useState } from 'react'
import { Search, X, ArrowUpRight } from 'lucide-react'

export default function SearchBar({ value, onChange, authors }) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)

    const wrapperRef = useRef(null)
    const inputRef = useRef(null)

    const query = value.trim().toLowerCase()

    const suggestions = query
        ? authors
            .filter((author) => author.toLowerCase().includes(query))
            .slice(0, 6)
        : []

    const showSuggestions = isOpen && suggestions.length > 0

    useEffect(() => {
        function handleOutsideClick(event) {
            if (!wrapperRef.current?.contains(event.target)) {
                setIsOpen(false)
                setActiveIndex(-1)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    function selectSuggestion(author) {
        onChange(author)
        setIsOpen(false)
        setActiveIndex(-1)
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            setIsOpen(false)
            setActiveIndex(-1)
            inputRef.current?.blur()
            return
        }

        if (!suggestions.length) return

        if (event.key === 'ArrowDown') {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex((current) =>
                current >= suggestions.length - 1 ? 0 : current + 1
            )
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault()
            setIsOpen(true)
            setActiveIndex((current) =>
                current <= 0 ? suggestions.length - 1 : current - 1
            )
        }

        if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault()
            selectSuggestion(suggestions[activeIndex])
        }
    }

    function handleInputChange(event) {
        onChange(event.target.value)
        setIsOpen(true)
        setActiveIndex(-1)
    }

    function clearSearch() {
        onChange('')
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.focus()
    }

    return (
        <div ref={wrapperRef} className="relative z-20 w-full">
            <div className="flex h-12 w-full items-center gap-3 rounded-full border border-gray-300 bg-white px-4 transition-colors focus-within:border-[#4f925b]">
                <Search
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0 text-gray-500"
                    aria-hidden="true"
                />

                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search photographers..."
                    aria-label="Search photos by author"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions}
                    autoComplete="off"
                    className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-0"
                />

                {value && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        aria-label="Clear search"
                        className="flex size-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#4f925b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f925b]"
                    >
                        <X size={17} />
                    </button>
                )}
            </div>

            {showSuggestions && (
                <ul
                    role="listbox"
                    aria-label="Matching photographers"
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 m-0 max-h-72 list-none overflow-y-auto rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
                >
                    {suggestions.map((author, index) => (
                        <li key={author} className="m-0 p-0">
                            <button
                                type="button"
                                role="option"
                                aria-selected={activeIndex === index}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => selectSuggestion(author)}
                                className={`flex min-h-[54px] w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors focus:outline-none ${activeIndex === index
                                        ? 'bg-[#f0f7f0]'
                                        : 'bg-white hover:bg-[#f7faf7]'
                                    }`}
                            >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e5f0e5] text-sm font-semibold text-[#43844d]">
                                    {author.charAt(0).toUpperCase()}
                                </span>

                                <span className="min-w-0 flex-1 truncate text-sm text-[#555555]">
                                    {author}
                                </span>

                                <ArrowUpRight
                                    size={15}
                                    strokeWidth={1.7}
                                    className="shrink-0 text-[#4f925b]"
                                    aria-hidden="true"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
