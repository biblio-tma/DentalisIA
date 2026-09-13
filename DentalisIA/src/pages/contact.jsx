import React, { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const contacts = [
  { label: "Support général", telephone: "678 90 12 34", email: "support@dentalis-ai.cm" },
  { label: "Partenariats centres de santé", telephone: "691 23 45 67", email: "partenariats@dentalis-ai.cm" },
  { label: "Presse & médias", telephone: "655 78 90 12", email: "presse@dentalis-ai.cm" },
];

export default function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit() {
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="max-w-5xl mx-auto px-8 py-20">
        <span className="text-sm font-semibold text-blue-600">Contact</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
          Parlons de votre santé bucco-dentaire
        </h1>
        <p className="text-gray-600 max-w-2xl mb-12">
          Une question sur Dentalis AI, un partenariat ou un problème
          technique ? Notre équipe vous répond rapidement.
        </p>

        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            {contacts.map((c) => (
              <div key={c.label} className="p-5 rounded-2xl bg-gray-50">
                <p className="font-medium text-gray-900 mb-3">{c.label}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Phone size={15} className="text-blue-600" />
                  {c.telephone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={15} className="text-blue-600" />
                  {c.email}
                </div>
              </div>
            ))}
            <div className="flex items-start gap-2 text-sm text-gray-500 pt-2">
              <MapPin size={15} className="mt-0.5 text-gray-400" />
              Siège social — Quartier Bastos, Yaoundé, Cameroun
            </div>
          </div>

          <div>
            {sent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-700 text-sm">
                Message envoyé. Notre équipe vous répondra sous 24h.
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Nom</label>
                  <input
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vous@exemple.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Décrivez votre demande"
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                {error && <p className="text-sm text-rose-500">{error}</p>}
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  Envoyer
                  <Send size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}