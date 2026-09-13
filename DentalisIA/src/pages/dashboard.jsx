import React, {useState, useEffect} from "react";
import {
  FilePlus,
  History,
  MapPin,
  User,
  CheckCircle2,
  ChevronRight,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  CalendarDays,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAnalyse } from "../hooks/AnalyseContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    historique,
      profil: patient,
  } = useAnalyse();
  // ============================================================
  // DONNÉES
  // ============================================================



const totalAnalyses = historique.length;

const derniereAnalyse = historique[0] || null;

const urgence =
  derniereAnalyse?.reponse?.niveau_urgence?.niveau ||
  "faible";

const getNiveauSante = (urgence) => {
  const niveau = urgence.toLowerCase();

  if (
    niveau.includes("urgent") ||
    niveau.includes("critique")
  ) {
    return {
      label: "Attention urgente",
      colorClasses: "text-red-600",
      iconColor: "text-red-500",
    };
  }

  if (
    niveau.includes("élev") ||
    niveau.includes("eleve")
  ) {
    return {
      label: "Attention nécessaire",
      colorClasses: "text-orange-600",
      iconColor: "text-orange-500",
    };
  }

  if (
    niveau.includes("modér") ||
    niveau.includes("moder")
  ) {
    return {
      label: "À surveiller",
      colorClasses: "text-amber-600",
      iconColor: "text-amber-500",
    };
  }

  return {
    label: "État stable",
    colorClasses: "text-emerald-600",
    iconColor: "text-emerald-500",
  };
};

