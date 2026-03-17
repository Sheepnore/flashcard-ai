import { v4 as uuidv4 } from "uuid";
import type { Card, Deck } from "@/types";

const STORAGE_KEY = "flashcard_ai_decks";

export function getDecks(): Deck[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveDeck(deck: Deck): void {
  const decks = getDecks().filter((d) => d.id !== deck.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...decks, deck]));
}

export function deleteDeck(deckId: string): void {
  const decks = getDecks().filter((d) => d.id !== deckId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function getDeck(id: string): Deck | undefined {
  return getDecks().find((d) => d.id === id);
}

export function createDeck(name: string, description: string): Deck {
  const deck: Deck = {
    id: uuidv4(),
    name,
    description,
    cards: [],
    createdAt: new Date().toISOString(),
  };
  saveDeck(deck);
  return deck;
}

export function createCard(
  deckId: string,
  front: string,
  back: string
): Card | null {
  const deck = getDeck(deckId);
  if (!deck) return null;

  const card: Card = {
    id: uuidv4(),
    deckId,
    front,
    back,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(), // due immediately
    createdAt: new Date().toISOString(),
  };

  deck.cards.push(card);
  saveDeck(deck);
  return card;
}

export function updateCard(deckId: string, updated: Card): void {
  const deck = getDeck(deckId);
  if (!deck) return;
  deck.cards = deck.cards.map((c) => (c.id === updated.id ? updated : c));
  saveDeck(deck);
}

export function deleteCard(deckId: string, cardId: string): void {
  const deck = getDeck(deckId);
  if (!deck) return;
  deck.cards = deck.cards.filter((c) => c.id !== cardId);
  saveDeck(deck);
}
