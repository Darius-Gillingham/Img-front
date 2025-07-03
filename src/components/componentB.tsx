'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Wordset = string[];

export default function ComponentB() {
  const [wordsets, setWordsets] = useState<Wordset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWordsets = async () => {
      const { data: files, error } = await supabase.storage
        .from('wordsets')
        .list('', { limit: 10, sortBy: { column: 'name', order: 'desc' } });

      if (error || !files || files.length === 0) {
        console.warn('✗ Failed to list wordset files:', error);
        setLoading(false);
        return;
      }

      const mostRecent = files.find(file => file.name.endsWith('.json'));
      if (!mostRecent) {
        setLoading(false);
        return;
      }

      const { data, error: downloadError } = await supabase.storage
        .from('wordsets')
        .download(mostRecent.name);

      if (downloadError || !data) {
        console.warn(`✗ Failed to download ${mostRecent.name}:`, downloadError);
        setLoading(false);
        return;
      }

      const text = await data.text();
      try {
        const parsed = JSON.parse(text);
        setWordsets(parsed.wordsets || []);
      } catch {
        console.warn('✗ Failed to parse wordset JSON');
      }

      setLoading(false);
    };

    fetchWordsets();
  }, []);

  return (
    <div className="p-4 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Component B: Assembled Wordsets</h2>
      <p className="mb-4 text-sm text-gray-600">
        This component shows batched wordsets generated from the structured prompt components. These are exported by serverB and stored in the <code>wordsets</code> bucket.
      </p>
      {loading ? (
        <p>Loading wordsets...</p>
      ) : wordsets.length === 0 ? (
        <p>No wordsets found in the latest file.</p>
      ) : (
        <ul className="space-y-3">
          {wordsets.map((ws, i) => (
            <li key={i} className="bg-gray-50 border rounded p-3 text-sm">
              {ws.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
