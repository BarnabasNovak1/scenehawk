# SceneHawk

**Multi-agent RAG film discovery — research prototype (MATE-CS2148).**

Describe the *experience* you want — "isolated and unsettling, slow-burning,
tension through cinematography rather than jump scares" — and a multi-agent
system retrieves evidence from a curated analytical film knowledge base,
ranks matches, and explains *why* each film fits.

## The experiment

Four systems run side by side on the same corpus so the research question
stays honest — *does specialization improve retrieval for
experience-driven film queries?*

| Mode     | System                                                    |
| -------- | --------------------------------------------------------- |
| `content` | Conventional content-based baseline (genres, keywords, popularity) |
| `llm`    | LLM-only — raw query straight to the model, no retrieval  |
| `rag`    | Single-agent RAG — one flat retrieval pass over all analysis |
| `multi`  | Multi-agent RAG — dimension-specialized retrieval + ranking |

## Architecture

```
query → Query Interpreter ─→ structured cinematic criteria
            │
   ┌────────┼─────────┬──────────┐
   ▼        ▼         ▼          ▼
 Theme   Mood/Atm.  Narrative  Visual    ← specialized retrieval agents
   └────────┴─────────┴──────────┘
            ▼
   Recommendation/Exploration ranker  → "Cinematic Match" scores
            ▼
   Explanation agent  → grounded "why it matches" prose
```

Corpus: one metadata chunk + five analytical chunks per film
(themes / atmosphere / narrative / visual / characters), built from
`data/films/*.json`. Retrieval is BM25 by default; OpenAI embeddings
drop in via env var.

## Setup

```bash
npm install
npm run ingest     # validate corpus + stats
npm run dev        # http://localhost:3000
```

**No API key needed** — heuristic interpretation, template explanations,
BM25 retrieval all run locally. Set `OPENAI_API_KEY` in `.env.local`
(see `.env.example`) to enable the LLM-backed agents.

## Commands

```bash
npm run dev                   # dev server
npm run build                 # production build
npm run ingest                # validate film corpus + stats
npm run ingest -- --embed     # precompute embeddings (needs key)
npm run eval                  # run all eval queries × all 4 systems
npm run eval -- --q=q03       # one query
npm run eval -- --mode=multi  # one system
```

Eval output lands in `eval/results-<timestamp>.json` with blank rating
slots for human evaluation (relevance / diversity / explanation /
grounding, 1–5).

## Data model

Each film (`data/films/<id>.json`) carries conventional metadata *and*
deep analytical attributes — the project's actual contribution:

```json
{
  "metadata": { "title", "year", "director", "genres", "popularity" },
  "themes": [...], "atmosphere": [...],
  "narrative": { "pacing", "structure", "storytelling", "dialogue" },
  "visualStyle": { "lighting", "camera", "color", "composition", "editing" },
  "techniques": [...], "jumpScares": "none|minimal|moderate|heavy",
  "analysis": { "themes": "...", "atmosphere": "...", "narrative": "...",
                "visual": "...", "characters": "..." }
}
```

29 films seeded — deliberately *small but deep*, covering popular,
acclaimed, cult, and obscure tiers.

## Swapping providers

Everything behind interfaces:

- **Film store**: `FILM_STORE=local|firebase` → `FilmRepository`
  (`src/lib/data/`). Firestore adapter is a documented stub — doc shape
  maps 1:1 onto the `Film` type.
- **Retrieval**: `RETRIEVER=lexical|embedding` → `Retriever`
  (`src/lib/retrieval/`). Embeddings cached in `data/indexed/`.
- **LLM**: `OPENAI_API_KEY` → `LLMClient` (`src/lib/llm/`). All
  LLM-dependent components degrade to deterministic fallbacks.

## Methodology notes

- **"Cinematic Match" is a retrieval/ranking score**, not a validated
  metric — the UI labels it accordingly.
- The `analysis` fields currently mix authored annotation with
  critical-consensus description. For the paper, each should gain a
  `source` field (review/essay/annotation) for grounding evidence.
- The content-based baseline is intentionally conventional —
  genre/keyword/popularity — so improvements can't be attributed to
  just "more metadata."
