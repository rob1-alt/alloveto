"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type ChatMessage = {
	role: "system" | "user" | "assistant" | "tool";
	content: string;
	vetCards?: VetCard[];
};

type VetCard = {
	name: string;
	address: string;
	mapsUrl: string;
	bookingUrl?: string;
};

function extractVetCards(raw: string): { text: string; cards: VetCard[] } {
	// Support both angle brackets and square brackets for start/end tags
	const regex = /(?:<|\[)VET_CARDS(?:\]|>)\s*([\s\S]*?)\s*(?:<\/VET_CARDS>|\[\/VET_CARDS\])/i;
	const match = raw.match(regex);
	if (!match) {
		return { text: raw, cards: [] };
	}
	let jsonLike = match[1].trim();
	// Strip markdown code fences if present
	if (jsonLike.startsWith("```")) {
		jsonLike = jsonLike.replace(/^```[a-zA-Z]*\n?/i, "").replace(/```\s*$/i, "");
	}
	// Normalize smart quotes and stray characters
	jsonLike = jsonLike
		.replace(/[“”]/g, '"')
		.replace(/[‘’]/g, "'");

	let cards: VetCard[] = [];
	const tryParsers: Array<(s: string) => VetCard[] | null> = [
		// Strict JSON
		(s) => {
			try {
				const p = JSON.parse(s);
				return Array.isArray(p) ? (p as VetCard[]) : null;
			} catch {
				return null;
			}
		},
		// Lenient: replace single quotes with double quotes when it seems safe
		(s) => {
			try {
				const doubled = s
					.replace(/'(\s*:\s*)/g, '"$1') // 'key': -> "key":
					.replace(/([\{,]\s*)'(\w+)'(\s*:\s*)/g, '$1"$2"$3') // {'key': -> {"key":
					.replace(/:\s*'([^']*)'/g, ': "$1"'); // : 'value' -> : "value"
				const p = JSON.parse(doubled);
				return Array.isArray(p) ? (p as VetCard[]) : null;
			} catch {
				return null;
			}
		},
	];

	for (const parser of tryParsers) {
		const res = parser(jsonLike);
		if (res) {
			cards = res;
			break;
		}
	}

	const text = raw.replace(regex, "").trim();
	return { text, cards };
}

function extractMapsFromText(raw: string): VetCard[] {
	const urlRegex = /(https?:\/\/(?:www\.)?(?:google\.|maps\.)?google\.com\/maps[^\s]*)|(https?:\/\/goo\.gl\/maps\/[^\s]+)/gi;
	const results: VetCard[] = [];
	let match: RegExpExecArray | null;
	while ((match = urlRegex.exec(raw)) !== null) {
		const url = match[0];
		// Try to extract query param q for a readable label
		try {
			const u = new URL(url);
			const q = u.searchParams.get("q");
			const nameOrAddr = q ? decodeURIComponent(q) : "Vétérinaire";
			results.push({
				name: nameOrAddr,
				address: nameOrAddr,
				mapsUrl: url,
			});
		} catch {
			results.push({ name: "Vétérinaire", address: "Paris", mapsUrl: url });
		}
	}
	return results;
}

function toEmbedUrl(mapsUrl: string): string {
	try {
		const u = new URL(mapsUrl);
		// If there's a search query `q`, build a simple embed url
		const q = u.searchParams.get("q");
		if (q) {
			return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
		}
		// Fallback: add output=embed
		if (!u.searchParams.has("output")) {
			u.searchParams.set("output", "embed");
		}
		return u.toString();
	} catch {
		return mapsUrl;
	}
}

export default function ChatPage() {
	const [messages, setMessages] = useState<ChatMessage[]>([
		{ role: "system", content: "Tu es un assistant utile pour AlloVeto." },
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const endRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	async function sendMessage() {
		const trimmed = input.trim();
		if (!trimmed || isLoading) return;
		setIsLoading(true);
		const nextMessages = [...messages, { role: "user", content: trimmed } as ChatMessage];
		setMessages(nextMessages);
		setInput("");

		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: nextMessages }),
			});

			if (!res.ok) {
				const errText = await res.text();
				throw new Error(errText);
			}

			const data = await res.json();
			const assistant = data?.message as ChatMessage | undefined;
			if (assistant && assistant.role === "assistant") {
				const { text, cards } = extractVetCards(assistant.content);
				const mapCards = cards.length === 0 ? extractMapsFromText(text) : [];
				if (cards.length > 0 || mapCards.length > 0) {
					setMessages((prev) => [
						...prev,
						{ role: "assistant", content: text },
						{ role: "assistant", content: "", vetCards: cards.length > 0 ? cards : mapCards },
					]);
				} else {
					setMessages((prev) => [...prev, { role: "assistant", content: text }]);
				}
			} else {
				setMessages((prev) => [
					...prev,
					{ role: "assistant", content: "Désolé, je n'ai pas pu générer de réponse." },
				]);
			}
		} catch (e) {
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: "Erreur lors de l'appel à l'API." },
			]);
		} finally {
			setIsLoading(false);
		}
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	return (
		<div className="bg-[#e7f3ec] min-h-screen">
			<div className="mx-auto px-6 py-8">
				<Navbar />
				<div className="max-w-2xl mx-auto">
					<h1 className="text-2xl font-semibold mb-4">Chatbot AlloVeto</h1>
					<div className="border rounded-lg p-4 h-[60vh] overflow-y-auto bg-white">
						{messages
							.filter((m) => m.role !== "system")
							.map((m, idx) => (
								<div key={idx} className="mb-3">
									<div className="text-xs text-gray-500 mb-1 flex items-center gap-2 justify-end">{m.role === "user" ? "Vous" : "Assistant"}</div>
									<div className={m.role === "user" ? "flex justify-start" : "flex items-start gap-3 justify-start"}>
										{m.role !== "user" && (
											<div className="shrink-0">
												<Image src="/dog-agent.png" alt="Bot" width={64} height={64} className="rounded-full bg-white p-1 border" />
											</div>
										)}
										{(() => {
											const hasExplicitCards = Array.isArray(m.vetCards) && (m.vetCards as VetCard[]).length > 0;
											const parsed = !hasExplicitCards && m.role === "assistant" ? extractVetCards(m.content) : { text: m.content, cards: (m.vetCards || []) as VetCard[] };
											return (
												<div className="flex-1">
													{parsed.text && (
														<div className={m.role === "user" ? "bg-[#e6f4f1] text-[#0f8f70] p-3 rounded-lg max-w-[80%] ml-auto" : "bg-[#e6f4f1] text-[#0f8f70] p-3 rounded-lg max-w-[80%]"}>
															{parsed.text}
														</div>
													)}
											{parsed.cards.length > 0 && (
														<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
															{parsed.cards.map((c, i) => (
															<div key={i} className="bg-white border rounded-lg p-4 shadow-sm">
																	<div className="font-semibold text-[#0f8f70]">{c.name}</div>
																	<div className="text-sm text-gray-600 mt-1">{c.address}</div>
																	<div className="flex gap-3 mt-3">
																		<a href={c.mapsUrl} target="_blank" rel="noreferrer" className="text-white bg-[#0f8f70] px-3 py-1 rounded-md text-sm">Voir sur Maps</a>
																		{c.bookingUrl && (
																			<a href={c.bookingUrl} target="_blank" rel="noreferrer" className="text-[#0f8f70] bg-[#e6f4f1] px-3 py-1 rounded-md text-sm">Réserver</a>
																		)}
																	</div>
																<div className="mt-3">
																	<iframe
																		src={toEmbedUrl(c.mapsUrl)}
																		width="100%"
																		height="220"
																		style={{ border: 0 }}
																		loading="lazy"
																		referrerPolicy="no-referrer-when-downgrade"
																		allowFullScreen
																	/>
																</div>
																</div>
															))}
														</div>
													)}
												</div>
											);
										})()}
									</div>
								</div>
							))}
							{isLoading && (
								<div className="mb-3">
									<div className="text-xs text-gray-500 mb-1">Kimmi</div>
									<div className="flex items-start gap-3">
										<div className="shrink-0">
											<Image src="/dog-agent.png" alt="Bot" width={64} height={64} className="rounded-full bg-white p-1 border" />
										</div>
										<div className="flex-1">
											<div className="bg-[#e6f4f1] text-[#0f8f70] p-3 rounded-lg max-w-[80%]">
												Kimmi est en train d'écrire…
											</div>
										</div>
									</div>
								</div>
							)}
						<div ref={endRef} />
					</div>
					<div className="mt-4 flex gap-2">
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={onKeyDown}
							placeholder="Posez votre question..."
							className="flex-1 h-12 border rounded-lg px-3 bg-white text-black placeholder:text-black caret-black"
						/>
						<button
							onClick={sendMessage}
							disabled={isLoading}
							className="h-12 px-5 rounded-lg bg-[#0f8f70] text-white font-semibold disabled:opacity-50"
						>
							{isLoading ? "Envoi..." : "Envoyer"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}


