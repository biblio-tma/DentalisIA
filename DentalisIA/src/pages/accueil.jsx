import React from "react";
import { Sparkles, Zap, Compass, MapPin, ArrowRight } from "lucide-react";

const stats = [
  { value: "12 500+", label: "Analyses réalisées" },
  { value: "78", label: "Centres de santé partenaires" },
  { value: "94%", label: "Taux de satisfaction" },
];

const highlights = [
  { icon: Sparkles, title: "Analyse IA précise", text: "Détection rapide des pathologies bucco-dentaires à partir de vos symptômes." },
  { icon: Zap, title: "Résultats instantanés", text: "Un diagnostic préliminaire en quelques secondes, disponible à tout moment." },
  { icon: Compass, title: "Conseils personnalisés", text: "Des recommandations adaptées à votre situation et à votre historique." },
  { icon: MapPin, title: "Centres à proximité", text: "Trouvez le centre de santé le plus proche pour un suivi professionnel." },
];

export default function Accueil() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <section
        id="accueil"
        className="relative w-full min-h-[560px] flex items-center overflow-hidden"
        style={{
          background: "linear-gradient(120deg, #EAF1FB 0%, #DCE7F7 45%, #C9DAF1 100%)",
        }}
      >
        <div className="relative max-w-3xl px-8 py-16">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            Votre santé bucco-dentaire entre de{" "}
            <span className="text-blue-600">bonnes mains</span>
          </h1>

          <p className="text-lg text-gray-700 mb-8 max-w-xl">
            Dentalis AI utilise l'intelligence artificielle pour analyser vos
            symptômes, détecter les pathologies et vous orienter vers les
            meilleurs soins.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#commencer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Commencer
              <ArrowRight size={16} />
            </a>
            <a
              href="#a-propos"
              className="bg-white/80 hover:bg-white text-gray-800 font-medium px-6 py-3 rounded-full border border-gray-200 transition-colors"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-gray-200 px-8 py-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center px-4">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Pourquoi choisir Dentalis AI
        </h2>
        <p className="text-gray-500 mb-10">
          Une plateforme pensée pour rendre le suivi bucco-dentaire simple et accessible.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {highlights.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
