"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getDeck, saveDeck, createCard, deleteCard } from "@/lib/storage";
import type { Deck } from "@/types";
import Button from "@/components/ui/Button";

const MAX_WORDS = 50;

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [showForm, setShowForm] = useState(false);

  const frontWords = wordCount(front);
  const backWords = wordCount(back);
  const frontOver = frontWords > MAX_WORDS;
  const backOver = backWords > MAX_WORDS;

  useEffect(() => {
    const d = getDeck(id);
    if (!d) router.push("/");
    else setDeck(d);
  }, [id, router]);

  function refresh() {
    setDeck(getDeck(id) ?? null);
  }

  function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim() || frontOver || backOver) return;
    createCard(id, front.trim(), back.trim());
    setFront("");
    setBack("");
    setShowForm(false);
    refresh();
  }

  function handleDeleteCard(cardId: string) {
    deleteCard(id, cardId);
    refresh();
  }

  if (!deck) return null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-indigo-600">
          Decks
        </Link>
        <span>/</span>
        <span className="text-zinc-800 font-medium">{deck.name}</span>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{deck.name}</h1>
          {deck.description && (
            <p className="mt-1 text-sm text-zinc-500">{deck.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "+ Add Card"}
          </Button>
          {deck.cards.length > 0 && (
            <Link href={`/study/${deck.id}`}>
              <Button variant="secondary">Study Now</Button>
            </Link>
          )}
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddCard}
          className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold">New Card</h2>
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Front</label>
              <span className={`text-xs ${frontOver ? "text-red-500 font-medium" : "text-zinc-400"}`}>
                {frontWords}/{MAX_WORDS} words
              </span>
            </div>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Question or term"
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 resize-none ${frontOver ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
              autoFocus
            />
          </div>
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">Back</label>
              <span className={`text-xs ${backOver ? "text-red-500 font-medium" : "text-zinc-400"}`}>
                {backWords}/{MAX_WORDS} words
              </span>
            </div>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Answer or definition"
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 resize-none ${backOver ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
            />
          </div>
          <Button type="submit" disabled={!front.trim() || !back.trim() || frontOver || backOver}>
            Add Card
          </Button>
        </form>
      )}

      {deck.cards.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 py-20 text-center">
          <p className="text-4xl mb-3">🃏</p>
          <p className="text-zinc-500 text-sm">No cards yet. Add your first card.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deck.cards.map((card) => (
            <div
              key={card.id}
              className="flex items-start justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex-1 grid grid-cols-2 gap-4 mr-4">
                <div>
                  <p className="text-xs font-medium text-zinc-400 mb-1">FRONT</p>
                  <p className="text-sm text-zinc-800">{card.front}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-400 mb-1">BACK</p>
                  <p className="text-sm text-zinc-800">{card.back}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="text-zinc-400 hover:text-red-500 transition-colors text-xl leading-none mt-0.5"
                title="Delete card"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