const niveauSante = getNiveauSante(urgence);

  // ============================================================
  // ACCÈS RAPIDE
  // ============================================================

  const quickAccessItems = [
    {
      title: "Nouvelle analyse",
      description: "Analyser un nouveau symptôme",
      icon: FilePlus,
      path: "/question1",
      iconWrapper:
        "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      arrow:
        "text-blue-500 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Centres de santé",
      description: "Trouver un professionnel proche",
      icon: MapPin,
      path: "/centresdeSante",
      iconWrapper:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
      arrow:
        "text-emerald-500 bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white",
    },
    {
      title: "Historique",
      description: "Consulter vos analyses",
      icon: History,
      path: "/historique",
      iconWrapper:
        "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
      arrow:
        "text-violet-500 bg-violet-50 group-hover:bg-violet-600 group-hover:text-white",
    },
    {
      title: "Mon profil",
      description: "Gérer vos informations",
      icon: User,
      path: "/profil",
      iconWrapper:
        "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
      arrow:
        "text-amber-500 bg-amber-50 group-hover:bg-amber-500 group-hover:text-white",
    },
  ];

  // ============================================================
  // STATISTIQUES
  // ============================================================

  const statistics = [
    {
      label: "Analyses réalisées",
      value: totalAnalyses,
      description:
        totalAnalyses > 0
          ? "Depuis votre première utilisation"
          : "Aucune analyse réalisée",
      icon: Activity,
      iconClass: "bg-blue-50 text-blue-600",
      path: "/historique",
      accent: "group-hover:text-blue-600",
    },
    {
      label: "Dernière analyse",
      value: derniereAnalyse?.date || "—",
      description: derniereAnalyse
        ? derniereAnalyse.pathologie || "Analyse dentaire"
        : "Votre activité apparaîtra ici",
      icon: CalendarDays,
      iconClass: "bg-violet-50 text-violet-600",
      path: "/historique",
      accent: "group-hover:text-violet-600",
    },
    {
      label: "État de santé",
      value: niveauSante.label,
      description: "Basé sur votre dernière analyse",
      icon: CheckCircle2,
      iconClass: `${niveauSante.iconColor} bg-emerald-50`,
      path: "/profil",
      accent: "group-hover:text-emerald-600",
    },
  ];

  const handleOpenReport = (analyse) => {
    navigate("/rapport", {
    state: {
      section: analyse.questionnaire,
      analyse: analyse.reponse,
    },
  });
  };

  return (
    <div className="w-full min-w-0">

      {/* ==========================================================
          HERO / BIENVENUE
      =========================================================== */}
      <section className="relative mb-7 overflow-hidden rounded-[28px] bg-[#071a33] shadow-[0_20px_60px_rgba(7,26,51,0.14)] sm:mb-8">

        {/* Decorative backgrounds */}
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_65%)]" />

        <div className="relative flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10 xl:p-11">

          {/* Text */}
          <div className="min-w-0 max-w-2xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
                Assistant dentaire intelligent
              </span>
            </div>

            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-[38px]">
              Bonjour, {patient.prenom} {patient.nom}
              {/* <span className="ml-2">👋</span> */}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-[15px]">
              Prenez soin de votre sourire. Analysez vos symptômes,
              consultez votre historique et trouvez rapidement un
              centre de santé adapté.
            </p>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => navigate("/question1")}
            className="group inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-[#071a33] shadow-xl shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0 sm:w-auto sm:px-6"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white transition-transform group-hover:rotate-3">
              <FilePlus className="h-4 w-4" />
            </span>

            <span>Nouvelle analyse</span>

            <ArrowUpRight className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </section>

      {/* ==========================================================
          STATISTIQUES
      =========================================================== */}
      <section className="mb-8">

        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
              Vue d'ensemble
            </p>

            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              Votre suivi
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/historique")}
            className="hidden items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-blue-600 sm:flex"
          >
            Voir l'historique
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <button
                key={stat.label}
                type="button"
                onClick={() => navigate(stat.path)}
                className="group min-w-0 rounded-[22px] border border-slate-200/70 bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-300 transition-all group-hover:bg-slate-100 group-hover:text-slate-600">
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>

                <div className="mt-5 min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {stat.label}
                  </p>

                  <p
                    className={`
                      mt-1
                      truncate
                      text-xl
                      font-extrabold
                      tracking-tight
                      text-slate-900
                      transition-colors
                      sm:text-2xl
                      ${stat.accent}
                    `}
                  >
                    {stat.value}
                  </p>

                  <p className="mt-1.5 truncate text-xs font-medium text-slate-400">
                    {stat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==========================================================
          ACCÈS RAPIDE
      =========================================================== */}
      <section className="mb-8">

        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
            Raccourcis
          </p>

          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            Accès rapide
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {quickAccessItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.path)}
                className="group flex min-w-0 items-center gap-4 rounded-[22px] border border-slate-200/70 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.07)] sm:p-5"
              >

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    transition-all
                    duration-200
                    group-hover:scale-105
                    ${item.iconWrapper}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-bold text-slate-800 transition-colors group-hover:text-slate-950">
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-[11px] leading-4 text-slate-400">
                    {item.description}
                  </p>
                </div>

                <span
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    transition-all
                    duration-200
                    ${item.arrow}
                  `}
                >
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==========================================================
          DERNIÈRE ANALYSE
      =========================================================== */}
      <section>

        <div className="mb-4 flex items-end justify-between gap-4">

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
              Activité récente
            </p>

            <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              Dernière analyse
            </h2>
          </div>

          {derniereAnalyse && (
            <button
              type="button"
              onClick={() => navigate("/historique")}
              className="hidden items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-blue-600 sm:flex"
            >
              Tout voir
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {derniereAnalyse ? (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/70 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.045)]">

            <div className="flex flex-col lg:flex-row">

              {/* --------------------------------------------------
                  IMAGE
              -------------------------------------------------- */}
              <div className="relative h-52 w-full shrink-0 overflow-hidden sm:h-64 lg:h-auto lg:min-h-[250px] lg:w-[34%]">

                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900"
                  alt="Analyse dentaire"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Analyse terminée
                  </span>
                </div>
              </div>

              {/* --------------------------------------------------
                  CONTENT
              -------------------------------------------------- */}
              <div className="flex min-w-0 flex-1 flex-col justify-between p-5 sm:p-7">

                <div>

                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Résultat disponible
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {derniereAnalyse.date}
                    </span>
                  </div>

                  <h3 className="break-words text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    {derniereAnalyse.pathologie}
                  </h3>

                  <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">
                    Résultat issu de votre dernière analyse dentaire.
                    Consultez votre historique pour accéder aux détails
                    complets et aux recommandations.
                  </p>

                  {/* Metrics */}
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Niveau de confiance
                        </span>

                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>

                      <div className="mt-2 flex items-end gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {derniereAnalyse.confiance}
                        </span>

                        <span className="mb-1 text-xs font-bold text-slate-400">
                          %
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                Number(derniereAnalyse.confiance) || 95
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          État général
                        </span>

                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      </div>

                      <div className="mt-2 flex min-w-0 items-center gap-2">
                        <CheckCircle2
                          className={`h-5 w-5 shrink-0 ${niveauSante.iconColor}`}
                        />

                        <span
                          className={`truncate text-sm font-extrabold ${niveauSante.colorClasses}`}
                        >
                          {niveauSante.label}
                        </span>
                      </div>

                      <p className="mt-2 truncate text-[10px] text-slate-400">
                        Basé sur votre dernière analyse
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <p className="hidden text-[11px] text-slate-400 sm:block">
                    Consultez les détails de votre rapport.
                  </p>

                  <button
                    type="button"
                    onClick={() => handleOpenReport(derniereAnalyse)}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#071a33] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#071a33]/10 transition-all hover:-translate-y-0.5 hover:bg-blue-600 active:translate-y-0 sm:w-auto"
                  >
                    Voir le rapport

                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FilePlus className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
              Aucune analyse pour le moment
            </h3>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-400">
              Commencez votre première analyse pour obtenir un suivi
              personnalisé de votre santé dentaire.
            </p>

            <button
              type="button"
              onClick={() => navigate("/question1")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#071a33] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-600"
            >
              Commencer une analyse
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}





// import React from 'react';
// import {
//   LayoutDashboard,
//   FilePlus,
//   History,
//   MapPin,
//   User,
//   LogOut,
//   Bell,
//   CheckCircle2,
//   ChevronRight
// } from 'lucide-react';
// import { useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/images/logoIdeal.png";
// import { HISTORIQUE, getDerniereAnalyse, getNiveauSante } from "./historique";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Données dérivées de l'historique (source unique de vérité)
//   const totalAnalyses = HISTORIQUE.length;
//   const derniereAnalyse = getDerniereAnalyse(HISTORIQUE);
//   const niveauSante = getNiveauSante(derniereAnalyse?.urgence);

//   // Navigation latérale
//   const navItems = [
//     { name: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
//     { name: 'Profil', icon: User, path: '/profil' },
//     { name: 'Nouvelle analyse', icon: FilePlus, path: '/question1' },
//     { name: 'Historique', icon: History, path: '/historique' },
//     { name: 'Centres de santé', icon: MapPin, path: '/localisation' },
//   ];

//   const quickAccessItems = [
//     { title: 'Nouvelle analyse', icon: FilePlus, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100', path: '/question1' },
//     { title: 'Centres de santé', icon: MapPin, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100', path: '/localisation' },
//     { title: 'Historique', icon: History, color: 'bg-rose-50 text-rose-600 hover:bg-rose-100', path: '/historique' },
//     { title: 'Mon profil', icon: User, color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100', path: '/profil' },
//   ];

//   return (
//     <div className="flex h-screen bg-slate-100 font-sans antialiased text-slate-800">

//       {/* 1. BARRE LATÉRALE (SIDEBAR) */}
//       <aside className="w-64 bg-[#0a192f] text-slate-300 flex flex-col justify-between p-4 shadow-xl">
//         <div>
//           <div className="flex items-center gap-3 px-3 py-4 mb-6">
//             <img
//               src={logo}
//               alt="Logo Dentalis IA"
//               className="w-9 h-9 object-contain"
//             />
//             <span className="text-xl font-bold text-white tracking-wide">Dentalis IA</span>
//           </div>

//           <nav className="space-y-1.5">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = location.pathname === item.path;
//               return (
//                 <button
//                   key={item.name}
//                   onClick={() => navigate(item.path)}
//                   className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
//                     isActive
//                       ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
//                       : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span>{item.name}</span>
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="pt-4 border-t border-slate-800">
//           <button
//             onClick={() => navigate("/login")}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
//           >
//             <LogOut className="w-5 h-5" />
//             Déconnexion
//           </button>
//         </div>
//       </aside>

//       {/* 2. CONTENU PRINCIPAL */}
//       <main className="flex-1 overflow-y-auto p-8">

//         <header className="flex justify-between items-start mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//               Bonjour, Marie <span className="animate-bounce">👋</span>
//             </h1>
//             <p className="text-slate-500 text-sm mt-1">
//               Prenez soin de votre sourire aujourd'hui !
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <button 
//               aria-label="Notifications"
//               className="p-2.5 bg-white rounded-full text-slate-500 shadow-sm hover:shadow hover:bg-slate-50 transition border border-slate-200/60 cursor-pointer"
//             >
//               <Bell className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => navigate("/profil")}
//               className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-500 transition cursor-pointer"
//               title="Voir le profil"
//             >
//               <img
//                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
//                 alt="Marie"
//                 className="w-full h-full object-cover"
//               />
//             </button>
//           </div>
//         </header>

//         {/* SECTION 1: CARTES DE STATISTIQUES (connectées à l'historique) */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div 
//             onClick={() => navigate("/historique")}
//             className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-200 hover:shadow-md transition group"
//           >
//             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 group-hover:text-blue-600 transition-colors">
//               Analyses totales
//             </p>
//             <div className="flex justify-between items-baseline">
//               <p className="text-3xl font-extrabold text-blue-600">{totalAnalyses}</p>
//               <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
//             </div>
//           </div>

//           <div 
//             onClick={() => navigate("/historique")}
//             className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-blue-200 hover:shadow-md transition group"
//           >
//             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 group-hover:text-blue-600 transition-colors">
//               Dernière analyse
//             </p>
//             <div className="flex justify-between items-baseline">
//               <p className="text-2xl font-bold text-slate-800">{derniereAnalyse?.date || "—"}</p>
//               <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
//             </div>
//           </div>

//           <div 
//             onClick={() => navigate("/profil")}
//             className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:border-emerald-200 hover:shadow-md transition group"
//           >
//             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 group-hover:text-emerald-600 transition-colors">
//               Niveau de santé
//             </p>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <CheckCircle2 className={`w-6 h-6 ${niveauSante.iconColor}`} />
//                 <span className={`text-2xl font-bold ${niveauSante.colorClasses}`}>{niveauSante.label}</span>
//               </div>
//               <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
//             </div>
//           </div>
//         </section>

//         {/* SECTION 2: ACCÈS RAPIDE */}
//         <section className="mb-8">
//           <h2 className="text-lg font-bold text-slate-800 mb-4">Accès rapide</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {quickAccessItems.map((item, index) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={index}
//                   onClick={() => navigate(item.path)}
//                   className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md hover:border-slate-200 transition active:scale-95 cursor-pointer group"
//                 >
//                   <div className={`p-3.5 rounded-2xl ${item.color} group-hover:scale-110 transition-all duration-200`}>
//                     <Icon className="w-6 h-6" />
//                   </div>
//                   <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
//                     {item.title}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </section>

//         {/* SECTION 3: DERNIÈRE ANALYSE (connectée à l'historique) */}
//         <section>
//           <h2 className="text-lg font-bold text-slate-800 mb-4">Dernière analyse</h2>
//           {derniereAnalyse ? (
//             <div 
//               onClick={() => navigate("/historique")}
//               className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md hover:border-slate-200 transition cursor-pointer group"
//             >
//               <div className="flex items-center gap-5">
//                 <img
//                   src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300"
//                   alt="Symptôme dentaire"
//                   className="w-20 h-20 rounded-xl object-cover shadow-inner border border-slate-100 group-hover:scale-105 transition-transform"
//                 />

//                 <div className="space-y-1">
//                   <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
//                     {derniereAnalyse.pathologie}
//                   </h3>
//                   <p className="text-xs font-medium text-slate-500">
//                     Confiance : <span className="font-semibold text-slate-700">{derniereAnalyse.confiance}%</span>
//                   </p>
//                   <p className="text-xs text-slate-400">{derniereAnalyse.date}</p>
//                 </div>
//               </div>

//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate("/historique");
//                 }}
//                 className="flex items-center gap-2 px-5 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white font-semibold text-sm rounded-xl transition-all duration-200 border border-blue-100 shadow-sm cursor-pointer"
//               >
//                 Voir le rapport
//               </button>
//             </div>
//           ) : (
//             <p className="text-sm text-slate-400">Aucune analyse pour le moment.</p>
//           )}
//         </section>

//       </main>
//     </div>
//   );
// }
