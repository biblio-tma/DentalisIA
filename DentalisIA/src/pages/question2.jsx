import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Droplets,
  Flame,
  HeartPulse,
  Info,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Wind,
} from "lucide-react";

/* ============================================================
   DONNÉES
   ============================================================ */

const DECLENCHEURS = [
  {
    id: "froid",
    label: "Aliments froids",
    description: "La douleur apparaît avec les boissons ou aliments froids.",
    icon: Thermometer,
  },
  {
    id: "chaud",
    label: "Aliments chauds",
    description: "Une sensation douloureuse survient avec le chaud.",
    icon: Flame,
  },
  {
    id: "sucre",
    label: "Aliments sucrés",
    description: "Une gêne ou douleur apparaît avec le sucre.",
    icon: HeartPulse,
  },
  {
    id: "mastication",
    label: "Mastication",
    description: "La douleur apparaît lorsque vous mâchez.",
    icon: Activity,
  },
  {
    id: "pression",
    label: "Pression sur la dent",
    description: "Une pression directe déclenche une douleur.",
    icon: AlertCircle,
  },
  {
    id: "respiration",
    label: "Respiration",
    description: "Un inconfort apparaît lors de la respiration.",
    icon: Wind,
  },
  {
    id: "espaces",
    label: "Espaces noirs entre les dents",
    description: "Vous remarquez des espaces ou zones sombres.",
    icon: CircleHelp,
  },
  {
    id: "racines",
    label: "Racines des dents visibles",
    description: "Les gencives semblent découvrir les racines.",
    icon: Droplets,
  },
];

const TYPES_DOULEUR = [
  {
    id: "continue",
    label: "Continue",
    description: "La douleur est présente de manière permanente.",
  },
  {
    id: "intermittente",
    label: "Intermittente",
    description: "La douleur apparaît puis disparaît.",
  },
  {
    id: "stimulus",
    label: "Déclenchée par un stimulus",
    description: "Elle apparaît après un contact ou un stimulus précis.",
  },
];

/* ============================================================
   COMPOSANT
   ============================================================ */

