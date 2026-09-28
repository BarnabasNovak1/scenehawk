"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({
  initial = "",
  mode = "multi",
}: {
  initial?: string;
  mode?: string;
}) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}&mode=${mode}`);
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Something unsettling and slow-burning…"
          className="flex-1 rounded-lg border border-[#2a2825] bg-[#141315] px-5 py-4 text-base placeholder:text-[#6b675f] focus:border-[#e0632f] focus:outline-none"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-lg bg-[#e0632f] px-8 py-4 font-semibold text-black hover:bg-[#ea7443] transition-colors"
        >
          Explore
        </button>
      </div>
    </form>
  );
}
