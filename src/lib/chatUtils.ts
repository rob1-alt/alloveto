export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

export type VetCard = {
  name: string;
  address: string;
  mapsUrl: string;
  bookingUrl?: string;
};

export function extractArrondissementNumber(text: string): number | null {
  const lower = text.toLowerCase();
  const patterns = [
    /(paris\s*)(\d{1,2})\b/,
    /\b(\d{1,2})\s*(e|ème|eme)\b/,
    /\b(\d{1,2})\s*(arr|arr\.|arrondissement)\b/,
  ];
  for (const re of patterns) {
    const m = lower.match(re);
    if (m) {
      const n = parseInt((m as unknown as string[])[2] ?? (m as unknown as string[])[1], 10);
      if (!Number.isNaN(n) && n >= 1 && n <= 20) return n;
    }
  }
  return null;
}

export function parseVetsMarkdown(md: string): VetCard[] {
  const lines = md.split(/\r?\n/);
  const cards: VetCard[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = /^- \*\*(.+?)\*\* — (.+?)(?: — Note: .*?)?$/.exec(line);
    if (m) {
      const name = m[1];
      const address = m[2];
      const next = lines[i + 1] || "";
      const urlMatch = /Maps: (https?:\/\/[^\s]+)/.exec(next);
      const mapsUrl = urlMatch ? urlMatch[1] : `https://www.google.com/maps/search/${encodeURIComponent(name + " " + address)}`;
      cards.push({ name, address, mapsUrl });
    }
  }
  return cards;
}

export function arrondissementFromAddress(address: string): number | null {
  const m2 = /\b750(\d{2})\b/.exec(address);
  if (m2) {
    const n = parseInt(m2[1], 10);
    if (n >= 1 && n <= 20) return n;
  }
  if (/\b75116\b/.test(address)) return 16;
  return null;
}

export function pickVetForArrondissement(cards: VetCard[], arr: number): VetCard | null {
  const inArr = cards.filter((c) => arrondissementFromAddress(c.address) === arr);
  if (inArr.length > 0) return inArr[0];
  const fuzzy = cards.find((c) => new RegExp(`\\b${arr}(?:e|eme|ème)\\b`).test(c.address.toLowerCase()));
  return fuzzy || null;
}

export function extractVetCards(raw: string): { text: string; cards: VetCard[] } {
  const regex = /(?:<|\[)VET_CARDS(?:\]|>)\s*([\s\S]*?)\s*(?:<\/VET_CARDS>|\[\/VET_CARDS\])/i;
  let match = raw.match(regex);
  if (!match) {
    const openTags = ["<VET_CARDS>", "[VET_CARDS]"] as const;
    const closeTags = ["</VET_CARDS>", "[/VET_CARDS]"] as const;
    let start = -1;
    let end = -1;
    for (const open of openTags) {
      const idx = raw.indexOf(open);
      if (idx !== -1) {
        start = idx + open.length;
        break;
      }
    }
    for (const close of closeTags) {
      const idx = raw.indexOf(close);
      if (idx !== -1) {
        end = idx;
        break;
      }
    }
    if (start !== -1 && end !== -1 && end > start) {
      match = [raw, raw.slice(start, end)] as unknown as RegExpMatchArray;
    } else {
      return { text: raw, cards: [] };
    }
  }
  let jsonLike = match[1].trim();
  if (jsonLike.startsWith("```")) {
    jsonLike = jsonLike.replace(/^```[a-zA-Z]*\n?/i, "").replace(/```\s*$/i, "");
  }
  jsonLike = jsonLike.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

  let cards: VetCard[] = [];
  const tryParsers: Array<(s: string) => VetCard[] | null> = [
    (s) => {
      try {
        const p = JSON.parse(s);
        return Array.isArray(p) ? (p as VetCard[]) : null;
      } catch {
        return null;
      }
    },
    (s) => {
      try {
        const doubled = s
          .replace(/'(\s*:\s*)/g, '"$1')
          .replace(/([\{,]\s*)'(\w+)'(\s*:\s*)/g, '$1"$2"$3')
          .replace(/:\s*'([^']*)'/g, ': "$1"');
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

export function extractMapsFromText(raw: string): VetCard[] {
  const urlRegex = /(https?:\/\/(?:www\.)?(?:google\.|maps\.)?google\.com\/maps[^\s]*)|(https?:\/\/goo\.gl\/maps\/[^\s]+)/gi;
  const results: VetCard[] = [];
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(raw)) !== null) {
    const url = match[0];
    try {
      const u = new URL(url);
      const q = u.searchParams.get("q");
      const nameOrAddr = q ? decodeURIComponent(q) : "Vétérinaire";
      results.push({ name: nameOrAddr, address: nameOrAddr, mapsUrl: url });
    } catch {
      results.push({ name: "Vétérinaire", address: "Paris", mapsUrl: url });
    }
  }
  return results;
}

export function stripMapsLinks(raw: string): string {
  const urlRegex = /(https?:\/\/(?:www\.)?(?:google\.|maps\.)?google\.com\/maps[^\s]*)|(https?:\/\/goo\.gl\/maps\/[^\s]+)/gi;
  return raw.replace(urlRegex, "").replace(/\(\s*\)/g, "").replace(/\s{2,}/g, " ").trim();
}

export function toEmbedUrl(mapsUrl: string): string {
  try {
    const u = new URL(mapsUrl);
    const q = u.searchParams.get("q");
    if (q) return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    if (!u.searchParams.has("output")) u.searchParams.set("output", "embed");
    return u.toString();
  } catch {
    return mapsUrl;
  }
}


