import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const MODEL = "openai/gpt-6-astra";

export class AiGatewayError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** Streams a Responses call server-side and returns the final text. */
export async function runModel(system: string, messages: ModelMessage[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiGatewayError("AI is not configured.", 401);
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  let failure: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    system,
    messages,
    maxRetries: 0,
    onError: ({ error }) => {
      failure = error;
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  const text = await Promise.resolve(result.text).catch((e: unknown) => {
    failure ??= e;
    return "";
  });
  if (failure || !text) {
    const status = (failure as { statusCode?: number })?.statusCode ?? 500;
    const msg =
      status === 429
        ? "AI is busy right now — please try again in a moment."
        : status === 402 || status === 403
          ? "AI credits have run out for this workspace."
          : "AI couldn't complete this request.";
    throw new AiGatewayError(msg, status);
  }
  return text;
}

export function parseJson<T>(text: string): T {
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  const start = cleaned.search(/[[{]/);
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}
