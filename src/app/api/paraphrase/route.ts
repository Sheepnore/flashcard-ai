import { NextRequest, NextResponse } from "next/server";
import { paraphraseCard } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const { front, back } = await req.json();

  if (!front || !back) {
    return NextResponse.json(
      { error: "front and back are required" },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set" },
      { status: 500 }
    );
  }

  try {
    const result = await paraphraseCard(front, back);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to paraphrase card" },
      { status: 500 }
    );
  }
}
