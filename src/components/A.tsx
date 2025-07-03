'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function A() {
  const [wordsets, setWordsets] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWordsets() {
      const { data: files, error } = await supabase.storage.from('wordsets').list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'desc' }
      });

      if (error || !files) {
        console.warn('✗ Failed to list wordsets:', error);
        setLoading(false);
        return;
      }

      const allWordsets: string[][] = [];

      for (const file of files) {
        if (!file.name.endsWith('.json')) continue;

        const { data, error } = await supabase.storage.from('wordsets').download(file.name);
        if (error || !data) continue;

        const text = await data.text();
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.wordsets)) {
            allWordsets.push(...parsed.wordsets);
          }
        } catch {
          console.warn(`✗ Failed to parse ${file.name}`);
        }
      }

      setWordsets(allWordsets);
      setLoading(false);
    }

    fetchWordsets();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        This panel shows all wordsets retrieved from the Supabase <code>wordsets</code> storage bucket.
        These are used by image generators like serverC to produce prompts.
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">Loading wordsets...</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">Found {wordsets.length} wordsets:</p>
          <ul className="grid gap-2 text-sm list-disc list-inside">
            {wordsets.map((ws, i) => (
              <li key={i} className="bg-gray-100 p-2 rounded-md">
                {ws.join(', ')}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
