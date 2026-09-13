import React from "react";
import { Target, HeartHandshake, ShieldCheck, Users } from "lucide-react";

const values = [
  { icon: Target, title: "Notre mission", text: "Rendre le dépistage bucco-dentaire accessible à tous, partout, grâce à l'intelligence artificielle." },
  { icon: ShieldCheck, title: "Fiabilité", text: "Nos modèles sont entraînés et validés avec des professionnels de santé pour des résultats fiables." },
  { icon: HeartHandshake, title: "Proximité", text: "Nous orientons chaque utilisateur vers un centre de santé partenaire adapté à ses besoins." },
  { icon: Users, title: "Une équipe engagée", text: "Ingénieurs, chirurgiens-dentistes et data scientists travaillent ensemble sur chaque fonctionnalité." },
];

const team = [
  { name: "Dr. Amina Ndongo", role: "Fondatrice & chirurgien-dentiste" },
  { name: "Junior Mbarga", role: "Responsable ingénierie IA" },
  { name: "Clarisse Fouda", role: "Responsable partenariats santé" },
];

export default function APropos() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="max-w-5xl mx-auto px-8 py-20">
        <span className="text-sm font-semibold text-blue-600">À propos</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
          Dentalis AI, l'IA au service de votre sourire
        </h1>
        <p className="text-gray-600 max-w-2xl mb-14">
          Dentalis AI est née d'un constat simple : trop de personnes retardent
          une visite chez le dentiste faute d'information ou d'accès à un
          centre de santé proche. Notre plateforme aide chacun à comprendre
          ses symptômes et à agir au bon moment.
        </p>

        <div className="grid grid-cols-2 gap-6 mb-16">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 p-5 rounded-2xl bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-100">
                <Icon size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">L'équipe</h2>
        <div className="grid grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="p-5 rounded-2xl border border-gray-100 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 font-semibold flex items-center justify-center mx-auto mb-3">
                {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <p className="font-medium text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}