// File: app/page.tsx
// Commit: structure walkthrough with uniform professional layout for modular components A through C

'use client';

import A from "@/components/A";
import B from "@/components/B";
import C from "@/components/C";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white text-gray-900 px-4 sm:px-8 py-16 space-y-32">
      {[A, B, C].map((Component, index) => (
        <section
          key={index}
          className="w-full max-w-6xl mx-auto space-y-8 border-b pb-24 last:border-none last:pb-0"
        >
          <Component />
        </section>
      ))}
    </main>
  );
}
