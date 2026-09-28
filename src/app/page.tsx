import Link from "next/link";
import Faq, { type FaqItem } from "@/components/Faq";

const STEPS = [
  {
    n: "01",
    title: "Describe the feeling",
    body: "Atmosphere, pacing, visual language — 'isolated and unsettling, slow burn, no jump scares.'",
  },
  {
    n: "02",
    title: "Agents search the analysis",
    body: "Specialized agents retrieve evidence across themes, mood, narrative structure, and cinematography.",
  },
  {
    n: "03",
    title: "Get matches with reasons",
    body: "Every recommendation is ranked and explained — grounded in the analysis it was retrieved from.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "What is SceneHawk?",
    a: "A film discovery system that searches by experience — atmosphere, pacing, and visual language — instead of genre labels or ratings. Under the hood it's a multi-agent pipeline running over a curated analytical film corpus.",
  },
  {
    q: "How is this different from IMDb or Netflix?",
    a: "IMDb indexes metadata; Netflix ranks by watch history and genre. SceneHawk retrieves how films actually feel — the dread, the pacing, the cinematography — and explains why each match fits your request.",
  },
  {
    q: "Where does the film analysis come from?",
    a: "A curated knowledge base of structured analytical profiles: themes, atmosphere, narrative structure, visual style, and technique for each film. The corpus is deliberately small but deep — this is a research prototype, not a catalog of everything.",
  },
  {
    q: "What does a match score actually mean?",
    a: "It's a retrieval score — how strongly a film's analytical profile matches the criteria you described. It's not a quality rating and isn't scientifically validated; it's evidence weight, honestly labeled.",
  },
  {
    q: "Why recommend films I've never heard of?",
    a: "Conventional systems surface the same popular titles. SceneHawk's corpus deliberately includes cult and obscure films — matching on experience rather than popularity surfaces things genre filters bury.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="pt-14 md:pt-28 pb-16 md:pb-24 max-w-3xl">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[#e0632f] mb-6 md:mb-8">
          Multi-agent film discovery
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.08] tracking-tight mb-6 md:mb-8">
          Describe the film
          <br />
          you want to <em className="text-[#e0632f]">feel.</em>
        </h1>
        <p className="text-lg leading-relaxed text-[#b7b2a7] max-w-xl mb-12">
          For people who know what kind of evening they want but not which
          title delivers it. Search by atmosphere, pacing, and visual
          language instead of genre, rating, or what you watched last.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/search"
            className="rounded-full bg-[#e0632f] px-7 py-3.5 font-medium text-[#0a0a0a] hover:bg-[#ea7443] transition-colors"
          >
            Start a search →
          </Link>
          <a
            href="#how-it-works"
            className="rounded-full border border-[#3a372f] px-7 py-3.5 font-medium text-[#ece7df] hover:border-[#e0632f] hover:text-[#e0632f] transition-colors"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-12 md:py-20 border-t border-[#2a2825]"
      >
        <div className="grid gap-10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n}>
              <p className="font-display text-sm text-[#e0632f] mb-3">
                {s.n}
              </p>
              <h3 className="font-display text-2xl mb-3">{s.title}</h3>
              <p className="text-sm leading-relaxed text-[#8f8b82]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="py-16 md:py-24 border-t border-[#2a2825]">
        <h2 className="font-display text-4xl md:text-5xl mb-8">
          <em className="text-[#e0632f]">FAQ</em>
        </h2>
        <div className="max-w-3xl">
          <Faq items={FAQS} />
        </div>
      </section>
    </div>
  );
}
