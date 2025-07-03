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

export default function ComponentA() {
  const [sets, setSets] = useState<ComponentSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComponentSets = async () => {
      const { data, error } = await supabase
        .from('prompt_components')
        .select('*')
        .order('id', { ascending: false })
        .limit(5);

      if (error) {
        console.error('✗ Failed to fetch component sets:', error);
      } else {
        setSets(data);
      }

      setLoading(false);
    };

    fetchComponentSets();
  }, []);

  return (
    <div className="p-4 bg-white border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Component A: Prompt Building Blocks</h2>
      <p className="mb-4 text-sm text-gray-600">
        The server populates this list by combining nouns, verbs, adjectives, and stylistic elements from GPT into a structured format.
      </p>
      {loading ? (
        <p>Loading recent sets...</p>
      ) : sets.length === 0 ? (
        <p>No component sets found.</p>
      ) : (
        <ul className="space-y-4">
          {sets.map((set, i) => (
            <li key={i} className="p-3 bg-gray-50 border rounded">
              <div><strong>Nouns:</strong> {set.noun1}, {set.noun2}</div>
              <div><strong>Verb:</strong> {set.verb}</div>
              <div><strong>Adjectives:</strong> {set.adjective1}, {set.adjective2}</div>
              <div><strong>Style:</strong> {set.style}</div>
              <div><strong>Setting:</strong> {set.setting}</div>
              <div><strong>Era:</strong> {set.era}</div>
              <div><strong>Mood:</strong> {set.mood}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
