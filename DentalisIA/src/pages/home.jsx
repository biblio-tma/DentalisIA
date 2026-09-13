import { Link, useNavigate } from "react-router-dom";
import React from "react";

import backgroundImage from "../assets/images/dentition1.png";
import logo from "../assets/images/logoIdeal1.png";

import videoPresentation from "../assets/videos/tuto.mp4";

import carie from "../assets/images/4.jpg";
import gingivite from "../assets/images/5.jpg";
import plaque from "../assets/images/6.jpg";
import infection from "../assets/images/7.jpg";
import sensibilite from "../assets/images/8.jpg";
import inflammation from "../assets/images/10.jpg";

/**
 * Dentalis AI — Landing page
 */

const navLinks = [
  { label: "À propos", to: "/a-propos" },
  { label: "Fonctionnalités", to: "/fonctionnalites" },
  { label: "Centres de santé", to: "/centreSante" },
  { label: "Contact", to: "/contact" },
];

const FEATURES = [
  {
    title: "Analyse IA précise",
    icon: (
      <path d="M12 2a5 5 0 0 1 5 5v1.17A4 4 0 0 1 20 12v1a4 4 0 0 1-2 3.46V18a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-1.54A4 4 0 0 1 4 13v-1a4 4 0 0 1 3-3.87V7a5 5 0 0 1 5-5Z" />
    ),
  },
  {
    title: "Résultats instantanés",
    icon: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  },
  {
    title: "Conseils personnalisés",
    icon: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    ),
  },
  {
    title: "Centres de santé à proximité",
    icon: (
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    ),
  },
];

