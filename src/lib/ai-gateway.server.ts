// Thin client for the Lovable AI Gateway (OpenAI-compatible chat completions).
// Used by the consultant chat endpoint and the app-spec generator.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type GatewayMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GatewayOptions = {
  model: string;
  messages: GatewayMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
};

function apiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI gateway is not configured");
  return key;
}

async function call(opts: GatewayOptions): Promise<Response> {
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 1024,
      stream: opts.stream ?? false,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gateway ${res.status}: ${detail.slice(0, 200)}`);
  }
  return res;
}

/** One-shot completion; returns the assistant text. */
export async function generateText(opts: Omit<GatewayOptions, "stream">): Promise<string> {
  const res = await call({ ...opts, stream: false });
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content ?? "";
}

/** Streaming completion; yields plain text deltas as they arrive. */
export async function* streamText(
  opts: Omit<GatewayOptions, "stream">,
): AsyncGenerator<string> {
  const res = await call({ ...opts, stream: true });
  const reader = res.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const parsed = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        /* partial frame — wait for more bytes */
      }
    }
  }
}
