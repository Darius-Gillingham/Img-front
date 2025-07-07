'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ComponentSet = {
  noun1: string;
  noun2: string;
  verb: string;
  adjective1: string;
  adjective2: string;
  style: string;
  setting: string;
  era: string;
  mood: string;
};

const columns: (keyof ComponentSet)[] = [
  'noun1', 'noun2', 'verb',
  'adjective1', 'adjective2',
  'style', 'setting', 'era', 'mood'
];

export default function A() {
  const [rows, setRows] = useState<ComponentSet[]>([]);
  const [scramble, setScramble] = useState<ComponentSet | null>(null);

  useEffect(() => {
    async function loadPromptComponentRows() {
      const { data } = await supabase
        .from('prompt_components')
        .select('*')
        .order('id', { ascending: false })
        .limit(20);

      if (data) {
        setRows(data as ComponentSet[]);
      }
    }

    loadPromptComponentRows();
  }, []);

  function generateScramble() {
    const randomSet: ComponentSet = {
      noun1: '',
      noun2: '',
      verb: '',
      adjective1: '',
      adjective2: '',
      style: '',
      setting: '',
      era: '',
      mood: '',
    };

    for (const key of columns) {
      const pool = rows.map(row => row[key]).filter(Boolean);
      randomSet[key] = pool[Math.floor(Math.random() * pool.length)];
    }

    setScramble(randomSet);
  }

  return (
    <div className="space-y-8 text-gray-800 text-sm max-w-4xl mx-auto">
      {/* ...all content unchanged... */}
    </div>
  );
}
