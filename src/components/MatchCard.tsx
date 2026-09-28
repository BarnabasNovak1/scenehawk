import Link from "next/link";
import type { Dimension, FilmScore } from "@/lib/types";

const DIM_LABEL: Record<string, string> = {
  themes: "Themes",
  atmosphere: "Atmosphere",
  narrative: "Narrative",
  visual: "Visual style",
  characters: "Characters",
};

export default function MatchCard({ score }: { score: FilmScore }) {
  const m = score.film.metadata;
  const dims = Object.keys(score.dimensionScores) as Dimension[];

  return (
    <Link
      href={`/film/${score.film.id}`}
      className="block rounded-xl border border-[#2a2825] bg-[#141315] p-6 hover:border-[#e0632f]/60 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-semibold">
            {m.title}
            <span className="ml-2 text-sm font-normal text-[#8f8b82]">
              {m.year} · dir. {m.director}
            </span>
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wider text-[#8f8b82]">
            {m.genres.join(" · ")}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-semibold text-[#e0632f]">
            {score.displayScore}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[#8f8b82]">
            cinematic match
          </div>
        </div>
      </div>

      {dims.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dims.map((d) => (
            <span
              key={d}
              className="rounded-full border border-[#3a372f] px-2.5 py-0.5 text-[11px] text-[#b7b2a7]"
            >
              {DIM_LABEL[d]}
            </span>
          ))}
        </div>
      )}

      {score.explanation && (
        <p className="mt-4 text-sm leading-relaxed text-[#b7b2a7]">
          {score.explanation}
        </p>
      )}
    </Link>
  );
}
