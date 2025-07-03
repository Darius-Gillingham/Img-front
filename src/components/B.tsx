'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function B() {
  const [inputWords, setInputWords] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const words = inputWords
      .split(',')
      .map(w => w.trim())
      .filter(Boolean);

    if (words.length === 0) {
      setMessage('Please enter at least one word.');
      return;
    }

    const wordsetObj = { wordsets: [words] };
    const fileName = `wordset-${Date.now()}.json`;

    const { error } = await supabase.storage
      .from('wordsets')
      .upload(fileName, JSON.stringify(wordsetObj), {
        contentType: 'application/json'
      });

    if (error) {
      console.error(error);
      setMessage('✗ Upload failed.');
    } else {
      setMessage(`✓ Wordset uploaded as ${fileName}`);
      setInputWords('');
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        This panel mimics <code>serverB</code>, which creates new wordset JSON files and uploads them to the <code>wordsets</code> bucket in Supabase. Input a list of descriptive words and submit to generate a new wordset.
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={inputWords}
          onChange={e => setInputWords(e.target.value)}
          placeholder="Enter words, separated by commas"
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload Wordset
        </button>
      </form>

      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}
