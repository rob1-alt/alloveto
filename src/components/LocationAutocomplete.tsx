"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = {
  id: string;
  label: string;
};

type LocationAutocompleteProps = {
  name: string;
  placeholder?: string;
  className?: string;
};

export default function LocationAutocomplete({
  name,
  placeholder = "Où ?",
  className,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    let currentRequestId = Math.random().toString(36).slice(2);
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        // Favoriser les arrondissements (municipalités). Pour Paris, Lyon, Marseille…
        const url = new URL("https://api-adresse.data.gouv.fr/search/");
        url.searchParams.set("q", q);
        url.searchParams.set("type", "municipality");
        url.searchParams.set("autocomplete", "1");
        url.searchParams.set("limit", "8");
        const res = await fetch(url.toString());
        if (!res.ok) return;
        const data = await res.json();
        const items: Suggestion[] = (data?.features || [])
          .map((f: any) => ({ id: f.properties.id as string, label: f.properties.label as string }))
          // Garder en priorité les libellés contenant "Arrondissement"
          .sort((a: Suggestion, b: Suggestion) => {
            const aa = /arrondissement/i.test(a.label) ? 0 : 1;
            const bb = /arrondissement/i.test(b.label) ? 0 : 1;
            return aa - bb;
          });
        // N'appliquer la réponse que si c'est la requête la plus récente
        if (currentRequestId) {
          setSuggestions(items);
          setOpen(true);
        }
      } catch (_) {
        // Ignorer si abort
      }
    }, 200);
    return () => {
      clearTimeout(timeout);
      // Invalider cette requête
      currentRequestId = "";
    };
  }, [query]);

  function handleSelect(item: Suggestion) {
    setSelected(item);
    setQuery(item.label);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      <input
        value={query}
        onChange={(e) => {
          setSelected(null);
          setQuery(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        aria-label="Où"
        placeholder={placeholder}
        className="outline-none w-full placeholder:text-[#617671] text-black"
        autoComplete="off"
        name="loc_display"
      />
      {/* Valeur réelle envoyée */}
      <input type="hidden" name={name} value={selected?.label || query} />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-2 bg-white border border-[#dfe8e3] rounded-xl overflow-hidden shadow-lg">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="px-4 py-3 hover:bg-[#f3f7f5] cursor-pointer text-[#102a23]"
              onClick={() => handleSelect(s)}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