function FeatureIcon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="#2f6fed"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-slate-900">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        className="min-h-screen flex flex-col relative overflow-hidden"
       
      >
        <div className="w-full h-full absolute z-0"><img src={backgroundImage} alt="Background" className="w-full h-full object-cover fixed" /></div>
        {/* ================= HEADER ================= */}

        <header className="relative z-20 sticky top-0 ... w-full bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">

          <div className="w-full px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">

            {/* Logo */}

            <div className="flex items-center gap-2 font-semibold text-lg shrink-0">

              <span className="inline-flex w-10 h-10 items-center justify-center">

                <img
                  src={logo}
                  alt="Logo Dentalis AI"
                  className="w-9 h-9 object-contain"
                />

              </span>

              <strong className="text-lg md:text-xl">
                Dentalis AI
              </strong>

            </div>


            {/* Navigation */}

            <nav className="hidden lg:flex items-center gap-7 xl:gap-10 text-base xl:text-lg text-black font-bold">

              {navLinks.map((link) => (

                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>

              ))}

            </nav>


            {/* Boutons */}

            <div className="flex items-center gap-3 md:gap-4 shrink-0">

              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block text-base md:text-lg font-bold text-black hover:text-blue-600 transition-colors"
              >
                Se connecter
              </button>


              <button
                onClick={() => navigate("/signup")}
                className="text-sm md:text-base font-medium bg-gray-900 text-white px-4 md:px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
              >
                Créer un compte
              </button>

            </div>

          </div>

        </header>


        {/* ================= HERO CONTENT ================= */}

        <main className="relative z-10 w-full ...l max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-20 flex-1 flex items-center">

          <div className="max-w-2xl lg:max-w-3xl">

            {/* Petit texte */}

            <span className="inline-block text-blue-600 font-bold text-sm md:text-base uppercase tracking-wider mb-4">
              Votre santé, notre priorité
            </span>


            {/* Titre */}

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight">

              Votre santé bucco-dentaire entre de{" "}

              <span className="text-blue-600 inline-block">
                bonnes mains
              </span>

            </h1>


            {/* Description */}

            <p className="mt-6 text-black text-lg sm:text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">

              <strong>
                Dentalis AI utilise l'intelligence artificielle pour analyser
                vos symptômes, détecter les pathologies et vous orienter vers
                les meilleurs soins.
              </strong>

            </p>


            {/* Boutons */}

            <div className="mt-8 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white font-semibold text-base md:text-lg px-8 py-3.5 rounded-full hover:bg-blue-700 transition-colors shadow-md"
              >
                Commencer
              </button>


              <button
                onClick={() => navigate("/a-propos")}
                className="border border-slate-300 bg-white/50 backdrop-blur-sm hover:border-blue-600 text-black hover:text-blue-600 font-semibold text-base md:text-lg px-8 py-3.5 rounded-full transition-colors"
              >
                En savoir plus
              </button>

            </div>


            {/* Fonctionnalités rapides */}

            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-2xl">

              {FEATURES.map((f) => (

                <div
                  key={f.title}
                  className="flex items-center gap-3 bg-white/30 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none p-2 sm:p-0 rounded-lg"
                >

                  <span className="inline-flex w-10 h-10 rounded-full bg-blue-100/80 items-center justify-center shrink-0">

                    <FeatureIcon>
                      {f.icon}
                    </FeatureIcon>

                  </span>


                  <span className="text-base md:text-lg text-black font-bold leading-snug">
                    {f.title}
                  </span>

                </div>

              ))}

            </div>

          </div>

        </main>

      </section>


      {/* =========================================================
          COMMENT FONCTIONNE DENTALIS AI
      ========================================================= */}

      <section className="relative z-30 py-20 md:py-24 bg-transparent">

        <div className="max-w-7xl mx-auto  bg-transparent px-6 md:px-12">

          {/* Titre */}

          <div className="text-center  mb-14">

            <span className="text-blue-600 font-extrabold text-2xl uppercase tracking-wider px-2 py-1 rounded-full">
              Notre fonctionnement
            </span>

            <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              Comment fonctionne Dentalis AI ?
            </h2>

            <p className="mt-4 text-black font-extrabold text-lg max-w-2xl mx-auto">
              Découvrez un parcours simple et rapide pour obtenir une première
              analyse de votre santé bucco-dentaire.
            </p>

          </div>


          {/* Contenu */}

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">


            {/* Vidéo */}

            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

              <video
                className="w-full aspect-video object-cover"
                controls
                preload="metadata"
              >
                <source src={videoPresentation} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
               </video>

            </div>


            {/* Étapes */}

            <div className="space-y-7">

              {[
                {
                  title: "Répondez au questionnaire",
                  text: "Décrivez vos symptômes et les éventuelles gênes ressenties.",
                },
                {
                  title: "Importez une photo",
                  text: "Ajoutez une photo de votre dentition pour permettre l'analyse.",
                },
                {
                  title: "Analyse par IA",
                  text: "Dentalis AI analyse les informations et l'image transmises.",
                },
                {
                  title: "Résultat et recommandations",
                  text: "Consultez la pathologie probable, les conseils et le niveau d'urgence.",
                },
                {
                  title: "Centre de santé recommandé",
                  text: "Localisez les centres de santé adaptés à proximité.",
                },
              ].map((step, index) => (

                <div
                  key={index}
                  className="flex gap-5 items-start"
                >

                  {/* Numéro */}

                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                    {index + 1}
                  </div>


                  {/* Texte */}

                  <div>

                    <h3 className="font-bold text-lg md:text-xl text-slate-900">
                      {step.title}
                    </h3>

                    <p className="mt-1 text-gray-600 leading-relaxed">
                      {step.text}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          NOS FONCTIONNALITÉS
      ========================================================= */}

      <section className="relative z-30 py-20 md:py-24 bg-transparent">

        <div className="max-w-7xl mx-auto bg-transparent px-6 md:px-12">

          {/* Titre */}

          <div className="text-center mb-14">

            <span className="text-blue-600 font-semibold text-2xl uppercase tracking-wider font-bold px-2 py-1 rounded-full">
              Ce que nous proposons
            </span>

            <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              Nos fonctionnalités
            </h2>

            <p className="mt-4 text-black font-extrabold text-lg max-w-2xl mx-auto">
              Une solution intelligente pour vous accompagner dans le suivi
              et la compréhension de votre santé bucco-dentaire.
            </p>

          </div>


          {/* Cartes */}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              {
                icon: "🦷",
                title: "Analyse intelligente",
                text: "Détection préliminaire des pathologies bucco-dentaires grâce à l'intelligence artificielle.",
              },
              {
                icon: "📷",
                title: "Importation de photos",
                text: "Importez une photo de votre dentition afin de permettre une analyse automatisée.",
              },
              {
                icon: "📍",
                title: "Géolocalisation",
                text: "Trouvez les centres de santé adaptés et situés à proximité de votre position.",
              },
              {
                icon: "⚡",
                title: "Résultats rapides",
                text: "Obtenez rapidement une synthèse de l'analyse avec les principales recommandations.",
              },
              {
                icon: "🔒",
                title: "Historique sécurisé",
                text: "Consultez facilement vos analyses précédentes depuis votre espace personnel.",
              },
              {
                icon: "💡",
                title: "Conseils personnalisés",
                text: "Recevez des recommandations de prévention adaptées aux résultats obtenus.",
              },
            ].map((feature, index) => (

              <div
                key={index}
                className="group bg-white border border-slate-100 rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                {/* Icône */}

                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 transition-colors">

                  <span className="group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </span>

                </div>


                {/* Titre */}

                <h3 className="font-bold text-xl text-slate-900 mb-3">
                  {feature.title}
                </h3>


                {/* Description */}

                <p className="text-gray-600 leading-relaxed">
                  {feature.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =========================================================
    PATHOLOGIES DÉTECTABLES
========================================================= */}

<section className="relative z-30 py-20 md:py-24 bg-transparent">
  <div className="max-w-7xl mx-auto px-6 md:px-12">

    {/* Titre */}
    <div className="text-center mb-14">

      <span className="text-blue-600 font-bold text-2xl uppercase tracking-wider px-2 py-1 rounded-full">
        Analyse bucco-dentaire
      </span>

      <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-black">
        Pathologies détectables
      </h2>

      <p className="mt-4 text-black font-extrabold text-lg max-w-2xl mx-auto">
        Dentalis AI permet d'identifier plusieurs pathologies
        bucco-dentaires courantes à partir des symptômes
        renseignés et des images importées.
      </p>

    </div>

    {/* Cartes */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

      {[
        {
          image: carie,
          title: "Caries dentaires",
        },
        {
          image: gingivite,
          title: "Gingivite",
        },
        {
          image: plaque,
          title: "Plaque dentaire",
        },
        {
          image: infection,
          title: "Infection dentaire",
        },
        {
          image: sensibilite,
          title: "Sensibilité dentaire",
        },
        {
          image: inflammation,
          title: "Inflammation gingivale",
        },
      ].map((pathologie, index) => (

        <div
          key={index}
          className="group bg-white border border-slate-100 rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
        >

          <img
            src={pathologie.image}
            alt={pathologie.title}
            className="w-full h-24 object-contain mb-4"
          />

          <h3 className="font-bold text-slate-900 text-sm md:text-base">
            {pathologie.title}
          </h3>

          </div>

            ))}

          </div>

         </div>

      </section>


      {/* =========================================================
    FOOTER PREMIUM
========================================================= */}

<footer className="relative z-40 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">

  {/* CTA */}
  <div className="border-b border-white/10">

    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">

      <div>
        <h2 className="text-2xl md:text-3xl font-bold">
          Prenez soin de votre sourire dès aujourd'hui !
        </h2>

        <p className="mt-2 text-slate-300">
          Rejoignez des milliers d'utilisateurs qui font confiance à
          Dentalis AI pour leur santé bucco-dentaire.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition"
        >
          Commencer l'analyse
        </button>

        <button
          onClick={() => navigate("/a-propos")}
          className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-xl font-semibold transition"
        >
          En savoir plus
        </button>

      </div>

    </div>

  </div>

  {/* Footer principal */}

  <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">

    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">

      {/* Colonne 1 */}

      <div>

        <div className="flex items-center gap-3 mb-4">

          <img
            src={logo}
            alt="Dentalis AI"
            className="w-10 h-10 object-contain"
          />

          <span className="font-bold text-xl">
            Dentalis AI
          </span>

        </div>

        <p className="text-slate-300 leading-relaxed">
          Dentalis AI est votre assistant intelligent pour une santé
          bucco-dentaire optimale.
          Analysez, comprenez et agissez pour un sourire sain.
        </p>

      </div>

      {/* Navigation */}

      <div>

        <h3 className="font-bold text-lg mb-4">
          Navigation
        </h3>

        <ul className="space-y-3 text-slate-300">

          <li>
            <Link to="/a-propos" className="hover:text-blue-400">
              À propos
            </Link>
          </li>

          <li>
            <Link to="/fonctionnalites" className="hover:text-blue-400">
              Fonctionnalités
            </Link>
          </li>

          <li>
            <Link to="/centreSante" className="hover:text-blue-400">
              Centres de santé
            </Link>
          </li>

          <li>
            <Link to="/contact" className="hover:text-blue-400">
              Contact
            </Link>
          </li>

        </ul>

      </div>

      {/* Ressources */}

      <div>

        <h3 className="font-bold text-lg mb-4">
          Ressources
        </h3>

        <ul className="space-y-3 text-slate-300">

          <li>Blog</li>
          <li>FAQ</li>
          <li>Prévention</li>
          <li>Conditions d'utilisation</li>

        </ul>

      </div>

      {/* Légal */}

      <div>

        <h3 className="font-bold text-lg mb-4">
          Légal
        </h3>

        <ul className="space-y-3 text-slate-300">

          <li>Politique de confidentialité</li>
          <li>Mentions légales</li>
          <li>CGU</li>

        </ul>

      </div>

      {/* Contact */}

      <div>

        <h3 className="font-bold text-lg mb-4">
          Contact
        </h3>

        <ul className="space-y-3 text-slate-300">

          <li>contact@dentalis-ai.com</li>
          <li>+237 6 12 34 56 78</li>
          <li>Yaoundé, Cameroun</li>

        </ul>

      </div>

    </div>

    {/* Copyright */}

    <div className="mt-12 pt-6 border-t border-white/10 text-center text-slate-400">

      © 2026 Dentalis AI. Tous droits réservés.

    </div>

  </div>

  </footer>
  </div>
  );
}