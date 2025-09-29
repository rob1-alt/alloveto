import Navbar from "@/components/Navbar";
import ResultsMap, { MOCK_RESULTS } from "@/components/ResultsMap";

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
              <li key={m.id} className="p-3 rounded-xl border border-[#e6eee9] hover:bg-[#f7fbf9]">
                <div className="font-semibold text-[#102a23]">{m.name}</div>
                <div className="text-sm text-[#60756f]">{m.address}</div>
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


