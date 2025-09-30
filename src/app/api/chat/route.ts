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


		const systemInstruction: ChatMessage = {
			role: "system",
			content:
				"Tu es un assistant AlloVeto. Si l'utilisateur cherche un vétérinaire pour un problème pour son animal, réponds brièvement et propose ensuite 3-5 adresses de vétérinaires à Paris sous forme de cartes. Pour les cartes, ajoute à la fin du message un bloc <VET_CARDS>[{\"name\":\"Nom\",\"address\":\"Adresse\",\"mapsUrl\":\"https://maps.google.com/?q=...\",\"bookingUrl\":\"https://...\"}]</VET_CARDS>. Ne produis pas d'autre JSON en dehors de ce bloc. Sinon, réponds normalement.",
		};

		const outgoingMessages: ChatMessage[] = [systemInstruction, ...messages];

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
					messages: outgoingMessages,
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


