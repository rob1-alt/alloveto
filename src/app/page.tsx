import LocationAutocomplete from "@/components/LocationAutocomplete";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-[#e7f3ec]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 pt-10 pb-16 grid items-center">
        <div className="w-full">
          <p className="text-[#0f8f70] text-[22px] font-semibold mb-4">
            Bienvenue sur AlloVeto 👋
          </p>
          <h1 className="text-[42px] md:text-[56px] leading-[1.1] font-extrabold text-[#102a23] mb-8">
            La santé animale <span className="text-[#108b71]">à portée de pattes</span>
          </h1>

          {/* Search bar */}
          <form action="/recherche" method="get" className="flex items-stretch w-full max-w-[1100px]">
            <div className="w-full bg-white rounded-full shadow-sm border border-[#dfe8e3] overflow-visible flex">
              {/* Query */}
              <label className="flex items-center gap-3 px-5 h-[64px] flex-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#0f8f70]">
                  <path d="M11 19a8 8 0 1 1 5.292-13.999A8 8 0 0 1 11 19Zm10 2-5.1-5.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  aria-label="Recherche"
                  className="outline-none w-full placeholder:text-[#617671] text-black"
                  placeholder="Nom, spécialité, établissement,…"
                  name="q"
                />
              </label>
              <div className="w-px bg-[#dfe8e3] my-3" />
              {/* Location */}
              <div className="flex items-center gap-3 px-5 h-[64px] min-w-[260px]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#0f8f70]">
                  <path d="M12 22s7-6.16 7-12a7 7 0 1 0-14 0c0 5.84 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="currentColor"/>
                </svg>
                <LocationAutocomplete name="loc" className="flex-1" />
              </div>
            </div>
            <button type="submit" className="ml-3 h-[64px] px-6 rounded-full bg-[#0f8f70] text-white font-semibold flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M22 2 11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 2 15 22l-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Rechercher
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
