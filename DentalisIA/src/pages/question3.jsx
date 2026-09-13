import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Info,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Zap,
} from "lucide-react";

/* ============================================================
   DONNÉES
   ============================================================ */

const DUREES = [
  {
    id: "moins-24h",
    label: "Moins de 24 heures",
    description: "Les symptômes sont apparus récemment.",
    icon: Zap,
  },
  {
    id: "1-3-jours",
    label: "1 à 3 jours",
    description: "Les symptômes sont présents depuis quelques jours.",
    icon: Clock3,
  },
  {
    id: "plus-semaine",
    label: "Plus d'une semaine",
    description: "Les symptômes persistent depuis plusieurs jours.",
    icon: CalendarDays,
  },
  {
    id: "plus-mois",
    label: "Plus d'un mois",
    description: "Le problème évolue depuis plusieurs semaines.",
    icon: CalendarDays,
  },
];

const ANTECEDENTS = [
  {
    id: "carie",
    label: "Carie déjà traitée",
    description: "Une carie a déjà été traitée dans cette zone.",
  },
  {
    id: "devitalisee",
    label: "Dent dévitalisée",
    description: "Une dent de cette zone a déjà été dévitalisée.",
  },
  {
    id: "extraction",
    label: "Extraction récente",
    description: "Une extraction dentaire a récemment été réalisée.",
  },
  {
    id: "orthodontie",
    label: "Traitement orthodontique en cours",
    description: "Vous portez actuellement un appareil ou dispositif orthodontique.",
  },
  {
    id: "douleur-nuit",
    label: "Douleur spontanée très violente",
    description: "Douleur importante, souvent plus forte pendant la nuit.",
  },
  {
    id: "irradiation",
    label: "Douleur irradiée",
    description:
      "La douleur se propage vers l'oreille, la tempe, la mâchoire ou le cou.",
  },
];

/* ============================================================
   COMPOSANT
   ============================================================ */

