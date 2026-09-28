import Link from "next/link";
import { notFound } from "next/navigation";
import AskBox from "@/components/AskBox";
import { getFilmRepository } from "@/lib/data";
import { exploreConnections } from "@/lib/explore";

export const dynamic = "force-dynamic";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#3a372f] px-3 py-1 text-xs text-[#b7b2a7]">
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#2a2825] bg-[#141315] p-6">
      <h2 className="mb-4 text-xs uppercase tracking-[0.25em] text-[#e0632f]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function KV({ k, v }: { k: string; v?: string }) {
  if (!v) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-28 shrink-0 capitalize text-[#8f8b82]">{k}</span>
      <span className="text-[#ece7df]">{v}</span>
    </div>
  );
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repo = getFilmRepository();
  const [film, catalog] = await Promise.all([
    repo.getFilm(id),
    repo.listFilms(),
  ]);
  if (!film) notFound();

  const m = film.metadata;
  const connections = exploreConnections(film, catalog);

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[#8f8b82] mb-2">
          {m.genres.join(" · ")} · {m.runtime} min
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
          {m.title}
          <span className="ml-3 text-xl font-normal text-[#8f8b82]">
            {m.year}
          </span>
        </h1>
        <p className="mt-2 text-[#8f8b82]">
          dir. {m.director} · {m.popularity} title
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Atmosphere">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {film.atmosphere.map((a) => (
              <Tag key={a}>{a}</Tag>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-[#b7b2a7]">
            {film.analysis.atmosphere}
          </p>
        </Section>

        <Section title="Narrative">
          <div className="mb-4 space-y-1.5">
            <KV k="pacing" v={film.narrative.pacing} />
            <KV k="structure" v={film.narrative.structure} />
            <KV k="storytelling" v={film.narrative.storytelling} />
            <KV k="dialogue" v={film.narrative.dialogue} />
          </div>
          <p className="text-sm leading-relaxed text-[#b7b2a7]">
            {film.analysis.narrative}
          </p>
        </Section>

        <Section title="Visual language">
          <div className="mb-4 space-y-1.5">
            {Object.entries(film.visualStyle).map(([k, v]) => (
              <KV key={k} k={k} v={v} />
            ))}
          </div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {film.techniques.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-[#b7b2a7]">
            {film.analysis.visual}
          </p>
        </Section>

        <Section title="Themes & symbols">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {film.themes.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <p className="mb-4 text-sm leading-relaxed text-[#b7b2a7]">
            {film.analysis.themes}
          </p>
          {film.symbols && film.symbols.length > 0 && (
            <p className="text-xs text-[#8f8b82]">
              Recurring images: {film.symbols.join(" · ")}
            </p>
          )}
        </Section>
      </div>

      <div className="mt-4">
        <Section title="Inner lives">
          <p className="text-sm leading-relaxed text-[#b7b2a7]">
            {film.analysis.characters}
          </p>
          <p className="mt-3 text-xs text-[#8f8b82]">
            Jump-scare level: {film.jumpScares}
          </p>
        </Section>
      </div>

      {/* Exploration — cross-dimensional connections */}
      {connections.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xs uppercase tracking-[0.25em] text-[#8f8b82]">
            Explore its connections
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {connections.map((c) => (
              <Link
                key={c.film.id}
                href={`/film/${c.film.id}`}
                className="rounded-xl border border-[#2a2825] bg-[#141315] p-5 hover:border-[#e0632f]/60 transition-colors"
              >
                <p className="text-[11px] uppercase tracking-wider text-[#e0632f]">
                  {c.relation}
                </p>
                <p className="mt-2 font-semibold">
                  {c.film.metadata.title}
                  <span className="ml-2 text-sm font-normal text-[#8f8b82]">
                    {c.film.metadata.year}
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ask about this film — RAG over its analytical chunks */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs uppercase tracking-[0.25em] text-[#8f8b82]">
          Ask about this film
        </h2>
        <AskBox filmId={film.id} />
      </section>
    </div>
  );
}
