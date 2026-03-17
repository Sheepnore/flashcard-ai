"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDecks, createDeck, deleteDeck } from "@/lib/storage";
import { getDueCards } from "@/lib/spaced-rep";
import type { Deck } from "@/types";
import Button from "@/components/ui/Button";

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setDecks(getDecks());
  }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createDeck(name.trim(), description.trim());
    setDecks(getDecks());
    setName("");
    setDescription("");
    setShowForm(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this deck and all its cards?")) return;
    deleteDeck(id);
    setDecks(getDecks());
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Your Decks</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Create decks, add cards, and study with AI-powered spaced repetition.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ New Deck"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold">New Deck</h2>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spanish Vocabulary"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <Button type="submit" disabled={!name.trim()}>
            Create Deck
          </Button>
        </form>
      )}

      {decks.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-200 py-20 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-zinc-500 text-sm">No decks yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {decks.map((deck) => {
            const due = getDueCards(deck.cards).length;
            return (
              <div
                key={deck.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-zinc-900">{deck.name}</h2>
                    {deck.description && (
                      <p className="mt-0.5 text-sm text-zinc-500">
                        {deck.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(deck.id)}
                    className="text-zinc-400 hover:text-red-500 transition-colors text-lg leading-none"
                    title="Delete deck"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-4 flex gap-4 text-sm text-zinc-500">
                  <span>{deck.cards.length} cards</span>
                  {due > 0 && (
                    <span className="text-indigo-600 font-medium">
                      {due} due today
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/decks/${deck.id}`}>
                    <Button variant="secondary" size="sm">
                      Manage
                    </Button>
                  </Link>
                  {deck.cards.length > 0 && (
                    <Link href={`/study/${deck.id}`}>
                      <Button size="sm">Study</Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