export default function QuestionnaireStep2({
  currentStep = 2,
  totalSteps = 4,
  onContinue,
  onBack,
}) {
  const navigate = useNavigate();

  const [declencheurs, setDeclencheurs] = useState([]);
  const [typeDouleur, setTypeDouleur] = useState([]);

  const progress = Math.round(
    (currentStep / totalSteps) * 100
  );

  /* ----------------------------------------------------------
     Sélection déclencheurs
  ---------------------------------------------------------- */

  function toggleDeclencheur(des) {
    setDeclencheurs((prev) =>
      prev.includes(des)
        ? prev.filter((item) => item !== des)
        : [...prev, des]
    );
  }

  /* ----------------------------------------------------------
     Sélection type douleur
  ---------------------------------------------------------- */

  function toggleTypeDouleur(des) {
    setTypeDouleur((prev) =>
      prev.includes(des)
        ? prev.filter((item) => item !== des)
        : [...prev, des]
    );
  }

  /* ----------------------------------------------------------
     Continuer
  ---------------------------------------------------------- */

  function handleContinue() {
    const declen = `Quand la douleur apparaît-elle ? ${declencheurs}`
    const type = `Comment décririez-vous la douleur ? ${typeDouleur}`
    const data = {
      declen,
      type,
    };
console.log("etape 2:", data)
    sessionStorage.setItem(
      "dentalis_question2",
      JSON.stringify(data)
    );

    if (onContinue) {
      onContinue(data);
      return;
    }

    navigate("/question3", { replace: true });
  }

  /* ----------------------------------------------------------
     Retour
  ---------------------------------------------------------- */

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    navigate("/question1");
  }

  const totalSelections =
    declencheurs.length + typeDouleur.length;

  const canContinue =
    declencheurs.length > 0 || typeDouleur.length > 0;

  const selectionText = useMemo(() => {
    if (totalSelections === 0) {
      return "Aucune réponse sélectionnée";
    }

    if (totalSelections === 1) {
      return "1 réponse sélectionnée";
    }

    return `${totalSelections} réponses sélectionnées`;
  }, [totalSelections]);

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-900">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-[72px] flex items-center justify-between gap-4">

            {/* Retour + identité */}
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

      {/* ======================================================
          CONTENU
      ====================================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">

          <span>Analyse</span>

          <ChevronRight
            size={12}
            className="text-slate-300"
          />

          <span className="text-slate-400">
            Symptômes
          </span>

          <ChevronRight
            size={12}
            className="text-slate-300"
          />

          <span className="text-blue-600">
            Douleur
          </span>

        </div>

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="mt-5 bg-slate-950 rounded-3xl overflow-hidden relative shadow-xl shadow-slate-900/10">

          {/* Décorations */}

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
                  Précisons votre douleur
                </h1>

                <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
                  Indiquez ce qui déclenche votre douleur
                  et décrivez sa nature. Ces informations
                  permettront d'affiner votre analyse.
                </p>

              </div>

              {/* Progression */}

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

                <div className="grid grid-cols-4 gap-2 mt-4">

                  {Array.from({
                    length: totalSteps,
                  }).map((_, index) => {

                    const step = index + 1;

                    return (
                      <div
                        key={step}
                        className={`h-1 rounded-full ${
                          step <= currentStep
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

        {/* ====================================================
            LAYOUT PRINCIPAL
        ==================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">

          {/* ==================================================
              FORMULAIRE
          ================================================== */}

          <section className="bg-white border border-slate-200/70 rounded-3xl shadow-sm overflow-hidden">

            {/* ------------------------------------------------
                QUESTION 1
            ------------------------------------------------ */}

            <div className="p-6 sm:p-7 border-b border-slate-100">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                  <Activity
                    size={22}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Question 01
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Quand la douleur apparaît-elle ?
                  </h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Sélectionnez toutes les situations qui
                    correspondent à votre expérience.
                  </p>

                </div>

              </div>

            </div>

            {/* Déclencheurs */}

            <div className="p-4 sm:p-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {DECLENCHEURS.map((item) => {

                  const checked =
                    declencheurs.includes(item.description);

                  const Icon = item.icon;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        toggleDeclencheur(item.description)
                      }
                      aria-pressed={checked}
                      className={`
                        group relative w-full text-left
                        p-4
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

                      {/* Icône */}

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

                      <div className="mt-4 pr-8">

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
                          {item.label}
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
                          {item.description}
                        </p>

                      </div>

                    </button>
                  );
                })}

              </div>
            </div>

            {/* ------------------------------------------------
                QUESTION 2
            ------------------------------------------------ */}

            <div className="border-t border-slate-100">

              <div className="p-6 sm:p-7">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">

                    <HeartPulse
                      size={22}
                      className="text-indigo-600"
                    />

                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Question 02
                    </p>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Comment décririez-vous la douleur ?
                    </h2>

                    <p className="text-sm text-slate-400 mt-2">
                      Sélectionnez la ou les descriptions
                      qui correspondent le mieux.
                    </p>

                  </div>

                </div>

              </div>

              <div className="px-4 sm:px-6 pb-6">

                <div className="grid grid-cols-1 gap-3">

                  {TYPES_DOULEUR.map((item) => {

                    const checked =
                      typeDouleur.includes(item.description);

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          toggleTypeDouleur(item.description)
                        }
                        aria-pressed={checked}
                        className={`
                          group relative w-full text-left
                          p-4
                          rounded-2xl
                          border
                          flex items-center gap-4
                          transition-all duration-200
                          ${
                            checked
                              ? "border-indigo-500 bg-indigo-50/60 shadow-sm shadow-indigo-500/10"
                              : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                          }
                        `}
                      >

                        {/* Radio visuel */}

                        <div
                          className={`
                            w-11 h-11 rounded-xl
                            flex-shrink-0
                            flex items-center justify-center
                            transition
                            ${
                              checked
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                            }
                          `}
                        >

                          {checked ? (
                            <Check
                              size={18}
                              strokeWidth={3}
                            />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-current" />
                          )}

                        </div>

                        <div className="flex-1 pr-7">

                          <p
                            className={`
                              text-sm font-bold
                              ${
                                checked
                                  ? "text-indigo-900"
                                  : "text-slate-800"
                              }
                            `}
                          >
                            {item.label}
                          </p>

                          <p
                            className={`
                              text-[11px] leading-relaxed mt-1
                              ${
                                checked
                                  ? "text-indigo-700/70"
                                  : "text-slate-400"
                              }
                            `}
                          >
                            {item.description}
                          </p>

                        </div>

                        {/* Check droit */}

                        <div
                          className={`
                            absolute right-4 top-1/2 -translate-y-1/2
                            w-5 h-5 rounded-full border
                            flex items-center justify-center
                            ${
                              checked
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-slate-200"
                            }
                          `}
                        >

                          {checked && (
                            <Check
                              size={11}
                              strokeWidth={3}
                              className="text-white"
                            />
                          )}

                        </div>

                      </button>
                    );
                  })}

                </div>

              </div>
            </div>

            {/* =================================================
                FOOTER FORMULAIRE
            ================================================= */}

            <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-sm font-bold text-slate-700">
                    {selectionText}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Vos réponses seront utilisées pour
                    affiner votre analyse.
                  </p>

                </div>

                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-12 px-5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Retour
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className={`
                      h-12 px-6 rounded-xl
                      flex items-center justify-center gap-2
                      text-sm font-bold
                      transition-all duration-200
                      ${
                        canContinue
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
            </div>

          </section>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="space-y-4">

            {/* ------------------------------------------------
                RÉSUMÉ
            ------------------------------------------------ */}

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
                    Votre progression
                  </p>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Réponses renseignées
                  </p>

                </div>

              </div>

              <div className="mt-5 flex items-end gap-2">

                <span className="text-4xl font-bold text-slate-900">
                  {totalSelections}
                </span>

                <span className="text-xs text-slate-400 mb-1">
                  réponse
                  {totalSelections > 1 ? "s" : ""}
                </span>

              </div>

              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (totalSelections /
                        (DECLENCHEURS.length +
                          TYPES_DOULEUR.length)) *
                        100,
                      100
                    )}%`,
                  }}
                />

              </div>

              <div className="flex justify-between mt-2">

                <span className="text-[10px] text-slate-400">
                  Étape {currentStep}
                </span>

                <span className="text-[10px] font-bold text-blue-600">
                  {progress}%
                </span>

              </div>

            </div>

            {/* ------------------------------------------------
                CONSEIL IA
            ------------------------------------------------ */}

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
                  Une description précise de votre douleur
                  permet de mieux contextualiser votre
                  situation lors des prochaines étapes.
                </p>

              </div>

            </div>

            {/* ------------------------------------------------
                INFORMATIONS
            ------------------------------------------------ */}

            <div className="rounded-3xl bg-white border border-slate-200/70 p-5">

              <div className="flex gap-3">

                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">

                  <Info
                    size={16}
                    className="text-slate-500"
                  />

                </div>

                <div>

                  <p className="text-xs font-bold text-slate-800">
                    Pourquoi ces questions ?
                  </p>

                  <p className="text-[11px] leading-relaxed text-slate-400 mt-1.5">
                    Les déclencheurs et la nature de la
                    douleur sont des informations utiles
                    pour caractériser votre situation.
                  </p>

                </div>

              </div>

            </div>

            {/* ------------------------------------------------
                AVERTISSEMENT
            ------------------------------------------------ */}

            <div className="rounded-3xl bg-amber-50 border border-amber-100 p-5">

              <div className="flex gap-3">

                <AlertCircle
                  size={18}
                  className="text-amber-600 flex-shrink-0 mt-0.5"
                />

                <div>

                  <p className="text-xs font-bold text-amber-800">
                    À savoir
                  </p>

                  <p className="text-[11px] leading-relaxed text-amber-700/80 mt-1.5">
                    Cette analyse constitue une aide à
                    l'orientation et ne remplace pas un
                    diagnostic réalisé par un professionnel
                    dentaire.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* ====================================================
            FOOTER SÉCURITÉ
        ==================================================== */}

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
// import { Link, useNavigate } from "react-router-dom";
// import backgroundImage from "../assets/images/3.jpg";
// import Button from "../components/Button";

