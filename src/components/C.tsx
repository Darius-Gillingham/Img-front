'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ComponentC() {
  const [wordsetNames, setWordsetNames] = useState<string[]>([]);

  useEffect(() => {
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
      <p className="text-gray-700 text-sm">
        This component explains what <code>serverC</code> does: it runs continuously, selecting a single wordset JSON from the Supabase <code>wordsets</code> bucket, extracting its keywords, and using them to generate a prompt. That prompt is sent to DALL·E 3 via OpenAI to produce a 1024×1024 image.
      </p>

      <p className="text-gray-700 text-sm">
        Each generated image is uploaded to the <code>generated-images</code> bucket in Supabase with a timestamped filename. This module runs automatically every minute and creates a batch of new images using only one wordset at a time.
      </p>

      <div className="border-t pt-4">
        <h3 className="font-medium text-lg">Recent Wordsets</h3>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {wordsetNames.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
