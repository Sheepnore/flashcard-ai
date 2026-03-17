import type { Card, StudyRating } from "@/types";

/**
 * SM-2 spaced repetition algorithm.
 * Returns updated card fields after a review.
 */
export function reviewCard(
  card: Card,
  quality: StudyRating
): Pick<Card, "easeFactor" | "interval" | "repetitions" | "nextReview"> {
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    // Failed — reset streak
    repetitions = 0;
    interval = 1;
  } else {
    // Passed — advance
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
    easeFactor = Math.max(
      1.3,
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview: nextReview.toISOString(),
  };
}

/** Returns cards that are due today or overdue. */
export function getDueCards(cards: Card[]): Card[] {
  const now = new Date();
  return cards.filter((c) => new Date(c.nextReview) <= now);
}
