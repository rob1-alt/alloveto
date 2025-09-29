import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-[#e7f3ec]">
      <header className="flex items-center justify-between max-w-[1200px] mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="AlloVeto" width={120} height={32} />
        </div>
        <nav className="hidden md:flex items-center gap-10">
          <a className="text-[#0c7a5c] font-semibold" href="/">Accueil</a>
          <a className="text-[#0c7a5c] font-semibold" href="/pro">Professionnels</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="h-11 px-5 rounded-full bg-[#0f8f70] text-white font-semibold">Se connecter</button>
          <button className="h-11 px-5 rounded-full bg-white text-[#0f8f70] font-semibold">S’inscrire</button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-24">
        <a href="/pro" className="text-[#0f8f70] underline font-semibold">
          Accéder à la page professionnelle →
        </a>
      </main>
    </div>
  );
}
