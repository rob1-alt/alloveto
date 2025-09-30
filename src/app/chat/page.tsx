"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type ChatMessage = {
	role: "system" | "user" | "assistant" | "tool";
	content: string;
};

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
				setMessages((prev) => [...prev, assistant]);
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
									<div className="text-xs text-gray-500 mb-1">{m.role === "user" ? "Vous" : "Assistant"}</div>
									<div className={m.role === "user" ? "flex justify-end" : "flex items-start gap-3"}>
										{m.role !== "user" && (
											<div className="shrink-0">
												<Image src="/dog-agent.png" alt="Bot" width={64} height={64} className="rounded-full bg-white p-1 border" />
											</div>
										)}
									<div className={m.role === "user" ? "bg-[#e6f4f1] text-[#0f8f70] p-3 rounded-lg max-w-[80%]" : "bg-[#e6f4f1] text-[#0f8f70] p-3 rounded-lg max-w-[80%]"}>
											{m.content}
										</div>
									</div>
								</div>
							))}
						<div ref={endRef} />
					</div>
					<div className="mt-4 flex gap-2">
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={onKeyDown}
							placeholder="Posez votre question..."
							className="flex-1 h-12 border rounded-lg px-3 bg-white"
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


