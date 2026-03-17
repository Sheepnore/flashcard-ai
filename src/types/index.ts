export type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  // SM-2 spaced repetition fields
  easeFactor: number;   // default 2.5
  interval: number;     // days until next review
  repetitions: number;  // successful reviews in a row
  nextReview: string;   // ISO date string
  createdAt: string;
};

export type Deck = {
  id: string;
  name: string;
  description: string;
  cards: Card[];
  createdAt: string;
};

export type StudyRating = 0 | 1 | 3 | 5;
// 0 = Again (blackout), 1 = Hard, 3 = Good, 5 = Easy
