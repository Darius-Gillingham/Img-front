'use client';

// File: app/components/B.tsx
// Commit: connect image loader to Railway-hosted index API using `NEXT_PUBLIC_IMAGE_API_URL`

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function B() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchImageIndex() {
      try {
        const res = await fetch(`https://img-c1-production.up.railway.app/api/random-images`);
        if (!res.ok) throw new Error('Failed to fetch image index');
        const data = await res.json();
        setImageUrls(data);
        console.log('✓ Loaded indexed image URLs:', data);
      } catch (err) {
        if (err instanceof Error) {
          console.warn('✗ Failed to load images:', err.message);
        } else {
          console.warn('✗ Failed to load images:', err);
        }
      }
    }

    fetchImageIndex();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative w-full space-y-4">
      <h2 className="text-xl font-bold pl-2">Random Images</h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100 hidden sm:block"
        >
          <ChevronLeft size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth space-x-4 px-2 py-2 scrollbar-hide"
        >
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Indexed image ${index + 1}`}
              className="h-48 w-auto flex-shrink-0 rounded shadow"
            />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-100 hidden sm:block"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
