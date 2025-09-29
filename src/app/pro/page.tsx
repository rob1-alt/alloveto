import Image from "next/image";

export default function ProPage() {
  return (
    <div className="font-sans min-h-screen bg-[#e7f3ec]">
      <header className="flex items-center justify-between max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="AlloVeto" width={100} height={100} />
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <a className="text-[#0c7a5c] font-semibold" href="/pro">Accueil</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="h-11 px-5 rounded-full bg-[#0f8f70] text-white font-semibold">Se connecter</button>
          <button className="h-11 px-5 rounded-full bg-white text-[#0f8f70] font-semibold">S’inscrire</button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-[1200px] mx-auto px-6 pt-10 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#0f8f70] text-[22px] font-semibold mb-4">Bienvenue sur AlloVeto 👋</p>
            <h1 className="text-[42px] md:text-[56px] leading-[1.1] font-extrabold text-[#102a23] mb-6">
              Parce que prendre soin des animaux, c’est aussi prendre soin de ceux qui les soignent.
            </h1>
            <p className="text-[#304640] text-lg mb-10">
              Moins d’administratif, plus de temps pour vos toutous 🐕
            </p>
            <button className="h-14 px-8 rounded-full bg-[#0f8f70] text-white font-semibold text-lg w-full md:w-auto">
              Créer mon compte
            </button>
          </div>
          <div className="hidden md:block">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <Image
                src="/herobanner.png"
                alt="Vétérinaire avec un chat"
                width={800}
                height={520}
              />
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="px-6 -mt-6">
          <div className="max-w-[1200px] mx-auto bg-[#fbfcfa] rounded-xl shadow-sm border border-[#dfe8e3] grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#dfe8e3]">
            <div className="p-8 text-center">
              <div className="text-[34px] font-extrabold text-[#102a23]">+3.500</div>
              <div className="text-xs uppercase tracking-wide text-[#1a9c7b] mt-1">Vétérinaires conquis</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-[34px] font-extrabold text-[#102a23]">+15</div>
              <div className="text-xs uppercase tracking-wide text-[#1a9c7b] mt-1">Régions clientes</div>
            </div>
            <div className="p-8 text-center">
              <div className="text-[34px] font-extrabold text-[#102a23]">+10</div>
              <div className="text-xs uppercase tracking-wide text-[#1a9c7b] mt-1">Années de service</div>
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
              <h3 className="font-bold text-[#102a23] mb-2">Gain de temps au quotidien</h3>
              <p className="text-[#304640] text-sm">
                Optimisez vos tâches administratives et concentrez-vous sur vos patients.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#dfe8e3] p-6">
              <div className="w-8 h-8 rounded-full bg-[#e7f3ec] flex items-center justify-center text-[#0f8f70] mb-4">✓</div>
              <h3 className="font-bold text-[#102a23] mb-2">Organisation simplifiée</h3>
              <p className="text-[#304640] text-sm">
                Centralisez vos rendez-vous, dossiers et suivis en un seul outil.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-[#dfe8e3] p-6">
              <div className="w-8 h-8 rounded-full bg-[#e7f3ec] flex items-center justify-center text-[#0f8f70] mb-4">✓</div>
              <h3 className="font-bold text-[#102a23] mb-2">Suivi optimisé des patients</h3>
              <p className="text-[#304640] text-sm">
                Gardez une vision claire de l’historique médical et améliorez la qualité du soin.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#102a23] mb-6">Rentrons en contact</h2>
              <ul className="space-y-4 text-[#304640]">
                <li className="flex items-center gap-3"><span className="text-[#0f8f70]">📍</span> 6 rue parmentier, 75011 Paris</li>
                <li className="flex items-center gap-3"><span className="text-[#0f8f70]">✉️</span> contact@alloveto.com</li>
              </ul>
              <button className="mt-8 h-12 px-6 rounded-full bg-[#0f8f70] text-white font-semibold">Nous contacter</button>
            </div>
            <div>
              <div className="rounded-2xl overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=1600&auto=format&fit=crop"
                  alt="Client heureux avec son téléphone"
                  width={800}
                  height={520}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