// const DECLENCHEURS = [
//   "Aliments froids",
//   "Aliments chauds",
//   "Aliments sucrés",
//   "Mastication",
//   "Pression sur la dent",
//   "inconfort lors de lq respiration",
//   "Apparition des espaces noirs entre les dents",
//   "Gencives qui decouvrent les racines des dents",
// ];

// const TYPES_DOULEUR = [
//   "Continue (présence permanente)",
//   "Intermittente (va et vient)",
//   "Déclenchée par un stimulus",
// ];

// export default function QuestionnaireStep2({
//   currentStep = 2,
//   totalSteps = 4,
//   onContinue,
//   onBack,
// }) {
//   const [declencheurs, setDeclencheurs] = useState([]);
//   const [typeDouleur, setTypeDouleur] = useState([]);

//   const progress = Math.round((currentStep / totalSteps) * 100);

//   const navigate = useNavigate();

//   function toggleDeclencheur(item) {
//     setDeclencheurs((prev) =>
//       prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
//     );
//   }

//   function toggleTypeDouleur(item) {
//     setTypeDouleur((prev) =>
//       prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
//     );
//   }

//   function handleContinue() {
//     navigate("/question3");
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8"
//       style={{
//         backgroundImage: `url(${backgroundImage})`,
//       }}
//     >
//       <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8">

