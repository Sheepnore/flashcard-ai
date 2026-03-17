"use client";

import { useState } from "react";

interface FlashCardProps {
  front: string;
  back: string;
  isParaphrased?: boolean;
}

export default function FlashCard({ front, back, isParaphrased }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: "1200px", height: "280px" }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          {isParaphrased && (
            <span className="mb-4 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
              AI Paraphrased
            </span>
          )}
          <p className="text-center text-xl font-semibold text-zinc-800">
            {front}
          </p>
          <p className="mt-4 text-sm text-zinc-400">Click to reveal answer</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 p-8 shadow-sm"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-center text-xl font-semibold text-zinc-800">
            {back}
          </p>
          <p className="mt-4 text-sm text-indigo-400">Click to flip back</p>
        </div>
      </div>
    </div>
  );
}
