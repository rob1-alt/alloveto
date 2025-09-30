"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { extractArrondissementNumber, parseVetsMarkdown, pickVetForArrondissement, extractVetCards, extractMapsFromText, stripMapsLinks, toEmbedUrl, getDefault16eCards } from "@/lib/chatUtils";

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  vetCards?: { name: string; address: string; mapsUrl: string; bookingUrl?: string }[];
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "system", content: "Tu es un assistant utile pour AlloVeto." }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vetIndex, setVetIndex] = useState<{ name: string; address: string; mapsUrl: string }[] | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open || vetIndex) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/veto-cabinet.md");
        if (!res.ok) return;
        const text = await res.text();
        const parsed = parseVetsMarkdown(text);
        if (!cancelled) setVetIndex(parsed);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [open, vetIndex]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setIsLoading(true);
    const next = [...messages, { role: "user", content: trimmed } as ChatMessage];
    setMessages(next);
    setInput("");

    const arr = extractArrondissementNumber(trimmed);
    let appendedCard = false;
    if (arr === 16) {
      const cards = getDefault16eCards(vetIndex || []);
      setMessages((prev) => [...prev, { role: "assistant", content: "", vetCards: cards }]);
      appendedCard = true;
    }
    // Ensure vet index is loaded if arrondissement is requested
    if (arr && (!vetIndex || vetIndex.length === 0)) {
      try {
        const res = await fetch("/veto-cabinet.md");
        if (res.ok) {
          const text = await res.text();
          const parsed = parseVetsMarkdown(text);
          setVetIndex(parsed);
        }
      } catch {}
    }
    if (arr && vetIndex && vetIndex.length > 0) {
      const match = pickVetForArrondissement(vetIndex, arr);
      if (match) {
        setMessages((prev) => [...prev, { role: "assistant", content: "", vetCards: [match] }]);
        appendedCard = true;
      }
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const assistant = data?.message as ChatMessage | undefined;
      if (assistant && assistant.role === "assistant") {
        const { text, cards } = extractVetCards(assistant.content);
        const mapCards = cards.length === 0 ? extractMapsFromText(text) : [];
        const cleaned = stripMapsLinks(text);
        if (cleaned) setMessages((prev) => [...prev, { role: "assistant", content: cleaned }]);
        const list = cards.length > 0 ? cards : mapCards;
        if (list.length > 0) setMessages((prev) => [...prev, { role: "assistant", content: "", vetCards: list }]);
        if (arr && !appendedCard) {
          const list = vetIndex || [];
          if (arr === 16) {
            const cards = getDefault16eCards(list);
            setMessages((prev) => [...prev, { role: "assistant", content: "", vetCards: cards }]);
          } else if (list.length > 0) {
            const match = pickVetForArrondissement(list, arr);
            if (match) setMessages((prev) => [...prev, { role: "assistant", content: "", vetCards: [match] }]);
          }
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Désolé, je n'ai pas pu générer de réponse." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Erreur lors de l'appel à l'API." }]);
    } finally {
      if (arr && !appendedCard) {
        const list = vetIndex || [];
        if (arr === 16) {
          const cards = getDefault16eCards(list);
          setMessages((prev) => [...prev, { role: "assistant", content: "", vetCards: cards }]);
        } else {
          const match = list.length > 0 ? pickVetForArrondissement(list, arr) : null;
          if (match) setMessages((prev) => [...prev, { role: "assistant", content: "", vetCards: [match] }]);
        }
      }
      setIsLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-[#0f8f70] text-white shadow-lg flex items-center justify-center z-50"
      >
        <Image src="/dog-agent.png" alt="Chatbot" width={56} height={56} className="rounded-full flex items-center justify-center" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-full sm:w-[480px] h-[70vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <Image src="/dog-agent.png" alt="Bot" width={36} height={36} className="rounded-full bg-white p-1 border" />
                <div className="font-semibold text-[#0f8f70]">AlloVeto</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#0f8f70]">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 bg-[#f6faf8]">
              {messages.filter((m) => m.role !== "system").map((m, i) => (
                <div key={i} className="mb-3">
                  <div className={m.role === "user" ? "text-right text-xs text-gray-500 mb-1" : "text-left text-xs text-gray-500 mb-1"}>
                    {m.role === "user" ? "Vous" : "Assistant"}
                  </div>
                  {(() => {
                    const hasCards = Array.isArray(m.vetCards) && m.vetCards.length > 0;
                    const parsed = !hasCards && m.role === "assistant" ? extractVetCards(m.content) : { text: m.content, cards: m.vetCards || [] };
                    return (
                      <div>
                        {parsed.text && (
                          <div className={m.role === "user" ? "bg-[#e6f4f1] text-[#0f8f70] p-3 rounded-lg inline-block max-w-[85%] ml-auto" : "bg-[#e6f4f1] text-[#0f8f70] p-3 rounded-lg inline-block max-w-[85%]"}>
                            {parsed.text}
                          </div>
                        )}
                        {parsed.cards.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 gap-3">
                            {parsed.cards.map((c, idx) => (
                              <div key={idx} className="bg-white border rounded-lg p-3 shadow-sm">
                                <div className="font-semibold text-[#0f8f70]">{c.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{c.address}</div>
                                <div className="flex gap-3 mt-3">
                                  <a href={c.mapsUrl} target="_blank" rel="noreferrer" className="text-white bg-[#0f8f70] px-3 py-1 rounded-md text-sm">Voir sur Maps</a>
                                  {c.bookingUrl && (
                                    <a href={c.bookingUrl} target="_blank" rel="noreferrer" className="text-[#0f8f70] bg-[#e6f4f1] px-3 py-1 rounded-md text-sm">Réserver</a>
                                  )}
                                </div>
                                <div className="mt-3">
                                  <iframe src={toEmbedUrl(c.mapsUrl)} width="100%" height="200" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
              {isLoading && (
                <div className="mb-3">
                  <div className="text-left text-xs text-gray-500 mb-1">Kimmi</div>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="bg-[#e6f4f1] text-[#0f8f70] p-3 rounded-lg max-w-[85%]">
                        Kimmi est en train d&#39;écrire…
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t bg-white flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Posez votre question..."
                className="flex-1 h-11 border rounded-lg px-3 bg-white text-black placeholder:text-black caret-black"
              />
              <button onClick={send} disabled={isLoading} className="h-11 px-4 rounded-lg bg-[#0f8f70] text-white font-semibold disabled:opacity-50">
                {isLoading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


