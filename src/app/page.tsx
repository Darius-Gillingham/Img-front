'use client';

import ComponentA from "@/components/ComponentA";
import ComponentB from "@/components/ComponentB";
import ComponentC from "@/components/ComponentC";

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-16 bg-white text-gray-900">
      <h1 className="text-4xl font-bold text-center mb-12">🧬 Image Gen System Dashboard</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Component A – Prompt Component Viewer</h2>
        <ComponentA />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Component B – Generate Wordsets</h2>
        <ComponentB />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Component C – Compose Prompts</h2>
        <ComponentC />
      </section>
    </main>
  );
}
