import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Droplets,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Activity,
  TriangleAlert,
  Wind,
} from "lucide-react";

/* ============================================================
   SYMPTÔMES
   ============================================================ */

const SYMPTOMES = [
  {
    id: "douleur",
    label: "Douleur dentaire",
    description: "Douleur localisée sur une ou plusieurs dents",
    icon: Activity,
  },
  {
    id: "saignement",
    label: "Saignement des gencives",
    description: "Saignement lors du brossage ou spontanément",
    icon: Droplets,
  },
  {
    id: "gonflement",
    label: "Gonflement",
    description: "Gencive, joue ou mâchoire gonflée",
    icon: AlertCircle,
  },
  {
    id: "taches",
    label: "Taches sur les dents",
    description: "Apparition de zones noires ou brunes visibles",
    icon: Activity,
  },
  {
    id: "contact",
    label: "Douleur au contact",
    description: "Douleur vive lors d'un contact avec un outil",
    icon: Stethoscope,
  },
  {
    id: "douleur-intense",
    label: "Douleur intense",
    description: "Douleur importante ou difficile à supporter",
    icon: TriangleAlert,
  },
  {
    id: "pus",
    label: "Boule ou écoulement",
    description: "Boule blanche/rouge ou présence de pus",
    icon: AlertCircle,
  },
  {
    id: "sucre",
    label: "Douleur avec les aliments sucrés",
    description: "Gêne ou douleur lors de la consommation",
    icon: HeartPulse,
  },
  {
    id: "haleine",
    label: "Mauvaise haleine",
    description: "Odeur persistante malgré le brossage",
    icon: Wind,
  },
  {
    id: "mobilite",
    label: "Mobilité dentaire",
    description: "Une ou plusieurs dents semblent bouger",
    icon: Activity,
  },
];

/* ============================================================
   COMPOSANT
   ============================================================ */

