"use client";

import { useState } from "react";

interface AskResponse {
  answer: string;
  source: "llm" | "template";
  dimension?: string;
}

export default function AskBox({ filmId }: { filmId: string }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<
    { q: string; r: AskResponse }[]
  >([]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const question = q.trim();
    if (!question) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/films/${filmId}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const r = (await res.json()) as AskResponse;
      setResponses((prev) => [{ q: question, r }, ...prev]);
      setQ("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#2a2825] bg-[#141315] p-6">
      <form onSubmit={ask} className="flex flex-col sm:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='e.g. "Why does this feel unsettling?" or "How does the cinematography build tension?"'
          className="flex-1 rounded-lg border border-[#2a2825] bg-[#0a0a0a] px-4 py-3 text-sm placeholder:text-[#6b675f] focus:border-[#e0632f] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#e0632f] px-6 py-3 text-sm font-semibold text-black hover:bg-[#ea7443] disabled:opacity-50 transition-colors"
        >
          {loading ? "…" : "Ask"}
        </button>
      </form>

      {responses.length > 0 && (
        <div className="mt-5 space-y-4">
          {responses.map(({ q, r }, idx) => (
            <div key={idx} className="border-t border-[#2a2825] pt-4">
              <p className="text-sm text-[#8f8b82]">Q: {q}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#ece7df]">
                {r.answer}
              </p>
              {r.dimension && (
                <p className="mt-2 text-[10px] uppercase tracking-wider text-[#8f8b82]">
                  grounded in: {r.dimension} analysis · {r.source}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
