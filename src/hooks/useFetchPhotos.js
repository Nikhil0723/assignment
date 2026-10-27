
import { useEffect, useState } from 'react'

const PHOTOS_API =
  'https://picsum.photos/v2/list?limit=30'

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(PHOTOS_API, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(
            `Failed to fetch photos (${response.status})`
          )
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Invalid photo data received')
        }

        setPhotos(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchPhotos()

    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}
