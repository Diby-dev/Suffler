'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomeClient() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/login');
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white flex items-center justify-center">
      {/* 1. Vidéo d'arrière-plan en plein écran */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0"
      >
        <source src="/etoile.mp4" type="video/mp4" />
      </video>

      {/* 2. Overlay sombre pour préserver la lisibilité du texte */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* 3. Contenu central minimaliste et cinématique */}
      <div className="relative z-20 flex flex-col items-center text-center px-5 sm:px-8 md:px-12 max-w-4xl mx-auto">
        
        {/* Icône de l'application */}
        <div className="animate-fade-up mb-6">
          <Image
            src="/suffler.png"
            alt="Logo Suffler"
            width={80}
            height={80}
            className="w-20 h-20 object-contain drop-shadow-lg"
            priority
          />
        </div>

        <h1 className="animate-fade-up text-3xl sm:text-5xl md:text-6xl lg:text-5xl tracking-tight leading-[1.15] text-white drop-shadow-md mb-6">
          Suffler l&apos;application de chat publique où tout le monde a son mot à dire
        </h1>

        <h2 className="animate-fade-up text-sm text-gray-100 drop-shadow-md mb-8">
          Discutez, partagez et connectez-vous avec des personnes du monde entier. <br /> Rejoignez la conversation dès maintenant !
        </h2>

        <button
          onClick={handleContinue}
          className="animate-button-appear metallic-button text-gray-900 font-semibold px-8 py-4 rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 cursor-pointer border border-white/40"
        >
          Continuer
        </button>
      </div>
    </main>
  );
}