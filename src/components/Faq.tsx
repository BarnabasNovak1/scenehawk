"use client";

import { useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#2a2825] border-t border-b border-[#2a2825]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center gap-4 py-5 text-left group"
          >
            <span className="flex-1 text-base sm:text-lg text-[#ece7df] group-hover:text-[#e0632f] transition-colors">
              {item.q}
            </span>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#3a372f] text-[#8f8b82] transition-transform duration-200 ${
                open === i ? "rotate-180 border-[#e0632f] text-[#e0632f]" : ""
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 4.5L6 8.5L10 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          {open === i && (
            <div className="pb-5 pr-10 text-sm leading-relaxed text-[#b7b2a7]">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
