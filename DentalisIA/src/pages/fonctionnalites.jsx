import React from "react";
import { Sparkles, Zap, Compass, MapPin, FileText, BellRing } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Analyse IA précise", text: "Décrivez vos symptômes ou téléversez une photo, notre IA identifie les pathologies dentaires les plus probables." },
  { icon: Zap, title: "Résultats instantanés", text: "Obtenez une évaluation préliminaire en quelques secondes, sans attendre un rendez-vous." },
  { icon: Compass, title: "Conseils personnalisés", text: "Des recommandations de soins adaptées à votre profil, votre historique et le niveau d'urgence détecté." },
  { icon: MapPin, title: "Centres de santé à proximité", text: "Localisez et contactez directement le centre partenaire le plus proche de chez vous." },
  { icon: FileText, title: "Suivi de dossier", text: "Retrouvez l'historique de vos analyses et de vos échanges avec les professionnels de santé." },
  { icon: BellRing, title: "Rappels de suivi", text: "Recevez des rappels pour vos contrôles réguliers et le suivi d'un traitement en cours." },
];

export default function Fonctionnalites() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="max-w-5xl mx-auto px-8 py-20">
        <span className="text-sm font-semibold text-blue-600">Fonctionnalités</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
          Tout ce qu'il faut pour prendre soin de votre sourire
        </h1>
        <p className="text-gray-600 max-w-2xl mb-14">
          Dentalis AI accompagne chaque étape, du premier symptôme jusqu'à la
          prise en charge par un professionnel.
        </p>

        <div className="grid grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <Icon size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}