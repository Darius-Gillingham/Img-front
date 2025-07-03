'use client';

import { useEffect, useState } from 'react';

type PromptComponentSet = {
  id: number;
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
  const [sets, setSets] = useState<PromptComponentSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComponentSets() {
      try {
        const res = await fetch('/api/componentA');
        const json = await res.json();
        setSets(json.data);
      } catch (err) {
        console.error('✗ Failed to load prompt components:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchComponentSets();
  }, []);

  if (loading) return <p>Loading prompt components...</p>;

  return (
    <div className="space-y-4">
      {sets.length === 0 ? (
        <p>No prompt components found.</p>
      ) : (
        sets.map((set) => (
          <div key={set.id} className="p-4 border rounded shadow">
            <p><strong>Nouns:</strong> {set.noun1}, {set.noun2}</p>
            <p><strong>Verb:</strong> {set.verb}</p>
            <p><strong>Adjectives:</strong> {set.adjective1}, {set.adjective2}</p>
            <p><strong>Style:</strong> {set.style}</p>
            <p><strong>Setting:</strong> {set.setting}</p>
            <p><strong>Era:</strong> {set.era}</p>
            <p><strong>Mood:</strong> {set.mood}</p>
          </div>
        ))
      )}
    </div>
  );
}
