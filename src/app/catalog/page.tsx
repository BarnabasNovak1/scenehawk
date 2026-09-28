import Link from "next/link";
import { getFilmRepository } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Analysis Index" };

// The corpus as an index — every film's analytical profile at a glance.
// This is what makes SceneHawk different from a metadata catalog:
// each entry is really five short essays + structured attributes.
export default async function CatalogPage() {
  const films = await getFilmRepository().listFilms();

  return (
    <div className="pt-16">
      <p className="text-[11px] tracking-[0.35em] uppercase text-[#e0632f] mb-4">
        Analysis
      </p>
      <h1 className="font-display text-4xl md:text-5xl mb-3">
        The corpus, <em className="text-[#e0632f]">analyzed.</em>
      </h1>
      <p className="text-[#8f8b82] max-w-xl mb-12 text-sm leading-relaxed">
        {films.length} films — each with structured attributes and five
        analytical dimensions (themes, atmosphere, narrative, visual
        language, inner lives). Deliberately small but deep.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {films.map((f) => (
          <Link
            key={f.id}
            href={`/film/${f.id}`}
            className="rounded-xl border border-[#2a2825] bg-[#141315] p-5 hover:border-[#e0632f]/60 transition-colors"
          >
            <p className="font-display text-lg font-semibold leading-snug">
              {f.metadata.title}
            </p>
            <p className="mt-1 text-xs text-[#8f8b82]">
              {f.metadata.year} · {f.metadata.director}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {f.atmosphere.slice(0, 3).map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-[#3a372f] px-2 py-0.5 text-[10px] text-[#b7b2a7]"
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-wider text-[#6b675f]">
              {f.metadata.popularity} · {f.narrative.pacing}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
