import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_MODEL = process.env.DEEPINFRA_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct";

type ChatMessage = {
	role: "system" | "user" | "assistant" | "tool";
	content: string;
};

export async function POST(req: Request) {
	try {
		const { messages, model }: { messages: ChatMessage[]; model?: string } = await req.json();

		if (!process.env.DEEPINFRA_API_KEY) {
			return NextResponse.json(
				{ error: "Missing DEEPINFRA_API_KEY on the server" },
				{ status: 500 }
			);
		}

		if (!Array.isArray(messages) || messages.length === 0) {
			return NextResponse.json(
				{ error: "Body must include non-empty 'messages' array" },
				{ status: 400 }
			);
		}

		const deepinfraResponse = await fetch(
			"https://api.deepinfra.com/v1/openai/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
				},
				body: JSON.stringify({
					model: model || DEFAULT_MODEL,
					messages,
					stream: false,
				}),
			}
		);


		if (!deepinfraResponse.ok) {
			const errorText = await deepinfraResponse.text();
			console.error("DeepInfra error:", deepinfraResponse.status, deepinfraResponse.statusText, errorText);
			return NextResponse.json(
				{
					error: "DeepInfra request failed",
					status: deepinfraResponse.status,
					statusText: deepinfraResponse.statusText,
					details: errorText,
				},
				{ status: deepinfraResponse.status }
			);
		}

		const data = await deepinfraResponse.json();
		// Standard OpenAI-compatible response shape
		const assistantMessage: ChatMessage | null =
			data?.choices?.[0]?.message || null;

		return NextResponse.json({ message: assistantMessage, raw: data });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("/api/chat error:", error);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}


