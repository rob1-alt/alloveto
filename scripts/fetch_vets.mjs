#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_MAPS_API_KEY env variable. Export it before running.");
  process.exit(1);
}

// Text search for vets in Paris. We will paginate until next_page_token is exhausted.
const TEXT_QUERY = "veterinaire Paris"; // French search term

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPage({ pagetoken } = {}) {
  const base = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
  base.searchParams.set("query", TEXT_QUERY);
  base.searchParams.set("language", "fr");
  base.searchParams.set("region", "fr");
  base.searchParams.set("key", API_KEY);
  if (pagetoken) base.searchParams.set("pagetoken", pagetoken);

  const res = await fetch(base.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS" && data.status !== "INVALID_REQUEST") {
    console.error("Places API status:", data.status, data.error_message || "");
  }
  return data;
}

function toMarkdownEntry(place) {
  const name = place.name || "Nom inconnu";
  const address = place.formatted_address || place.vicinity || "Adresse inconnue";
  const lat = place.geometry?.location?.lat;
  const lng = place.geometry?.location?.lng;
  const rating = place.rating ? ` — Note: ${place.rating} (${place.user_ratings_total || 0})` : "";
  const gmapsUrl = lat != null && lng != null
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(name + " " + address)}`;

  return `- **${name}** — ${address}${rating}\n  - Maps: ${gmapsUrl}`;
}

async function main() {
  const items = [];
  let token = undefined;
  let pageCount = 0;
  do {
    // If a next_page_token is present, Google requires a short delay before using it
    if (token) await sleep(2000);
    const data = await fetchPage({ pagetoken: token });
    const results = Array.isArray(data.results) ? data.results : [];
    for (const p of results) items.push(p);
    token = data.next_page_token;
    pageCount += 1;
  } while (token && pageCount < 6); // safety cap

  // Deduplicate by place_id
  const map = new Map();
  for (const p of items) {
    if (!map.has(p.place_id)) map.set(p.place_id, p);
  }
  const unique = [...map.values()];
  unique.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  const header = `# Cabinets vétérinaires — Paris\n\nNombre: ${unique.length}\n\n`;
  const body = unique.map(toMarkdownEntry).join("\n\n");
  const content = header + body + "\n";

  const outPath = path.join(process.cwd(), "public", "veto-cabinet.md");
  await fs.writeFile(outPath, content, "utf8");
  console.log(`Wrote ${unique.length} entries to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