export default function Question1({
  currentStep = 1,
  totalSteps = 4,
}) {
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);

  const progress = Math.round(
    (currentStep / totalSteps) * 100
  );

  /* ==========================================================
     TOGGLE SYMPTÔME
     ========================================================== */

  function toggleSymptome(symptome) {
    setSelected((prev) =>
      prev.includes(symptome)
        ? prev.filter((symp) => symp !== symptome)
        : [...prev, symptome]
    );
  }

  /* ==========================================================
     CONTINUER
     ========================================================== */

  function handleContinue() {
    if (selected.length === 0) return;

    /*
     * On conserve les symptômes pour les prochaines étapes.
     * Cela permet à Question2 / Question3 de les récupérer.
     */
    const sysn = `Quels symptômes ressentez-vous ? ${selected}`
    sessionStorage.setItem(
      "dentalis_symptomes",
      JSON.stringify(sysn)
    );
console.log("symptome: ", sysn)
    navigate("/question2", { replace: true });
  }

  /* ==========================================================
     RETOUR
     ========================================================== */

  function handleBack() {
    navigate("/dashboard");
  }

  /* ==========================================================
     TEXTE DU COMPTEUR
     ========================================================== */

  const selectionText = useMemo(() => {
    if (selected.length === 0) {
      return "Aucun symptôme sélectionné";
    }

    if (selected.length === 1) {
      return "1 symptôme sélectionné";
    }

    return `${selected.length} symptômes sélectionnés`;
  }, [selected]);

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-900">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[72px] flex items-center justify-between gap-4">
            {/* Logo / retour */}
            <button
              type="button"
              onClick={handleBack}
              className="group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition">
                <ArrowLeft
                  size={18}
                  className="text-slate-500 group-hover:text-blue-600 transition"
                />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800">
                  Dentalis IA
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  Nouvelle analyse
                </p>
              </div>
            </button>

            {/* Sécurité */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <ShieldCheck
                size={15}
                className="text-emerald-600"
              />

              <span className="hidden sm:block text-[11px] font-bold text-emerald-700">
                Parcours sécurisé
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENU
          ===================================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* ===================================================
            BREADCRUMB
            =================================================== */}

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          <span>Analyse</span>

          <ChevronRight
            size={12}
            className="text-slate-300"
          />

          <span className="text-blue-600">
            Symptômes
          </span>
        </div>

        {/* ===================================================
            HERO / PROGRESSION
            =================================================== */}

        <section className="mt-5 bg-slate-950 rounded-3xl overflow-hidden relative shadow-xl shadow-slate-900/10">
          {/* Décor */}
          <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-blue-600/25 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Texte */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                  <Sparkles
                    size={13}
                    className="text-blue-300"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                    Analyse intelligente
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-4">
                  Parlons de vos symptômes
                </h1>

                <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
                  Sélectionnez les symptômes que vous
                  ressentez actuellement afin de permettre à
                  Dentalis IA de mieux analyser votre situation.
                </p>
              </div>

              {/* Étape */}
              <div className="lg:w-64">
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Progression
                    </p>

                    <p className="text-sm font-bold text-white mt-1">
                      Étape {currentStep}
                      <span className="text-slate-500">
                        {" "}
                        / {totalSteps}
                      </span>
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-blue-400">
                    {progress}%
                  </span>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                {/* Étapes */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {Array.from({
                    length: totalSteps,
                  }).map((_, index) => {
                    const step = index + 1;
                    const completed =
                      step <= currentStep;

                    return (
                      <div
                        key={step}
                        className={`h-1 rounded-full ${
                          completed
                            ? "bg-blue-400"
                            : "bg-white/10"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            QUESTION + LISTE
            =================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">
          {/* =================================================
              QUESTION
              ================================================= */}

          <section className="bg-white border border-slate-200/70 rounded-3xl shadow-sm overflow-hidden">
            {/* Header question */}
            <div className="p-6 sm:p-7 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <CircleHelp
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Étape {currentStep}
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Quels symptômes ressentez-vous ?
                  </h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Vous pouvez sélectionner plusieurs réponses.
                  </p>
                </div>
              </div>
            </div>

            {/* Liste */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SYMPTOMES.map((symptome) => {
                  const checked = selected.includes(
                    symptome.description
                  );

                  const Icon = symptome.icon;

                  return (
                    <button
                      type="button"
                      key={symptome.id}
                      onClick={() =>
                        toggleSymptome(symptome.description)
                      }
                      className={`
                        group relative w-full text-left
                        p-4 sm:p-4
                        rounded-2xl
                        border
                        transition-all duration-200
                        ${
                          checked
                            ? "border-blue-500 bg-blue-50/70 shadow-sm shadow-blue-500/10"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                        }
                      `}
                    >
                      {/* Check */}
                      <div
                        className={`
                          absolute top-4 right-4
                          w-6 h-6 rounded-lg
                          flex items-center justify-center
                          border
                          transition-all
                          ${
                            checked
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-slate-200 group-hover:border-blue-300"
                          }
                        `}
                      >
                        {checked && (
                          <Check
                            size={14}
                            strokeWidth={3}
                            className="text-white"
                          />
                        )}
                      </div>

                      {/* Icon */}
                      <div
                        className={`
                          w-10 h-10 rounded-xl
                          flex items-center justify-center
                          transition
                          ${
                            checked
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                          }
                        `}
                      >
                        <Icon size={18} />
                      </div>

                      {/* Texte */}
                      <div className="mt-4 pr-7">
                        <p
                          className={`
                            text-sm font-bold
                            ${
                              checked
                                ? "text-blue-900"
                                : "text-slate-800"
                            }
                          `}
                        >
                          {symptome.label}
                        </p>

                        <p
                          className={`
                            text-[11px] leading-relaxed mt-1
                            ${
                              checked
                                ? "text-blue-700/70"
                                : "text-slate-400"
                            }
                          `}
                        >
                          {symptome.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer action */}
            <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {selectionText}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Sélectionnez au moins un symptôme pour
                    continuer.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={selected.length === 0}
                  className={`
                    w-full sm:w-auto
                    h-12 px-6
                    rounded-xl
                    flex items-center justify-center gap-2
                    text-sm font-bold
                    transition-all duration-200
                    ${
                      selected.length > 0
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }
                  `}
                >
                  Continuer

                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>

          {/* =================================================
              SIDEBAR CONSEIL
              ================================================= */}

          <aside className="space-y-4">
            {/* Résumé */}
            <div className="bg-white border border-slate-200/70 rounded-3xl shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Activity
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Votre sélection
                  </p>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Symptômes identifiés
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-bold text-slate-900">
                  {selected.length}
                </span>

                <span className="text-xs text-slate-400 mb-1">
                  sélectionné
                  {selected.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (selected.length /
                        SYMPTOMES.length) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Conseil */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 shadow-lg shadow-blue-600/10">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Sparkles
                    size={18}
                    className="text-white"
                  />
                </div>

                <h3 className="text-sm font-bold text-white mt-4">
                  Conseil Dentalis IA
                </h3>

                <p className="text-xs text-blue-100/80 leading-relaxed mt-2">
                  Répondez le plus précisément possible.
                  Vos réponses permettront d'affiner les
                  prochaines étapes de votre analyse.
                </p>
              </div>
            </div>

            {/* Information médicale */}
            <div className="rounded-3xl bg-amber-50 border border-amber-100 p-5">
              <div className="flex gap-3">
                <TriangleAlert
                  size={18}
                  className="text-amber-600 flex-shrink-0 mt-0.5"
                />

                <div>
                  <p className="text-xs font-bold text-amber-800">
                    À savoir
                  </p>

                  <p className="text-[11px] leading-relaxed text-amber-700/80 mt-1.5">
                    Cette analyse est une aide à
                    l'orientation et ne remplace pas une
                    consultation chez un professionnel
                    dentaire.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ===================================================
            FOOTER
            =================================================== */}

        <div className="flex items-center justify-center gap-2 mt-6 mb-4">
          <ShieldCheck
            size={14}
            className="text-emerald-500"
          />

          <p className="text-[11px] text-slate-400">
            Vos réponses sont utilisées uniquement dans le
            cadre de votre analyse Dentalis IA.
          </p>
        </div>
      </main>
    </div>
  );
}




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import backgroundImage from "../assets/images/10.jpg"; // Correction du chemin de l'image
// import Button from "../components/Button";

// const SYMPTOMES = [
//   "Douleur dentaire",
//   "Saignement des gencives lors du brossage",
//   "Gonflement des gencives ou de la joue ou de la machoire",
//   "Apparition des noirs ou brune visible sur les dents",
//   "Douleur vive au contact direct d'un outil dentaire",
//   "Douleur intense",
//   "Apparition d'une boule blanche ou rouge sur la gencive qui s'ecouler du pus",
//   // "Sensibilité au froid",
//   "Consommation des alimments sucrées",
//   "Mauvaise haleine",
//   "Mobilité dentaire",
//   // "Autre symptôme",
// ];

// export default function Question1({
//   currentStep = 1,
//   totalSteps = 4,
// }) {
//   const navigate = useNavigate();

//   const [selected, setSelected] = useState([ ]);

//   const progress = Math.round((currentStep / totalSteps) * 100);

//   function toggleSymptome(symptome) {
//     setSelected((prev) =>
//       prev.includes(symptome)
//         ? prev.filter((s) => s !== symptome)
//         : [...prev, symptome]
//     );
//   }

//   function handleContinue() {
//     navigate("/question2");
//   }

//   return (
//     <div
//       className="min-h-screen w-full flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//       }}
//     >
//       <div className="w-full max-w-sm bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-8">

//         {/* Barre de progression */}
//         <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
//           <span>
//             Étape {currentStep} sur {totalSteps}
//           </span>

//           <span>{progress}%</span>
//         </div>

//         <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
//           <div
//             className="h-1.5 bg-blue-600 rounded-full transition-all"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         {/* Question */}
//         <h1 className="text-lg font-semibold text-black">
//           Quels symptômes décrivez-vous ?
//         </h1>

//         <p className="text-sm text-gray-400 mt-1">
//           Sélectionnez les symptômes que vous ressentez
//         </p>

//         {/* Symptômes */}
//         <div className="mt-6 space-y-1">
//           {SYMPTOMES.map((symptome) => {
//             const checked = selected.includes(symptome);

//             return (
//               <label
//                 key={symptome}
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
//               >
//                 <input
//                   type="checkbox"
//                   checked={checked}
//                   onChange={() => toggleSymptome(symptome)}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />

//                 <span
//                   className={`text-sm ${
//                     checked
//                       ? "text-gray-900 font-medium"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   {symptome}
//                 </span>
//               </label>
//             );
//           })}
//         </div>

//         {/* Bouton Continuer */}
//         <Button onClick={handleContinue} />

//       </div>
//     </div>
//   );
// }







// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import backgroundImage from "../assets/images/9.png";

// // const SYMPTOMES = [
// //   "Douleur dentaire",
// //   "Saignement des gencives",
// //   "Gonflement des gencives",
// //   "Sensibilité au chaud",
// //   "Sensibilité au froid",
// //   "Mauvaise haleine",
// //   "Mobilité dentaire",
// //   "Autre symptôme",
// // ];

// // export default function Question1({
// //   currentStep = 1,
// //   totalSteps = 4,
// // }) {
// //   const navigate = useNavigate();

// //   const [selected, setSelected] = useState([
// //     "Douleur dentaire",
// //     "Sensibilité au froid",
// //   ]);

// //   const progress = Math.round((currentStep / totalSteps) * 100);

// //   function toggleSymptome(symptome) {
// //     setSelected((prev) =>
// //       prev.includes(symptome)
// //         ? prev.filter((s) => s !== symptome)
// //         : [...prev, symptome]
// //     );
// //   }

// //   function handleContinue() {
// //     // Aller vers question2
// //     navigate("/question2");
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
// //       <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

// //         {/* Barre de progression */}
// //         <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
// //           <span>
// //             Étape {currentStep} sur {totalSteps}
// //           </span>
// //           <span>{progress}%</span>
// //         </div>

// //         <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
// //           <div
// //             className="h-1.5 bg-blue-600 rounded-full transition-all"
// //             style={{ width: `${progress}%` }}
// //           />
// //         </div>

// //         <h1 className="text-lg font-semibold text-black">
// //           Quels symptômes décrivez-vous ?
// //         </h1>

// //         <p className="text-sm text-gray-400 mt-1">
// //           Sélectionnez les symptômes que vous ressentez
// //         </p>

// //         <div className="mt-6 space-y-1">
// //           {SYMPTOMES.map((symptome) => {
// //             const checked = selected.includes(symptome);

// //             return (
// //               <label
// //                 key={symptome}
// //                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
// //               >
// //                 <input
// //                   type="checkbox"
// //                   checked={checked}
// //                   onChange={() => toggleSymptome(symptome)}
// //                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
// //                 />

// //                 <span
// //                   className={`text-sm ${
// //                     checked
// //                       ? "text-gray-900 font-medium"
// //                       : "text-gray-600"
// //                   }`}
// //                 >
// //                   {symptome}
// //                 </span>
// //               </label>
// //             );
// //           })}
// //         </div>

// //         {/* Bouton Continuer */}
// //         <button
// //           onClick={handleContinue}
// //           className="w-full mt-8 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
// //         >
// //           Continuer
// //           <span aria-hidden="true">→</span>
// //         </button>

// //       </div>
// //     </div>
// //   );
// // }