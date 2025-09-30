import Navbar from "@/components/Navbar";
import { parseVetsMarkdown } from "@/lib/chatUtils";
import fs from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

export default async function VeterinairesPage() {
  const filePath = path.join(process.cwd(), "public", "veto-cabinet.md");
  let md = "";
  try {
    md = await fs.readFile(filePath, "utf8");
  } catch {
    md = "# Aucune donnée de cabinets vétérinaires trouvée.";
  }
  const vets = parseVetsMarkdown(md);

  return (
    <div className="min-h-screen bg-[#e7f3ec]">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-[28px] font-bold text-[#102a23] mb-4">Vétérinaires à Paris</h1>
        <p className="text-[#0f8f70] mb-6">Total: {vets.length}</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vets.map((v, i) => (
            <li key={i} className="bg-white border border-[#dfe8e3] rounded-xl p-4">
              <div className="font-semibold text-[#0f8f70]">{v.name}</div>
              <div className="text-sm text-[#60756f] mt-1">{v.address}</div>
              <div className="mt-3">
                <a
                  href={v.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-white bg-[#0f8f70] px-3 py-1 rounded-md text-sm"
                >
                  Voir sur Google Maps
                </a>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}


