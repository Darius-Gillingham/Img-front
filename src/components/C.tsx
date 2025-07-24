// File: src/app/components/C.tsx
// Commit: view clustered image groups from serverF via Railway endpoint

'use client'

import { useEffect, useState } from 'react'

type ClusterGroup = {
  group: string
  imagesUrl: string
}

export default function C() {
  const [clusters, setClusters] = useState<ClusterGroup[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])

  const BASE = 'https://img-s6-production.up.railway.app'

  useEffect(() => {
    fetch(`${BASE}/api/clusters`)
      .then(res => res.json())
      .then(setClusters)
      .catch(err => console.error('Failed to load clusters:', err))
  }, [])

  const loadImages = async (relativePath: string) => {
    try {
      const res = await fetch(`${BASE}${relativePath}`)
      const data = await res.json()
      setImages(data)
      setSelected(relativePath)
    } catch (err) {
      console.error('Failed to load image list:', err)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Color Grouped Image Clusters</h1>

      <div className="flex flex-wrap gap-2">
        {clusters.map(c => (
          <button
            key={c.group}
            onClick={() => loadImages(c.imagesUrl)}
            className={`px-3 py-1 rounded text-sm border ${
              selected === c.imagesUrl ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            {c.group}
          </button>
        ))}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
          {images.map((url, idx) => (
            <img key={idx} src={url} alt={`cluster-img-${idx}`} className="w-full rounded" />
          ))}
        </div>
      )}
    </div>
  )
}
