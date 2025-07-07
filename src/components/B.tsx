// File: app/components/B.tsx
// Commit: display recent serverB-generated wordsets and explain their origin in prompt_components table

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ComponentB() {
  const [wordsets, setWordsets] = useState<string[][]>([]);
  const [filename, setFilename] = useState<string | null>(null);

  useEffect(() => {
    async function loadLatestWordset() {
      const { data: files, error: listError } = await supabase.storage
        .from('wordsets')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'desc' },
        });

      if (listError || !files || files.length === 0) {
        console.warn('✗ Failed to list wordset files:', listError);
        return;
      }

      const latest = files.find(f => f.name.endsWith('.json'));
      if (!latest) return;

      setFilename(latest.name);

      const { data: fileData, error: downloadError } = await supabase.storage
        .from('wordsets')
        .download(latest.name);

      if (downloadError || !fileData) {
        console.warn('✗ Failed to download latest wordset:', downloadError);
        return;
      }

      const text = await fileData.text();
      const parsed = JSON.parse(text);
      if (parsed?.wordsets && Array.isArray(parsed.wordsets)) {
        setWordsets(parsed.wordsets.slice(0, 10)); // Show up to 10
      }
    }

    loadLatestWordset();
  }, []);

  return (
    <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
      <p>
        This panel displays real-time introspection of the <code>serverB.js</code> backend process. That script constructs
        wordsets by randomly sampling from a Supabase table called <code>prompt_components</code>, which contains nine key columns:
      </p>

      <ul className="list-disc list-inside pl-4">
        <li>noun1</li>
        <li>noun2</li>
        <li>verb</li>
        <li>adjective1</li>
        <li>adjective2</li>
        <li>style</li>
        <li>setting</li>
        <li>era</li>
        <li>mood</li>
      </ul>

      <p>
        From this table, <code>serverB.js</code> selects one random value per column to create a single wordset array. It batches 20 of these
        into a JSON structure and uploads them into the <code>wordsets</code> storage bucket with timestamped filenames.
      </p>

      {filename && (
        <div className="bg-gray-50 border rounded p-3 text-xs text-gray-600">
          <div className="mb-2 font-medium">Loaded from: <code>{filename}</code></div>
          <div className="space-y-1">
            {wordsets.map((set, i) => (
              <div key={i} className="font-mono truncate">
                [{set.map(word => `"${word}"`).join(', ')}]
              </div>
            ))}
          </div>
        </div>
      )}

      {!filename && (
        <p className="text-gray-500">No wordsets available for display.</p>
      )}
    </div>
  );
}
