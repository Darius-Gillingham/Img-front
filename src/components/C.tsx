'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function C() {
  const [wordsets, setWordsets] = useState<string[][]>([]);
  const [examplePrompt, setExamplePrompt] = useState('');

  useEffect(() => {
    async function fetchWordsets() {
      const { data: files, error } = await supabase.storage
        .from('wordsets')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'desc' }
        });

      if (error || !files) {
        console.warn('✗ Failed to list wordsets:', error);
        return;
      }

      const sets: string[][] = [];

      for (const file of files) {
        if (!file.name.endsWith('.json')) continue;
        const { data } = await supabase.storage.from('wordsets').download(file.name);
        if (!data) continue;

        const text = await data.text();
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.wordsets)) {
            sets.push(...parsed.wordsets);
          }
        } catch {
          console.warn(`✗ Failed to parse ${file.name}`);
        }
      }

      setWordsets(sets);

      // Show example prompt using one of them
      if (sets.length > 0) {
        const ws = sets[Math.floor(Math.random() * sets.length)];
        const prompt = `No text overlay. A visual interpretation of: ${ws.join(', ')}.`;
        setExamplePrompt(prompt);
      }
    }

    fetchWordsets();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        This panel demonstrates how <code>serverC</code> works. It reads a single wordset file from Supabase, constructs a prompt like “a visual interpretation of X”, and sends that prompt to DALL·E to generate an image.
      </p>

      {examplePrompt && (
        <div className="p-4 bg-gray-100 border rounded text-sm text-gray-800">
          <strong>Example Prompt:</strong> <br />
          {examplePrompt}
        </div>
      )}

      <p className="text-gray-500 text-sm">
        Images are automatically uploaded to the <code>generated-images</code> bucket.
      </p>
    </div>
  );
}
