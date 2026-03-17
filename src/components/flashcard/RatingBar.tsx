"use client";

import type { StudyRating } from "@/types";
import Button from "@/components/ui/Button";

interface RatingBarProps {
  onRate: (rating: StudyRating) => void;
}

const ratings: { label: string; rating: StudyRating; color: string }[] = [
  { label: "Again", rating: 0, color: "bg-red-500 hover:bg-red-600 text-white" },
  { label: "Hard", rating: 1, color: "bg-orange-400 hover:bg-orange-500 text-white" },
  { label: "Good", rating: 3, color: "bg-green-500 hover:bg-green-600 text-white" },
  { label: "Easy", rating: 5, color: "bg-blue-500 hover:bg-blue-600 text-white" },
];

export default function RatingBar({ onRate }: RatingBarProps) {
  return (
    <div className="flex gap-3 justify-center">
      {ratings.map(({ label, rating, color }) => (
        <button
          key={label}
          onClick={() => onRate(rating)}
          className={`px-5 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${color}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
