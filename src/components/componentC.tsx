'use client';

import { useState } from 'react';

export default function componentC() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [prompts, setPrompts] = useState<string[]>([]);

  async function handleGeneratePrompts() {
    setStatus('loading');
    setMessage('');
    setPrompts([]);

    try {
      const res = await fetch('/api/componentC', {
        method: 'POST'
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      setStatus('success');
      setMessage(`✓ Uploaded prompt file: ${json.filename}`);
      setPrompts(json.prompts || []);
    } catch (err: any) {
      console.error('✗ Failed to generate prompts:', err);
      setStatus('error');
      setMessage('✗ Prompt generation failed');
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={handleGeneratePrompts}
        disabled={status === 'loading'}
        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
      >
        Generate Prompt File from Wordsets
      </button>

      {message && (
        <p className={`text-sm ${status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
          {message}
        </p>
      )}

      {prompts.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Generated Prompts:</h3>
          <ul className="list-disc list-inside text-sm">
            {prompts.map((prompt, i) => (
              <li key={i}>{prompt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
