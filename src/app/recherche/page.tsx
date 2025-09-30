import Navbar from "@/components/Navbar";
import ResultsMap from "@/components/ResultsMap";
import { MOCK_RESULTS } from "@/lib/mockResults";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; loc?: string }> }) {
  const params = await searchParams;
  const query = params?.q || "";
  const loc = params?.loc || "Paris";

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-[#e7f3ec]">
      <Navbar className="w-full" />
      <div className="flex items-center justify-between max-w-[1200px] mx-auto px-6">
        <h1 className="text-[#102a23] text-[24px] font-bold">Résultats</h1>
        <div className="text-[#0f8f70]">{loc}{query ? ` · ${query}` : ""}</div>
      </div>
      <main className="grid grid-cols-1 md:grid-cols-[380px_1fr] max-w-[1200px] mx-auto gap-4 px-6 pb-8 w-full">
        <aside className="bg-white rounded-2xl border border-[#dfe8e3] p-4 overflow-auto max-h-[70vh]">
          <ul className="space-y-3">
            {MOCK_RESULTS.map((m) => (
              <li key={m.id} className="rounded-xl border border-[#e6eee9] hover:bg-[#f7fbf9]">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.position[0]},${m.position[1]}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 focus:outline-none focus:ring-2 focus:ring-[#0f8f70] rounded-xl"
                >
                  <div className="font-semibold text-[#102a23]">{m.name}</div>
                  <div className="text-sm text-[#60756f]">{m.address}</div>
                  <div className="mt-2 inline-flex items-center gap-2 text-[#0f8f70] text-sm font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 22s7-6.16 7-12a7 7 0 1 0-14 0c0 5.84 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="currentColor"/>
                    </svg>
                    Voir sur Google Maps
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <div className="h-[70vh] rounded-2xl overflow-hidden border border-[#dfe8e3] shadow-sm">
          <ResultsMap query={query} loc={loc} />
        </div>
      </main>
    </div>
  );
}


