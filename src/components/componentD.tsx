'use client';

import { useEffect, useState } from 'react';

type ImageMeta = {
  name: string;
  path: string;
  url: string;
};

export default function componentD() {
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/componentD');
        const json = await res.json();
        setImages(json.images || []);
      } catch (err) {
        console.error('✗ Failed to fetch image list:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (loading) return <p>Loading generated images...</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.length === 0 ? (
        <p>No images found in bucket.</p>
      ) : (
        images.map((img) => (
          <div key={img.name} className="border rounded overflow-hidden shadow-sm">
            <img src={img.url} alt={img.name} className="w-full h-auto" />
            <div className="p-2 text-xs text-center text-gray-600">{img.name}</div>
          </div>
        ))
      )}
    </div>
  );
}
