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
      {/* Header */}
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-blue-900">Step 1: Prompt Vocabulary Generation</h2>
        <p>
          This step creates the foundation for the entire image generation pipeline. The backend script <code>serverA.js</code> uses GPT-4 to
          generate structured, creative prompt components. These components are inserted into a Supabase table called <code>prompt_components</code>.
        </p>
        <p>
          Each inserted row contains exactly 9 fields, grouped to form a complete and coherent image concept. The generation prompt
          explicitly enforces format and variety. No simulation is done here — this system runs live, continuously, and in production.
        </p>
      </header>

      {/* Technical Steps */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">How It Works</h3>
        <ol className="list-decimal list-inside space-y-2 pl-2">
          <li>
            GPT-4 is prompted to generate a valid JSON object with these exact keys:
            <code className="block bg-gray-100 p-2 rounded mt-1 whitespace-pre overflow-auto text-xs">
              {'{\n  "noun1": "...",\n  "noun2": "...",\n  "verb": "...",\n  "adjective1": "...",\n  "adjective2": "...",\n  "style": "...",\n  "setting": "...",\n  "era": "...",\n  "mood": "..."\n}'}
            </code>
          </li>
          <li>
            The raw JSON output is parsed and checked for validity. If parsing fails, the output is discarded silently.
          </li>
          <li>
            If the result is valid, the script checks Supabase for a duplicate by doing an exact-match lookup across all 9 fields.
          </li>
          <li>
            If it is not a duplicate, the row is inserted into the <code>prompt_components</code> table.
          </li>
          <li>
            The process then loops indefinitely, generating a new set every 10 seconds.
          </li>
        </ol>
      </section>

      {/* Live Preview */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Recent Component Sets</h3>
        <ul className="grid gap-4">
          {rows.map((set, i) => (
            <li key={i} className="bg-gray-50 border rounded-md p-3 text-xs font-mono space-y-1 leading-snug">
              <div><strong>noun1:</strong> {set.noun1}</div>
              <div><strong>noun2:</strong> {set.noun2}</div>
              <div><strong>verb:</strong> {set.verb}</div>
              <div><strong>adjective1:</strong> {set.adjective1}</div>
              <div><strong>adjective2:</strong> {set.adjective2}</div>
              <div><strong>style:</strong> {set.style}</div>
              <div><strong>setting:</strong> {set.setting}</div>
              <div><strong>era:</strong> {set.era}</div>
              <div><strong>mood:</strong> {set.mood}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Scramble Simulation */}
      <section className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium text-gray-700">Generate Scrambled Wordset</h3>
        <button
          onClick={generateScramble}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Scramble Wordset
        </button>

        {scramble && (
          <div className="bg-white border rounded-md p-4 text-xs font-mono space-y-1 leading-snug mt-4">
            <div><strong>noun1:</strong> {scramble.noun1}</div>
            <div><strong>noun2:</strong> {scramble.noun2}</div>
            <div><strong>verb:</strong> {scramble.verb}</div>
            <div><strong>adjective1:</strong> {scramble.adjective1}</div>
            <div><strong>adjective2:</strong> {scramble.adjective2}</div>
            <div><strong>style:</strong> {scramble.style}</div>
            <div><strong>setting:</strong> {scramble.setting}</div>
            <div><strong>era:</strong> {scramble.era}</div>
            <div><strong>mood:</strong> {scramble.mood}</div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="pt-4 text-gray-500 text-xs border-t">
        This module reflects the live output of GPT-driven prompt vocabulary generation. All entries are real data directly from your Supabase table.
      </footer>
    </div>
  );
}
