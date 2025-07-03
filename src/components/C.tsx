'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ComponentC() {
  const [wordsetNames, setWordsetNames] = useState<string[]>([]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    async function fetchWordsetList() {
      const { data, error } = await supabase.storage.from('wordsets').list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'desc' }
      });

      if (error) {
        console.warn('✗ Failed to list wordsets:', error);
        return;
      }

      const names = data?.filter(f => f.name.endsWith('.json')).map(f => f.name) || [];
      setWordsetNames(names);
    }

    fetchWordsetList();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-lg">Component C explains what <strong>serverC</strong> does:</p>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Fetches all available wordset files from the <code>wordsets</code> Supabase bucket.</li>
        <li>Constructs a DALL·E 3 prompt for each wordset (e.g., “No text overlay. A visual interpretation of: dog, spaceship, ocean”).</li>
        <li>Calls OpenAI’s image generation API with each prompt.</li>
        <li>Downloads and uploads generated PNGs to the <code>generated-images</code> Supabase bucket.</li>
        <li>Runs this process in a loop at a fixed interval (default: 1 minute).</li>
      </ul>
      <div>
        <h3 className="mt-6 font-semibold">Recently Discovered Wordsets:</h3>
        <ul className="list-inside list-disc text-sm text-gray-600">
          {wordsetNames.map(name => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
