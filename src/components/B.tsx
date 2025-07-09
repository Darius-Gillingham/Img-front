// File: app/components/B.tsx
// Commit: fix empty list by filtering Supabase files via MIME type instead of filename extension

'use client';


import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function B() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    async function fetchRandomImageUrls() {
      const { data, error } = await supabase.storage
        .from('generated-images')
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'desc' },
        });

      if (error) {
        console.warn('✗ Failed to list images:', error);
        return;
      }

      console.log('✓ Files in bucket:', data);

      const allImages = (data ?? []).filter((f) => f.metadata?.mimetype === 'image/png');
      console.log('✓ PNG files found:', allImages.map(f => f.name));

      const shuffled = allImages.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 15);

      console.log('✓ Selected 15 random files:', selected.map(f => f.name));

      const urls = await Promise.all(
        selected.map(async (file) => {
          const { data: urlData, error: urlError } = await supabase.storage
            .from('generated-images')
            .createSignedUrl(file.name, 3600);

          if (urlError) {
            console.warn(`✗ Failed to generate signed URL for ${file.name}:`, urlError);
            return '';
          }

          console.log(`✓ Signed URL for ${file.name}:`, urlData?.signedUrl);
          return urlData?.signedUrl || '';
        })
      );

      const validUrls = urls.filter(Boolean);
      console.log('✓ Final URL list (filtered):', validUrls);

      setImageUrls(validUrls);
    }

    fetchRandomImageUrls();
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
              alt={`Generated image ${index + 1}`}
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
