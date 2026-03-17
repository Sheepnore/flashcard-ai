import { NextRequest, NextResponse } from "next/server";
import { paraphraseCard } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_WORDS = 50;

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${Math.ceil(retryAfterMs / 1000)}s.` },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    );
  }

  const { front, back } = await req.json();

  if (!front || !back) {
    return NextResponse.json(
      { error: "front and back are required" },
      { status: 400 }
    );
  }

  // 50-word limit per field
  if (wordCount(front) > MAX_WORDS || wordCount(back) > MAX_WORDS) {
    return NextResponse.json(
      { error: `Each field must be ${MAX_WORDS} words or fewer.` },
      { status: 422 }
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