//         {/* Barre de progression */}
//         <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
//           <span>
//             Étape {currentStep} sur {totalSteps}
//           </span>

//           <span>{progress}%</span>
//         </div>

//         <div className="w-full h-1.5 bg-gray-100/80 rounded-full mb-6">
//           <div
//             className="h-1.5 bg-blue-600 rounded-full transition-all"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         {/* Question 1 : déclencheurs de la douleur */}
//         <h1 className="text-lg font-semibold text-black">
//           Quand la douleur apparaît-elle ?
//         </h1>

//         <p className="text-sm text-gray-400 mt-1">
//           Sélectionnez tout ce qui s'applique
//         </p>

//         <div className="mt-4 space-y-1">
//           {DECLENCHEURS.map((item) => {
//             const checked = declencheurs.includes(item);

//             return (
//               <label
//                 key={item}
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
//               >
//                 <input
//                   type="checkbox"
//                   checked={checked}
//                   onChange={() => toggleDeclencheur(item)}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />

//                 <span
//                   className={`text-sm ${
//                     checked ? "text-gray-900 font-medium" : "text-gray-600"
//                   }`}
//                 >
//                   {item}
//                 </span>
//               </label>
//             );
//           })}
//         </div>

//         {/* Question 2 : nature de la douleur */}
//         <h2 className="text-lg font-semibold text-black mt-8">
//           Comment décririez-vous la douleur ?
//         </h2>

//         <p className="text-sm text-gray-400 mt-1">
//           Sélectionnez tout ce qui s'applique
//         </p>

//         <div className="mt-4 space-y-1">
//           {TYPES_DOULEUR.map((item) => {
//             const checked = typeDouleur.includes(item);

//             return (
//               <label
//                 key={item}
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
//               >
//                 <input
//                   type="checkbox"
//                   checked={checked}
//                   onChange={() => toggleTypeDouleur(item)}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />

//                 <span
//                   className={`text-sm ${
//                     checked ? "text-gray-900 font-medium" : "text-gray-600"
//                   }`}
//                 >
//                   {item}
//                 </span>
//               </label>
//             );
//           })}
//         </div>

//         {/* Boutons */}
//         <div className="flex gap-3 mt-8">
//           {onBack && (
//             <button
//               type="button"
//               onClick={onBack}
//               className="flex-1 border border-gray-200 bg-white/60 text-gray-700 font-medium py-3 rounded-lg hover:bg-white/80 transition-colors"
//             >
//               Retour
//             </button>
//           )}

//           <Button onClick={handleContinue} />
//         </div>

//       </div>
//     </div>
//   );
// }