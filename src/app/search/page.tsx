import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import SearchBox from "@/components/SearchBox";
import { getFilmRepository } from "@/lib/data";
import { buildAgentContext, runSearch } from "@/lib/pipelines";
import {
  PIPELINE_LABELS,
  PIPELINE_MODES,
  type PipelineMode,
} from "@/lib/types";

export const dynamic = "force-dynamic";

const STARTERS = [
  "Something isolated and unsettling where the tension builds slowly without jump scares",
  "Something melancholic and visually beautiful about loneliness",
  "Incredible cinematography, long takes, meditative pacing",
  "An obscure psychological horror film — a hidden gem",
  "A mystery that deliberately refuses to resolve",
  "Slow contemplative sci-fi rather than action-packed",
];

function Chip({ label, values }: { label: string; values: string[] }) {
  if (!values.length) return null;
  return (
    <span className="rounded-full border border-[#3a372f] px-3 py-1 text-xs text-[#b7b2a7]">
      <span className="text-[#8f8b82]">{label}:</span> {values.join(", ")}
    </span>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mode?: string }>;
}) {
  const { q = "", mode: rawMode } = await searchParams;
  const mode = (PIPELINE_MODES as string[]).includes(rawMode ?? "")
    ? (rawMode as PipelineMode)
    : "multi";

  const films = await getFilmRepository().listFilms();
  const ctx = await buildAgentContext(films);
  const result = q ? await runSearch(q, mode, ctx) : null;
  const i = result?.interpretation;

  return (
    <div className="pt-12">
      <div className="max-w-2xl mx-auto">
        {!q && (
          <div className="mb-10 text-center">
            <p className="text-[11px] tracking-[0.35em] uppercase text-[#e0632f] mb-4">
              Discover
            </p>
            <h1 className="font-display text-3xl md:text-4xl mb-3">
              What are you in the <em className="text-[#e0632f]">mood</em> for?
            </h1>
            <p className="text-sm text-[#8f8b82] mb-6">
              Describe the experience — not the genre.
            </p>
          </div>
        )}
        <SearchBox initial={q} mode={mode} />
      </div>

      {!q && (
        <div className="mt-10 max-w-2xl mx-auto">
          <p className="mb-3 text-center text-[10px] uppercase tracking-[0.25em] text-[#8f8b82]">
            Try asking
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {STARTERS.map((s) => (
              <Link
                key={s}
                href={`/search?q=${encodeURIComponent(s)}&mode=multi`}
                className="rounded-full border border-[#2a2825] bg-[#141315] px-4 py-2 text-xs text-[#b7b2a7] hover:border-[#e0632f] hover:text-[#e0632f] transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* System selector — this is the research comparison */}
      {q && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {PIPELINE_MODES.map((m) => (
            <Link
              key={m}
              href={`/search?q=${encodeURIComponent(q)}&mode=${m}`}
              className={`rounded-full px-4 py-1.5 text-xs border transition-colors ${
                m === mode
                  ? "border-[#e0632f] text-[#e0632f]"
                  : "border-[#2a2825] text-[#8f8b82] hover:text-[#b7b2a7]"
              }`}
            >
              {PIPELINE_LABELS[m]}
            </Link>
          ))}
        </div>
      )}

      {result && (
        <>
          {result.note && (
            <p className="mx-auto mt-6 max-w-2xl rounded-lg border border-[#3a3327] bg-[#1c1713] px-4 py-3 text-xs text-[#d4a06a]">
              {result.note}
            </p>
          )}

          {i && (i.source === "llm" || mode === "multi" || mode === "rag") && (
            <div className="mx-auto mt-6 max-w-3xl">
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#8f8b82]">
                Interpreted as · {i.source}
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip label="themes" values={i.themes} />
                <Chip label="mood" values={i.mood} />
                <Chip label="pacing" values={i.pacing} />
                <Chip label="narrative" values={i.narrative} />
                <Chip label="visual" values={i.visual} />
                <Chip label="avoid" values={i.avoid} />
                <Chip label="genres" values={i.genres} />
                {i.preferObscure && (
                  <span className="rounded-full border border-[#3a3327] px-3 py-1 text-xs text-[#d4a06a]">
                    prefer: lesser-known
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#8f8b82]">
              Your cinematic matches — {PIPELINE_LABELS[mode]}
            </p>
            {result.results.length === 0 && (
              <p className="rounded-lg border border-[#2a2825] bg-[#141315] p-6 text-sm text-[#8f8b82]">
                No matches surfaced. Try different descriptors — mood,
                pacing, themes, visual style — or switch systems above.
              </p>
            )}
            {result.results.map((s) => (
              <MatchCard key={s.film.id} score={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
