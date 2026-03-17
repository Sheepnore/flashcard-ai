"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getDeck, updateCard } from "@/lib/storage";
import { getDueCards, reviewCard } from "@/lib/spaced-rep";
import type { Card, Deck, StudyRating } from "@/types";
import FlashCard from "@/components/flashcard/FlashCard";
import RatingBar from "@/components/flashcard/RatingBar";
import Button from "@/components/ui/Button";

export default function StudyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [queue, setQueue] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  // AI paraphrase state
  const [paraphrased, setParaphrased] = useState<{ front: string; back: string } | null>(null);
  const [paraphrasing, setParaphrasing] = useState(false);
  const [paraphraseError, setParaphraseError] = useState(false);

  useEffect(() => {
    const d = getDeck(id);
    if (!d) { router.push("/"); return; }
    setDeck(d);
    const due = getDueCards(d.cards);
    if (due.length === 0) {
      // If nothing due, study all cards
      setQueue(d.cards);
    } else {
      setQueue(due);
    }
  }, [id, router]);

  const currentCard = queue[current];

  const fetchParaphrase = useCallback(async (card: Card) => {
    setParaphrased(null);
    setParaphraseError(false);
    setParaphrasing(true);
    try {
      const res = await fetch("/api/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front: card.front, back: card.back }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setParaphrased(data);
    } catch {
      setParaphraseError(true);
    } finally {
      setParaphrasing(false);
    }
  }, []);

  function handleRate(rating: StudyRating) {
    if (!currentCard) return;

    const updates = reviewCard(currentCard, rating);
    const updatedCard = { ...currentCard, ...updates };
    updateCard(id, updatedCard);
    setReviewed((r) => r + 1);

    // Clear paraphrase for next card
    setParaphrased(null);
    setParaphraseError(false);

    if (current + 1 >= queue.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  if (!deck || queue.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">✅</p>
        <p className="text-zinc-600 mb-6">No cards to study right now.</p>
        <Link href="/">
          <Button variant="secondary">Back to Decks</Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Session Complete!</h2>
        <p className="text-zinc-500 mb-8">
          You reviewed {reviewed} card{reviewed !== 1 ? "s" : ""}.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/">
            <Button variant="secondary">Back to Decks</Button>
          </Link>
          <Button
            onClick={() => {
              const d = getDeck(id);
              if (d) {
                setDeck(d);
                setQueue(getDueCards(d.cards).length > 0 ? getDueCards(d.cards) : d.cards);
                setCurrent(0);
                setDone(false);
                setReviewed(0);
              }
            }}
          >
            Study Again
          </Button>
        </div>
      </div>
    );
  }

  const displayCard = paraphrased ?? currentCard;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-indigo-600">Decks</Link>
          <span>/</span>
          <Link href={`/decks/${id}`} className="hover:text-indigo-600">{deck.name}</Link>
          <span>/</span>
          <span className="text-zinc-800 font-medium">Study</span>
        </div>
        <span className="text-sm text-zinc-500">
          {current + 1} / {queue.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-1.5 rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${((current) / queue.length) * 100}%` }}
        />
      </div>

      <FlashCard
        front={displayCard.front}
        back={displayCard.back}
        isParaphrased={!!paraphrased}
      />

      <div className="mt-6 flex flex-col items-center gap-4">
        {/* AI Paraphrase button */}
        <button
          onClick={() => fetchParaphrase(currentCard)}
          disabled={paraphrasing || !!paraphrased}
          className="text-sm text-indigo-500 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {paraphrasing
            ? "✨ Paraphrasing..."
            : paraphrased
            ? "✨ Showing AI version"
            : "✨ Challenge me with AI paraphrase"}
        </button>
        {paraphraseError && (
          <p className="text-xs text-red-500">
            Could not paraphrase — make sure ANTHROPIC_API_KEY is set.
          </p>
        )}

        <div className="w-full">
          <p className="text-center text-xs text-zinc-400 mb-3">
            How well did you know this?
          </p>
          <RatingBar onRate={handleRate} />
        </div>
      </div>
    </div>
  );
}
