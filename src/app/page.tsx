import LocationAutocomplete from "@/components/LocationAutocomplete";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import CountUp from "@/components/CountUp";
import { QUERY_SUGGESTIONS } from "@/lib/querySuggestions";

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
              <label className="flex items-center gap-3 px-5 h-[64px] flex-1 relative">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#0f8f70]">
                  <path d="M11 19a8 8 0 1 1 5.292-13.999A8 8 0 0 1 11 19Zm10 2-5.1-5.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  aria-label="Recherche"
                  className="outline-none w-full placeholder:text-[#617671] text-black"
                  placeholder="Nom, spécialité, établissement,…"
                  name="q"
                  list="query-suggestions"
                />
                {/* Simple suggestion dropdown (clientless) */}
                <datalist id="query-suggestions">
                  {QUERY_SUGGESTIONS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
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

        {/* Stats */}
        <section className="mt-14 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 bg-white border border-[#dfe8e3] rounded-2xl overflow-hidden text-center">
            <div className="p-6">
              <div className="text-[32px] font-extrabold text-[#102a23]"><CountUp end={15000} prefix="+" /></div>
              <div className="text-[#0f8f70] text-sm">clients satisfaits</div>
            </div>
            <div className="p-6 border-t sm:border-t-0 sm:border-l border-[#dfe8e3]">
              <div className="text-[32px] font-extrabold text-[#102a23]"><CountUp end={50} prefix="+" /></div>
              <div className="text-[#0f8f70] text-sm">cliniques partenaires</div>
            </div>
            <div className="p-6 border-t sm:border-t-0 sm:border-l border-[#dfe8e3]">
              <div className="text-[32px] font-extrabold text-[#102a23]"><CountUp end={10} prefix="+" /></div>
              <div className="text-[#0f8f70] text-sm">ans de soins et services</div>
            </div>
          </div>
        </section>

        {/* Services */}


        <section className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="text-[#1a9c7b] font-semibold">Services</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#102a23] mt-2">
              Quels sont les avantages ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-[#dfe8e3] p-6">
              <div className="w-8 h-8 rounded-full bg-[#e7f3ec] flex items-center justify-center text-[#0f8f70] mb-4">✓</div>
              <h3 className="font-bold text-[#102a23] mb-2">Gain de temps dans la recherche</h3>
              <p className="text-[#304640] text-sm">
                Trouvez au plus vite la clinique ou le vétérinaire qui correspond à vos besoins.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#dfe8e3] p-6">
              <div className="w-8 h-8 rounded-full bg-[#e7f3ec] flex items-center justify-center text-[#0f8f70] mb-4">✓</div>
              <h3 className="font-bold text-[#102a23] mb-2">Prise de rendez-vous en un clic</h3>
              <p className="text-[#304640] text-sm">
                Prenez rendez-vous avec votre vétérinaire le plus proche en 1 clic.
                Sélectionnez à l’avance tous les services dont votre animal a besoin lors du RDV.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#dfe8e3] p-6">
              <div className="w-8 h-8 rounded-full bg-[#e7f3ec] flex items-center justify-center text-[#0f8f70] mb-4">✓</div>
              <h3 className="font-bold text-[#102a23] mb-2">Suivi médical de votre animal</h3>
              <p className="text-[#304640] text-sm">
                Gardez une vision claire de l’historique médical et améliorez la qualité du soin.
              </p>
            </div>
          </div>
        </section>


        {/* Contact */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-[1fr_380px] items-center gap-10">
          <div>
            <h3 className="text-[26px] font-extrabold text-[#102a23] mb-4">Rentrons en contact</h3>
            <ul className="space-y-3 text-[#102a23]">
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#0f8f70]"><path d="M12 22s7-6.16 7-12a7 7 0 1 0-14 0c0 5.84 7 12 7 12Zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="currentColor"/></svg>
                6 Rue Parmentier, 75011 Paris
              </li>
              <li className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#0f8f70]"><path d="M4 4h16v16H4z" fill="currentColor"/></svg>
                contact@alloveto.com
              </li>
            </ul>
            <a href="mailto:contact@alloveto.com" className="inline-block mt-5 h-11 px-6 rounded-full bg-[#0f8f70] text-white font-semibold">Nous contacter</a>
          </div>
          <div className="rounded-[28px] overflow-hidden border border-[#dfe8e3] bg-white">
            <img src="/herobanner.png" alt="Chat et propriétaire" className="w-full h-auto" />
          </div>
        </section>
      </main>
      <ChatWidget />
    </div>
  );
}