export default function Question3({
  currentStep = 3,
  totalSteps = 4,
  onContinue,
  onBack,
}) {
  const navigate = useNavigate();

  const [duree, setDuree] = useState("");
  const [intensite, setIntensite] = useState(1);
  const [antecedents, setAntecedents] = useState([]);

  const progress = Math.round(
    (currentStep / totalSteps) * 100
  );

  /* ==========================================================
     SÉLECTION DURÉE
  ========================================================== */

  function selectDuree(lab) {
    setDuree(lab);
  }

  /* ==========================================================
     SÉLECTION INTENSITÉ
  ========================================================== */

  function getIntensityLabel(value) {
    if (value <= 2) return "Très légère";
    if (value <= 4) return "Légère";
    if (value <= 6) return "Modérée";
    if (value <= 8) return "Forte";
    return "Très intense";
  }

  function getIntensityColor(value) {
    if (value <= 2) return "text-emerald-600";
    if (value <= 4) return "text-lime-600";
    if (value <= 6) return "text-amber-600";
    if (value <= 8) return "text-orange-600";
    return "text-red-600";
  }

  /* ==========================================================
     SÉLECTION ANTÉCÉDENTS
  ========================================================== */

  function toggleAntecedent(des) {
    setAntecedents((prev) =>
      prev.includes(des)
        ? prev.filter((item) => item !== des)
        : [...prev, des]
    );
  }

  /* ==========================================================
     CONTINUER
  ========================================================== */

  function handleContinue() {
    const temp = `Depuis quand ressentez-vous ces symptômes ? ${duree}`
    const dou = `Comment évaluez-vous la douleur sur l'echelle de 1 a 10 ? ${intensite}`
    const doulabel = `La douleur est ${getIntensityLabel(intensite)}`
    const ante = `Avez-vous des antécédents dentaires ? ${antecedents}`
    const data = {
      temp,
      dou,
      doulabel,
      ante,
    };
console.log("duree: ", data)
    sessionStorage.setItem(
      "dentalis_question3",
      JSON.stringify(data)
    );

    if (onContinue) {
      onContinue(data);
      return;
    }

    navigate("/question4", { replace: true });
  }

  /* ==========================================================
     RETOUR
  ========================================================== */

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    navigate("/question2");
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const canContinue = duree !== "";

  const totalResponses =
    (duree ? 1 : 0) +
    antecedents.length +
    (intensite ? 1 : 0);

  const responseText = useMemo(() => {
    if (totalResponses <= 1) {
      return "1 information renseignée";
    }

    return `${totalResponses} informations renseignées`;
  }, [totalResponses]);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-900">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-[72px] flex items-center justify-between gap-4">

            {/* Retour */}

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
          MAIN
      ====================================================== */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">

          <span>Analyse</span>

          <ChevronRight
            size={12}
            className="text-slate-300"
          />

          <span>Douleur</span>

          <ChevronRight
            size={12}
            className="text-slate-300"
          />

          <span className="text-blue-600">
            Évolution
          </span>

        </div>

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="mt-5 bg-slate-950 rounded-3xl overflow-hidden relative shadow-xl shadow-slate-900/10">

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
                  Comprenons l'évolution de vos symptômes
                </h1>

                <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
                  Précisez depuis combien de temps vous
                  ressentez ces symptômes, leur intensité et
                  vos éventuels antécédents dentaires.
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
            LAYOUT
        ==================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">

          {/* ==================================================
              FORMULAIRE
          ================================================== */}

          <section className="bg-white border border-slate-200/70 rounded-3xl shadow-sm overflow-hidden">

            {/* =================================================
                QUESTION 1 — DURÉE
            ================================================= */}

            <div className="p-6 sm:p-7 border-b border-slate-100">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                  <Clock3
                    size={22}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Question 01
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Depuis quand ressentez-vous ces symptômes ?
                  </h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Sélectionnez la période qui correspond
                    le mieux à votre situation.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-4 sm:p-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {DUREES.map((item) => {

                  const selected = duree === item.label;
                  const Icon = item.icon;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => selectDuree(item.label)}
                      aria-pressed={selected}
                      className={`
                        group relative w-full text-left
                        p-4
                        rounded-2xl
                        border
                        transition-all duration-200
                        ${
                          selected
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
                            selected
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-slate-200 group-hover:border-blue-300"
                          }
                        `}
                      >

                        {selected && (
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
                            selected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                          }
                        `}
                      >

                        <Icon size={18} />

                      </div>

                      <div className="mt-4 pr-7">

                        <p
                          className={`
                            text-sm font-bold
                            ${
                              selected
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
                              selected
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

            {/* =================================================
                QUESTION 2 — INTENSITÉ
            ================================================= */}

            <div className="border-t border-slate-100">

              <div className="p-6 sm:p-7">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">

                    <Activity
                      size={22}
                      className="text-indigo-600"
                    />

                  </div>

                  <div className="flex-1">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Question 02
                    </p>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Comment évaluez-vous la douleur ?
                    </h2>

                    <p className="text-sm text-slate-400 mt-2">
                      1 correspond à une douleur très légère,
                      10 à une douleur insupportable.
                    </p>

                  </div>

                </div>

                {/* Score */}

                <div className="mt-7 rounded-3xl bg-slate-50 border border-slate-100 p-5 sm:p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Niveau actuel
                      </p>

                      <p
                        className={`text-lg font-bold mt-1 ${getIntensityColor(
                          intensite
                        )}`}
                      >
                        {getIntensityLabel(intensite)}
                      </p>

                    </div>

                    <div className="flex items-end gap-1">

                      <span
                        className={`text-5xl font-bold leading-none ${getIntensityColor(
                          intensite
                        )}`}
                      >
                        {intensite}
                      </span>

                      <span className="text-sm text-slate-400 mb-1">
                        / 10
                      </span>

                    </div>

                  </div>

                  {/* Slider */}

                  <div className="mt-7">

                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensite}
                      onChange={(e) =>
                        setIntensite(
                          Number(e.target.value)
                        )
                      }
                      aria-label="Intensité de la douleur"
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />

                    <div className="flex items-center justify-between mt-3">

                      <div className="text-center">

                        <span className="block text-xs font-bold text-emerald-600">
                          1
                        </span>

                        <span className="text-[9px] text-slate-400">
                          Très légère
                        </span>

                      </div>

                      <div className="text-center">

                        <span className="block text-xs font-bold text-amber-600">
                          5
                        </span>

                        <span className="text-[9px] text-slate-400">
                          Modérée
                        </span>

                      </div>

                      <div className="text-center">

                        <span className="block text-xs font-bold text-red-600">
                          10
                        </span>

                        <span className="text-[9px] text-slate-400">
                          Insupportable
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                QUESTION 3 — ANTÉCÉDENTS
            ================================================= */}

            <div className="border-t border-slate-100">

              <div className="p-6 sm:p-7">

                <div className="flex items-start gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">

                    <Stethoscope
                      size={22}
                      className="text-emerald-600"
                    />

                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Question 03
                    </p>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      Avez-vous des antécédents dentaires ?
                    </h2>

                    <p className="text-sm text-slate-400 mt-2">
                      Sélectionnez toutes les situations qui
                      correspondent à votre historique.
                    </p>

                  </div>

                </div>

              </div>

              <div className="px-4 sm:px-6 pb-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {ANTECEDENTS.map((item) => {

                    const checked =
                      antecedents.includes(item.description);

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          toggleAntecedent(item.description)
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
                              ? "border-emerald-500 bg-emerald-50/60 shadow-sm shadow-emerald-500/10"
                              : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50"
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
                            ${
                              checked
                                ? "bg-emerald-600 border-emerald-600"
                                : "bg-white border-slate-200 group-hover:border-emerald-300"
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

                        <div className="pr-8">

                          <p
                            className={`
                              text-sm font-bold
                              ${
                                checked
                                  ? "text-emerald-900"
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
                                  ? "text-emerald-700/70"
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

            </div>

            {/* =================================================
                FOOTER FORMULAIRE
            ================================================= */}

            <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-sm font-bold text-slate-700">
                    {responseText}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1">
                    La durée des symptômes est requise pour
                    continuer.
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
                    Votre progression
                  </p>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Informations renseignées
                  </p>

                </div>

              </div>

              <div className="mt-5 flex items-end gap-2">

                <span className="text-4xl font-bold text-slate-900">
                  {totalResponses}
                </span>

                <span className="text-xs text-slate-400 mb-1">
                  information
                  {totalResponses > 1 ? "s" : ""}
                </span>

              </div>

              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (totalResponses / 8) * 100,
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

            {/* Intensité */}

            <div className="bg-white border border-slate-200/70 rounded-3xl shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Intensité
                  </p>

                  <p
                    className={`text-lg font-bold mt-1 ${getIntensityColor(
                      intensite
                    )}`}
                  >
                    {getIntensityLabel(intensite)}
                  </p>

                </div>

                <div className="flex items-center gap-1">

                  <Star
                    size={16}
                    className={getIntensityColor(
                      intensite
                    )}
                  />

                  <span className="text-2xl font-bold text-slate-900">
                    {intensite}
                  </span>

                  <span className="text-xs text-slate-400">
                    /10
                  </span>

                </div>

              </div>

            </div>

            {/* Conseil IA */}

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
                  La durée et l'intensité des symptômes
                  permettent de mieux comprendre leur
                  évolution.
                </p>

              </div>

            </div>

            {/* Information */}

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
                    Pourquoi ces informations ?
                  </p>

                  <p className="text-[11px] leading-relaxed text-slate-400 mt-1.5">
                    Ces réponses permettent de contextualiser
                    les symptômes et d'améliorer l'orientation
                    proposée par Dentalis IA.
                  </p>

                </div>

              </div>

            </div>

            {/* Avertissement */}

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
                    Dentalis IA fournit une aide à
                    l'orientation. Cette analyse ne remplace
                    pas l'avis d'un professionnel dentaire.
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
// import { useNavigate } from "react-router-dom";
// import backgroundImage from "../assets/images/8.jpg";
// import Button from "../components/Button";

// const DUREES = [
//   "Moins de 24 heures",
//   "1 à 3 jours",
//   "Plus d'une semaine",
//   "Plus d'un mois",
// ];

// const ANTECEDENTS = [
//   "Carie déjà traitée",
//   "Dent dévitalisée",
//   "Extraction récente",
//   "Traitement orthodontique en cours",
//   "Douleur spontanée très violente souvent pire la nuit",
//   "Douleur qui irradie vers l'oreille, la tempe,la machoirr entiere ou le cou",
// ];

// export default function Question3({
//   currentStep = 3,
//   totalSteps = 4,
//   onContinue,
//   onBack,
// }) {
//  const navigate = useNavigate();

// function handleContinue() {
//   navigate("/question4");
// }

      

//   const [duree, setDuree] = useState("");
//   const [intensite, setIntensite] = useState(1);
//   const [antecedents, setAntecedents] = useState([]);

//   const progress = Math.round((currentStep / totalSteps) * 100);

//   function toggleAntecedent(item) {
//     setAntecedents((prev) => {
//       if (item === "Aucun antécédent") {
//         return prev.includes(item) ? [] : [item];
//       }

//       const withoutNone = prev.filter(
//         (s) => s !== "Aucun antécédent"
//       );

//       return withoutNone.includes(item)
//         ? withoutNone.filter((s) => s !== item)
//         : [...withoutNone, item];
//     });
//   }

//   function handleContinue() {
//     // Aller vers question4
//     navigate("/question4");
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

//         {/* Question 1 : depuis quand */}
//         <h1 className="text-lg font-semibold text-black">
//           Depuis quand ressentez-vous ces symptômes ?
//         </h1>

//         <p className="text-sm text-gray-400 mt-1">
//           Sélectionnez une réponse
//         </p>

//         <div className="mt-4 space-y-1">
//           {DUREES.map((item) => {
//             const selected = duree === item;

//             return (
//               <label
//                 key={item}
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
//               >
//                 <input
//                   type="radio"
//                   name="duree"
//                   checked={selected}
//                   onChange={() => setDuree(item)}
//                   className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />

//                 <span
//                   className={`text-sm ${
//                     selected
//                       ? "text-gray-900 font-medium"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   {item}
//                 </span>
//               </label>
//             );
//           })}
//         </div>

//         {/* Question 2 : intensité de la douleur */}
//         <h2 className="text-lg font-semibold text-black mt-8">
//           Comment évaluez-vous la douleur ?
//         </h2>

//         <p className="text-sm text-gray-400 mt-1">
//           1 = très légère, 10 = insupportable
//         </p>

//         <div className="mt-4">
//           <input
//             type="range"
//             min="1"
//             max="10"
//             value={intensite}
//             onChange={(e) =>
//               setIntensite(Number(e.target.value))
//             }
//             className="w-full accent-blue-600"
//           />

//           <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
//             <span>1</span>

//             <span className="text-blue-600 font-semibold text-sm">
//               {intensite}
//             </span>

//             <span>10</span>
//           </div>
//         </div>

//         {/* Question 3 : antécédents */}
//         <h2 className="text-lg font-semibold text-black mt-8">
//           Avez-vous des antécédents dentaires liés à cette zone ?
//         </h2>

//         <p className="text-sm text-gray-400 mt-1">
//           Sélectionnez tout ce qui s'applique
//         </p>

//         <div className="mt-4 space-y-1">
//           {ANTECEDENTS.map((item) => {
//             const checked = antecedents.includes(item);

//             return (
//               <label
//                 key={item}
//                 className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
//               >
//                 <input
//                   type="checkbox"
//                   checked={checked}
//                   onChange={() => toggleAntecedent(item)}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />

//                 <span
//                   className={`text-sm ${
//                     checked
//                       ? "text-gray-900 font-medium"
//                       : "text-gray-600"
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