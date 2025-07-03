'use client';

import A from "@/components/A";
import B from "@/components/B";
import C from "@/components/C";

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-16 bg-white text-gray-900">
      <h1 className="text-4xl font-bold text-center mb-12">🧬 Image Gen System Dashboard</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">A – Prompt Component Viewer</h2>
        <A />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">B – Generate Wordsets</h2>
        <B />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">C – Compose Prompts</h2>
        <C />
      </section>
    </main>
  );
}
