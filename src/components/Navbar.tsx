import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
  className?: string;
};

export default function Navbar({ className }: NavbarProps) {
  return (
    <header className={`flex items-center justify-between max-w-[1200px] mx-auto px-6 py-6 ${className || ""}`}>
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="AlloVeto" width={120} height={32} />
      </div>
      <nav className="hidden md:flex items-center gap-10">
        <Link className="text-[#0c7a5c] font-semibold" href="/">Accueil</Link>
        <Link className="text-[#0c7a5c] font-semibold" href="/pro">Professionnels</Link>
      </nav>
      <div className="flex items-center gap-4">
        <button className="h-11 px-5 rounded-full bg-[#0f8f70] text-white font-semibold">Se connecter</button>
        <button className="h-11 px-5 rounded-full bg-white text-[#0f8f70] font-semibold">S’inscrire</button>
      </div>
    </header>
  );
}


