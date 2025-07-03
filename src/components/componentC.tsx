// src/components/ComponentC.tsx
import React from 'react';

const ComponentC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 text-sm text-neutral-800">
      <h2 className="text-lg font-semibold">ServerC: Image Generation from Wordsets</h2>
      <p>
        This module continuously runs a loop that generates AI images using OpenAI's DALL·E model, based on wordsets
        stored in Supabase. It no longer uses combinations of two wordsets—instead, each image is derived from a
        single wordset to improve prompt clarity and reduce visual ambiguity.
      </p>
      <p>
        Here's how the updated flow works:
      </p>
      <ol className="list-decimal list-inside space-y-1">
        <li>
          <strong>Fetch Wordsets:</strong> All JSON files in the <code>wordsets</code> bucket of Supabase are listed
          and downloaded. The valid files are parsed and flattened into an array of wordsets.
        </li>
        <li>
          <strong>Build Prompts:</strong> One random wordset is selected for each image. The wordset is formatted into a
          prompt of the form: <br />
          <code>No text overlay. A visual interpretation of: [wordset items]</code>
        </li>
        <li>
          <strong>Generate Image:</strong> The prompt is sent to the DALL·E 3 API with a request for a single
          1024x1024 image.
        </li>
        <li>
          <strong>Download & Upload:</strong> The generated image is fetched from the returned URL, and then uploaded
          to the <code>generated-images</code> bucket with a timestamped filename.
        </li>
        <li>
          <strong>Looping:</strong> The process repeats every 60 seconds, generating a new batch of images using fresh
          randomly selected wordsets.
        </li>
      </ol>
      <p>
        This version eliminates pairing logic and focuses on stronger one-to-one visual mappings, creating cleaner,
        more interpretable results per image.
      </p>
    </div>
  );
};

export default ComponentC;
