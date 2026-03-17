import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function paraphraseCard(
  front: string,
  back: string
): Promise<{ front: string; back: string }> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are helping a learner study flashcards. Paraphrase the following flashcard to challenge the learner with different wording, while keeping the meaning identical. Return ONLY a JSON object with "front" and "back" keys — no explanation, no markdown.

Original front: ${front}
Original back: ${back}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if present
  const cleaned = text.replace(/```(?:json)?\n?/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return { front: parsed.front, back: parsed.back };
}
