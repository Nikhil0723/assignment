import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Heart, Images } from 'lucide-react'

import Gallery from './components/Gallery'
import SavedPhotos from './components/SavedPhotos'

function Header() {
  const location = useLocation()
  const isSavedPage = location.pathname === '/saved'

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[76px] w-[90%] max-w-7xl items-center justify-between gap-4">
        <Link
          to="/"
          aria-label="Celebrare Gallery home"
          className='text-[#4f925b]'
          style={{ fontFamily: '"Segoe Script", "Brush Script MT", cursive' }}
        >
          <span className="shrink-0 text-3xl tracking-tight  sm:text-4xl">Celebrare</span> <span>Gallery</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex items-center gap-2 sm:gap-4"
        >
          <Link
            to="/"
            aria-current={location.pathname === '/' ? 'page' : undefined}
            aria-label="All photos"
            title="All photos"
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${location.pathname === '/'
              ? 'bg-[#edf5ed] text-[#3d7d49]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-[#3d7d49]'
              }`}
          >
            <Images size={18} strokeWidth={1.8} />
            <span className="hidden sm:inline">Gallery</span>
          </Link>

          <Link
            to="/saved"
            aria-current={isSavedPage ? 'page' : undefined}
            aria-label="Saved photos"
            title="Saved photos"
            className={`relative flex size-10 items-center justify-center rounded-full border transition-colors ${isSavedPage
              ? 'border-[#4f925b] bg-[#edf5ed] text-[#3d7d49]'
              : 'border-gray-200 text-gray-600 hover:border-[#4f925b] hover:bg-[#edf5ed] hover:text-[#3d7d49]'
              }`}
          >
            <Heart size={19} strokeWidth={1.8} />
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-2 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <span>Made with care for the little details.</span>
        <span>Photography via Picsum</span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-white">
        <Header />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/saved" element={<SavedPhotos />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
