
import React, { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useAnalyse } from "../hooks/AnalyseContext";
import {
  Download,
  FileText,
  ShieldCheck,
  CalendarDays,
  ChevronRight,
  MapPin,
  Sparkles,
  AlertTriangle,
  Clock,
  Stethoscope,
  HeartPulse,
  ShieldPlus,
  CheckCircle2,
  Info,
  Activity,
  Camera,
  X,
  User,
} from "lucide-react";

import RapportDentalisPDF from "./RapportDentalisPDF";

/* -------------------------------------------------------------------------- */
/* UTILITAIRES                                                                */
/* -------------------------------------------------------------------------- */

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const containsAny = (responses, keywords) => {
  const text = responses
    .map((item) => normalizeText(item))
    .join(" ");

  return keywords.some((keyword) =>
    text.includes(normalizeText(keyword))
  );
};

/* -------------------------------------------------------------------------- */
/* ANALYSE D'ORIENTATION                                                      */
/* -------------------------------------------------------------------------- */

const generateDentalAnalysis = (sections) => {
  const allResponses = [
    ...sections.symptomes,
    ...sections.douleur,
    ...sections.evolution,
    ...sections.informations,
  ];

  /*
   * IMPORTANT :
   * Cette fonction produit une ORIENTATION et non un diagnostic médical.
   * Pour une version production, ces règles devraient idéalement être
   * remplacées par une API backend / moteur clinique validé.
   */

  const severeEmergency = containsAny(allResponses, [
    "difficulte a respirer",
    "difficulte respirer",
    "difficulte a avaler",
    "difficulte avaler",
    "difficulte a parler",
    "gonflement du cou",
    "cou gonfle",
    "oeil gonfle",
    "œil gonfle",
    "gonflement important",
    "gonflement tres important",
  ]);

  const infectionSigns = containsAny(allResponses, [
    "abcès",
    "abces",
    "pus",
    "gonfle",
    "gonflement",
    "fievre",
    "fièvre",
    "mauvais gout",
    "mauvais goût",
    "douleur intense",
    "douleur tres forte",
  ]);

  const inflammatorySigns = containsAny(allResponses, [
    "douleur",
    "sensible",
    "sensibilite",
    "sensibilité",
    "gencive rouge",
    "gencives rouges",
    "inflammation",
    "saignement",
  ]);

  const cariesSigns = containsAny(allResponses, [
    "carie",
    "dent trouee",
    "dent trouée",
    "trou dans la dent",
    "douleur au sucre",
    "douleur au froid",
    "douleur au chaud",
  ]);

  const gumSigns = containsAny(allResponses, [
    "gencive",
    "gencives",
    "saignement",
    "saigne",
    "mauvaise haleine",
    "haleine",
  ]);

  /* --------------------------- URGENCE ----------------------------------- */

  if (severeEmergency) {
    return {
      diagnostic:
        "Situation potentiellement urgente nécessitant une évaluation médicale rapide",

      niveauUrgence: "Urgence immédiate",

      urgenceColor: "red",

      urgenceDescription:
        "Certains éléments renseignés peuvent être compatibles avec une situation nécessitant une prise en charge urgente, notamment en présence d'une difficulté respiratoire, de déglutition ou d'un gonflement important.",

      description:
        "Les réponses présentent des signes d'alerte qui ne permettent pas à Dentalis IA d'établir un diagnostic, mais qui justifient une évaluation professionnelle sans délai.",

      traitement:
        [
          "Ne pas attendre une amélioration spontanée si les signes d'alerte sont présents.",
          "Contacter immédiatement un service médical d'urgence ou se rendre dans l'établissement de soins approprié.",
          "Éviter l'automédication antibiotique.",
          "Apporter au professionnel la liste des médicaments et traitements déjà pris.",
        ],

      prevention: [
        "Ne pas négliger une douleur ou une infection dentaire qui s'aggrave.",
        "Consulter rapidement lorsqu'un gonflement apparaît ou progresse.",
        "Maintenir une bonne hygiène bucco-dentaire.",
      ],

      recommandation:
        "Une évaluation professionnelle immédiate est recommandée compte tenu des signes d'alerte détectés.",
    };
  }

  if (infectionSigns) {
    return {
      diagnostic:
        "Suspicion d'infection ou d'inflammation dentaire",

      niveauUrgence: "Urgente",

      urgenceColor: "orange",

      urgenceDescription:
        "Les réponses contiennent plusieurs éléments pouvant être associés à une infection ou à une inflammation dentaire nécessitant une évaluation clinique.",

      description:
        "Une douleur associée à un gonflement, de la fièvre, un mauvais goût ou du pus peut être compatible avec une infection dentaire. Une consultation dentaire rapide est recommandée.",

      traitement: [
        "Prendre rendez-vous rapidement avec un chirurgien-dentiste pour identifier la cause.",
        "Le traitement définitif dépendra de l'examen clinique et, si nécessaire, d'examens complémentaires.",
        "Une mesure antalgique adaptée peut être envisagée selon l'âge, les contre-indications et les traitements habituels.",
        "Ne pas commencer d'antibiotiques sans avis d'un professionnel de santé.",
      ],

      prevention: [
        "Brossage des dents deux fois par jour avec un dentifrice fluoré.",
        "Nettoyage interdentaire régulier.",
        "Limiter les consommations fréquentes de sucres.",
        "Consulter rapidement en cas de douleur persistante ou de gonflement.",
      ],

      recommandation:
        "Une consultation dentaire rapide est recommandée afin d'identifier et traiter la cause de l'inflammation ou de l'infection.",
    };
  }

  if (cariesSigns) {
    return {
      diagnostic:
        "Suspicion de carie dentaire ou d'atteinte de la structure dentaire",

      niveauUrgence: "Modérée",

      urgenceColor: "yellow",

      urgenceDescription:
        "Les réponses peuvent être compatibles avec une atteinte dentaire nécessitant une consultation, sans signe d'urgence majeure identifié dans le questionnaire.",

      description:
        "La sensibilité au chaud, au froid ou au sucre, ainsi que la présence d'une cavité ou d'une douleur localisée, peuvent être associées à une carie ou à une atteinte de la dent.",

      traitement: [
        "Faire examiner la dent par un chirurgien-dentiste.",
        "Le professionnel pourra déterminer si une restauration, un traitement pulpaire ou une autre prise en charge est nécessaire.",
        "Éviter les aliments très sucrés ou les températures extrêmes si ceux-ci déclenchent la douleur.",
        "Ne pas essayer de retirer ou traiter soi-même une lésion dentaire.",
      ],

      prevention: [
        "Brosser les dents matin et soir avec un dentifrice fluoré.",
        "Réduire la fréquence des prises alimentaires sucrées.",
        "Nettoyer régulièrement les espaces interdentaires.",
        "Effectuer des contrôles dentaires réguliers.",
      ],

      recommandation:
        "Une consultation dentaire est recommandée afin de confirmer l'origine des symptômes et d'éviter leur aggravation.",
    };
  }

  if (gumSigns) {
    return {
      diagnostic:
        "Suspicion d'inflammation gingivale",

      niveauUrgence: "Modérée",

      urgenceColor: "yellow",

      urgenceDescription:
        "Les réponses évoquent principalement des signes touchant les gencives et justifient un contrôle dentaire.",

      description:
        "Les saignements, rougeurs, sensibilité ou mauvaise haleine peuvent être associés à une inflammation gingivale. Un examen clinique permet de rechercher la cause et d'évaluer l'état des tissus gingivaux.",

      traitement: [
        "Prévoir un contrôle chez un chirurgien-dentiste.",
        "Maintenir un brossage doux mais régulier.",
        "Nettoyer les espaces interdentaires.",
        "Une prise en charge professionnelle pourra être proposée selon l'état des gencives.",
      ],

      prevention: [
        "Brossage deux fois par jour.",
        "Utilisation régulière d'un moyen de nettoyage interdentaire.",
        "Limiter le tabac.",
        "Effectuer des contrôles dentaires réguliers.",
      ],

      recommandation:
        "Une consultation dentaire est conseillée pour évaluer l'état des gencives et prévenir l'évolution vers une maladie parodontale.",
    };
  }

  if (inflammatorySigns) {
    return {
      diagnostic:
        "Suspicion de problème dentaire inflammatoire",

      niveauUrgence: "Modérée",

      urgenceColor: "yellow",

      urgenceDescription:
        "Les symptômes rapportés nécessitent une surveillance et peuvent justifier une consultation dentaire.",

      description:
        "Les informations fournies suggèrent une irritation ou une inflammation possible. Le questionnaire seul ne permet cependant pas d'en déterminer précisément la cause.",

      traitement: [
        "Surveiller l'évolution des symptômes.",
        "Maintenir une hygiène bucco-dentaire douce et régulière.",
        "Prendre rendez-vous chez un chirurgien-dentiste si les symptômes persistent ou s'aggravent.",
        "Demander conseil à un professionnel de santé avant toute prise médicamenteuse.",
      ],

      prevention: [
        "Brossage régulier avec un dentifrice fluoré.",
        "Nettoyage interdentaire.",
        "Limiter les aliments et boissons très sucrés.",
        "Ne pas attendre plusieurs jours si une douleur devient persistante.",
      ],

      recommandation:
        "Une consultation dentaire est conseillée si les symptômes persistent, s'intensifient ou réapparaissent.",
    };
  }

  return {
    diagnostic:
      "Aucune orientation dentaire spécifique identifiable à partir du questionnaire",

    niveauUrgence: "Faible",

    urgenceColor: "green",

    urgenceDescription:
      "Aucun signe d'alerte majeur n'a été identifié dans les réponses enregistrées.",

    description:
      "Les informations renseignées ne permettent pas d'identifier une pathologie dentaire précise. Une consultation reste recommandée en cas de symptômes persistants.",

    traitement: [
      "Maintenir une bonne hygiène bucco-dentaire.",
      "Surveiller l'évolution des symptômes.",
      "Consulter un chirurgien-dentiste en cas de douleur persistante ou d'apparition de nouveaux symptômes.",
    ],

    prevention: [
      "Brosser les dents deux fois par jour avec un dentifrice fluoré.",
      "Nettoyer les espaces interdentaires.",
      "Limiter la consommation fréquente de sucres.",
      "Effectuer des contrôles dentaires réguliers.",
    ],

    recommandation:
      "Aucun signe d'urgence majeure n'a été identifié, mais un contrôle dentaire est recommandé si les symptômes persistent ou réapparaissent.",
  };
};

/* -------------------------------------------------------------------------- */
/* CONFIGURATION UI                                                           */
/* -------------------------------------------------------------------------- */

const urgencyConfig = {
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },

  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },

  yellow: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },

  green: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function Rapport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    profil: patient,
  } = useAnalyse();
  // const section = searchParams.get("sec");
  const location = useLocation();
  
  const section = location.state?.section || null;
  const analyseIA = location.state?.analyse || null;
  const [sections, setSections] = useState({
    symptomes: [],
    douleur: [],
    evolution: [],
    informations: [],
  });

  const [reportId] = useState(
    `DNT-${Date.now().toString().slice(-8)}`
  );

  /* ---------------------------------------------------------------------- */
  /* RECUPERATION DU QUESTIONNAIRE                                          */
  /* ---------------------------------------------------------------------- */


useEffect(() => {
  if (!section) {
    console.warn("Aucune section reçue dans location.state");
    return;
  }

  console.log("Questionnaire reçu :", section);

  setSections({
    symptomes: Array.isArray(section.symptomes)
      ? section.symptomes
      : [],

    douleur: Array.isArray(section.douleur)
      ? section.douleur
      : [],

    evolution: Array.isArray(section.evolution)
      ? section.evolution
      : [],

    informations: Array.isArray(section.informations)
      ? section.informations
      : [],
  });
}, [section]);

  const isBase64Image = (value) => {
  return (
    typeof value === "string" &&
    value.startsWith("data:image/")
  );
};

  /* ---------------------------------------------------------------------- */
  /* ANALYSE                                                                */
  /* ---------------------------------------------------------------------- */

const analyse = useMemo(() => {
  if (!analyseIA) {
    return null;
  }

  const niveau = String(
    analyseIA.niveau_urgence?.niveau || ""
  ).toLowerCase();

  let urgenceColor = "green";

  if (
    niveau.includes("immédiate") ||
    niveau.includes("immediate") ||
    niveau.includes("critique") ||
    niveau.includes("élevée") ||
    niveau.includes("elevee") ||
    niveau.includes("urgente")
  ) {
    urgenceColor = "red";
  } else if (
    niveau.includes("modérée") ||
    niveau.includes("moderee") ||
    niveau.includes("moyenne")
  ) {
    urgenceColor = "yellow";
  } else if (
    niveau.includes("faible") ||
    niveau.includes("routine")
  ) {
    urgenceColor = "green";
  }

  return {
    diagnostic:
      analyseIA.pathologie?.nom ||
      "Orientation dentaire",

    description:
      analyseIA.pathologie?.description ||
      "Aucune description disponible.",

    niveauUrgence:
      analyseIA.niveau_urgence?.niveau ||
      "Non déterminé",

    urgenceColor,

    urgenceDescription:
      analyseIA.niveau_urgence?.description ||
      "Aucune description disponible.",

    traitement:
      Array.isArray(analyseIA.conduite_preliminaire)
        ? analyseIA.conduite_preliminaire
        : [],

    prevention:
      Array.isArray(analyseIA.conseils_prevention)
        ? analyseIA.conseils_prevention
        : [],

    recommandation:
      analyseIA.conduite_preliminaire?.[0] ||
      "Une consultation auprès d'un professionnel de santé est recommandée.",
  };
}, [analyseIA]);

if (!analyse) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl px-8 py-7 shadow-2xl text-center">
        <div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-slate-200 border-t-[#0A2E61] animate-spin" />

        <h2 className="text-base font-bold text-slate-900">
          Préparation du rapport...
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          Récupération des résultats de l'analyse.
        </p>
      </div>
    </div>
  );
}

const urgency =
  urgencyConfig[analyse.urgenceColor] ||
  urgencyConfig.green;


  const totalResponses =
    sections.symptomes.length +
    sections.douleur.length +
    sections.evolution.length +
    sections.informations.length;

  /* ---------------------------------------------------------------------- */
  /* SECTION QUESTIONNAIRE                                                  */
  /* ---------------------------------------------------------------------- */

  const questionnaireSections = [
    {
      title: "Vos symptômes actuels",
      description:
        "Les symptômes que vous avez déclarés au début de l'évaluation.",
      icon: Activity,
      data: sections.symptomes,
    },

    {
      title: "Précisons votre douleur",
      description:
        "Les informations renseignées concernant la douleur ressentie.",
      icon: HeartPulse,
      data: sections.douleur,
    },

    {
      title: "L'évolution de vos symptômes",
      description:
        "Les informations concernant l'évolution de votre état.",
      icon: Clock,
      data: sections.evolution,
    },

    {
      title: "Quelques dernières informations",
      description:
        "Les dernières informations fournies dans le questionnaire.",
      icon: Info,
      data: sections.informations,
    },
  ];

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */

return (
  <div className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-5">

    {/* ================================================================
        OVERLAY
    ================================================================= */}
    <div
      className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      aria-hidden="true"
    />

    {/* ================================================================
        MODAL PRINCIPAL
    ================================================================= */}
    <div className="relative w-full max-w-[1400px] h-[96vh] bg-[#F5F7FB] rounded-[28px] shadow-2xl shadow-slate-950/30 overflow-hidden border border-white/20 flex flex-col">

      {/* ============================================================
          HEADER DU MODAL
      ============================================================= */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200">

        <div className="px-5 sm:px-7 py-4 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">

            <div className="relative flex-shrink-0">

              <div className="w-11 h-11 bg-[#0A2E61] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">

                <Sparkles className="w-5 h-5 text-white" />

              </div>

              <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-white" />

            </div>

            <div className="min-w-0">

              <h1 className="font-bold text-lg sm:text-xl text-slate-900">
                Dentalis
                <span className="text-[#0A2E61]"> IA</span>
              </h1>

              <p className="text-xs text-slate-400 truncate">
                Rapport d'orientation dentaire
              </p>

            </div>

          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 px-3 py-2 bg-slate-50 rounded-xl">

              <ShieldCheck className="w-4 h-4 text-emerald-500" />

              Analyse sécurisée

            </div>

            {/* PDF */}
            <PDFDownloadLink
              document={
                <RapportDentalisPDF
                  questionnaire={sections}
                  analyse={analyse}
                  reportId={reportId}
                  patient={patient}
                />
              }
              fileName={`Dentalis-IA-${reportId}.pdf`}
            >

              {({ loading }) => (

                <button
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-[#0A2E61] hover:bg-[#08264f] disabled:opacity-60 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-blue-900/20 transition"
                >

                  <Download className="w-4 h-4" />

                  <span className="hidden sm:inline">
                    {loading
                      ? "Préparation..."
                      : "Télécharger le rapport"}
                  </span>

                  <span className="sm:hidden">
                    PDF
                  </span>

                </button>

              )}

            </PDFDownloadLink>

            {/* Fermer */}
            <button
              type="button"
              onClick={() => navigate("/historique", { replace: true })}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              title="Fermer le rapport"
              aria-label="Fermer le rapport"
            >

              <X className="w-5 h-5" />

            </button>

          </div>

        </div>

      </header>


      {/* ================================================================
          CONTENU SCROLLABLE
      ================================================================= */}
      <div className="flex-1 overflow-y-auto">

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* ==========================================================
              HERO
          =========================================================== */}
          <section className="mb-8">

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-[#0A2E61] rounded-full text-xs font-semibold mb-4">

                  <CheckCircle2 className="w-3.5 h-3.5" />

                  Analyse terminée

                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">

                  Votre rapport est prêt

                </h2>

                <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed text-sm sm:text-base">

                  Dentalis IA a analysé les informations renseignées afin
                  de fournir une orientation sur la situation, le niveau
                  d'urgence et les prochaines étapes recommandées.

                </p>

              </div>

              {/* Identifiant */}
              <div className="flex items-center gap-2 text-xs text-slate-400">

                <FileText className="w-4 h-4" />

                <span>
                  {reportId}
                </span>

              </div>

            </div>

          </section>


          {/* ==========================================================
              GRID
          =========================================================== */}
          <div className="grid lg:grid-cols-3 gap-6">


            {/* ========================================================
                COLONNE PRINCIPALE
            ========================================================= */}
            <div className="lg:col-span-2 space-y-6">


              {/* ======================================================
                  ORIENTATION CLINIQUE
              ======================================================= */}
              <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                    <Stethoscope className="w-5 h-5 text-[#0A2E61]" />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Orientation clinique
                    </h3>

                    <p className="text-xs text-slate-400">
                      Résultat indicatif basé sur vos réponses
                    </p>

                  </div>

                </div>


                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">
                        Pathologie suspectée
                      </p>

                      <h4 className="text-xl md:text-2xl font-bold text-slate-900">
                        {analyse.diagnostic}
                      </h4>

                    </div>

                    <div className="hidden sm:flex w-11 h-11 rounded-xl bg-white items-center justify-center shadow-sm flex-shrink-0">

                      <Sparkles className="w-5 h-5 text-[#0A2E61]" />

                    </div>

                  </div>

                  <p className="text-sm text-slate-600 leading-7 mt-4">
                    {analyse.description}
                  </p>

                </div>

              </section>


              {/* ======================================================
                  URGENCE
              ======================================================= */}
              <section
                className={`${urgency.bg} ${urgency.border} border rounded-3xl p-5 sm:p-7`}
              >

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">

                    <AlertTriangle
                      className={`w-5 h-5 ${urgency.icon}`}
                    />

                  </div>

                  <div className="flex-1">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                      <div>

                        <p className="text-xs uppercase tracking-wider font-bold opacity-70">
                          Niveau d'urgence estimé
                        </p>

                        <h3
                          className={`text-xl font-bold ${urgency.text} mt-1`}
                        >
                          {analyse.niveauUrgence}
                        </h3>

                      </div>

                      <span
                        className={`inline-flex items-center self-start px-3 py-1.5 rounded-full text-xs font-bold ${urgency.badge}`}
                      >
                        Orientation IA
                      </span>

                    </div>

                    <p
                      className={`text-sm ${urgency.text} mt-4 leading-6`}
                    >
                      {analyse.urgenceDescription}
                    </p>

                  </div>

                </div>

              </section>


              {/* ======================================================
                  CONDUITE PRÉLIMINAIRE
              ======================================================= */}
              <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">

                    <ShieldPlus className="w-5 h-5 text-emerald-600" />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Conduite préliminaire
                    </h3>

                    <p className="text-xs text-slate-400">
                      Mesures générales en attendant une évaluation professionnelle
                    </p>

                  </div>

                </div>

                <div className="space-y-3">

                  {analyse.traitement.map((item, index) => (

                    <div
                      key={index}
                      className="flex gap-3 p-4 bg-slate-50 rounded-2xl"
                    >

                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />

                      <p className="text-sm text-slate-600 leading-6">
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

              </section>


              {/* ======================================================
                  PRÉVENTION
              ======================================================= */}
              <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                    <ShieldCheck className="w-5 h-5 text-[#0A2E61]" />

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Conseils de prévention
                    </h3>

                    <p className="text-xs text-slate-400">
                      Bonnes pratiques pour préserver votre santé bucco-dentaire
                    </p>

                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-3">

                  {analyse.prevention.map((item, index) => (

                    <div
                      key={index}
                      className="flex gap-3 p-4 bg-slate-50 rounded-2xl"
                    >

                      <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">

                        <CheckCircle2 className="w-4 h-4 text-[#0A2E61]" />

                      </div>

                      <p className="text-sm text-slate-600 leading-6">
                        {item}
                      </p>

                    </div>

                  ))}

                </div>

              </section>


              {/* ======================================================
                  QUESTIONNAIRE
              ======================================================= */}
              <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm">

                <div className="flex items-center justify-between mb-7 gap-4">

                  <div>

                    <h3 className="font-bold text-slate-900">
                      Données du questionnaire
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Réponses utilisées pour générer cette orientation
                    </p>

                  </div>

                  <span className="flex-shrink-0 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">

                    {totalResponses} réponse
                    {totalResponses > 1 ? "s" : ""}

                  </span>

                </div>


                <div className="space-y-5">

                  {questionnaireSections.map((item, index) => {

                    const Icon = item.icon;

                    const textResponses = item.data.filter(
                      (response) => !isBase64Image(response)
                    );

                    const images = item.data.filter(
                      (response) => isBase64Image(response)
                    );

                    return (

                      <div
                        key={index}
                        className="border border-slate-200 rounded-2xl overflow-hidden"
                      >

                        {/* Section header */}

                        <div className="bg-slate-50 px-5 py-4 flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">

                            <Icon className="w-4 h-4 text-[#0A2E61]" />

                          </div>

                          <div>

                            <h4 className="font-semibold text-slate-900 text-sm">
                              {item.title}
                            </h4>

                            <p className="text-xs text-slate-400 mt-0.5">
                              {item.description}
                            </p>

                          </div>

                        </div>


                        {/* Responses */}

                        <div className="p-5">

                          {textResponses.length > 0 && (

                            <div className="flex flex-wrap gap-2">

                              {textResponses.map(
                                (response, responseIndex) => (

                                  <span
                                    key={responseIndex}
                                    className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium"
                                  >
                                    {String(response)}
                                  </span>

                                )
                              )}

                            </div>

                          )}


                          {/* PHOTOS */}

                          {images.length > 0 && (

                            <div className="mt-4 space-y-4">

                              {images.map(
                                (image, imageIndex) => (

                                  <div
                                    key={`image-${imageIndex}`}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                                  >

                                    <div className="px-4 py-3 border-b border-slate-200 bg-white">

                                      <div className="flex items-center gap-2">

                                        <Camera className="w-4 h-4 text-indigo-600" />

                                        <span className="text-sm font-semibold text-slate-800">
                                          Photo de la zone concernée
                                        </span>

                                      </div>

                                    </div>

                                    <div className="p-4">

                                      <img
                                        src={image}
                                        alt="Zone dentaire concernée"
                                        className="w-full max-h-[450px] object-contain rounded-xl bg-slate-100"
                                      />

                                    </div>

                                  </div>

                                )
                              )}

                            </div>

                          )}


                          {textResponses.length === 0 &&
                            images.length === 0 && (

                              <p className="text-sm text-slate-400 italic">
                                Aucune réponse renseignée pour cette section.
                              </p>

                            )}

                        </div>

                      </div>

                    );

                  })}

                </div>

              </section>


              {/* ======================================================
                  RECOMMANDATION
              ======================================================= */}
              <section className="bg-[#0A2E61] rounded-3xl p-5 sm:p-7 text-white shadow-xl">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">

                    <Stethoscope className="w-5 h-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Prochaine étape recommandée
                    </h3>

                    <p className="text-sm text-blue-100 mt-3 leading-7">
                      {analyse.recommandation}
                    </p>

                  </div>

                </div>

              </section>

            </div>


            {/* ========================================================
                SIDEBAR
            ========================================================= */}
            <aside className="space-y-6">


              {/* ======================================================
                  INFORMATIONS RAPPORT
              ======================================================= */}
              <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

                <h3 className="font-bold text-slate-900 mb-5">
                  Informations du rapport
                </h3>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">

                      <FileText className="w-4 h-4 text-slate-500" />

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Identifiant
                      </p>

                      <p className="text-sm font-semibold text-slate-800">
                        {reportId}
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">

                      <CalendarDays className="w-4 h-4 text-slate-500" />

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Date
                      </p>

                      <p className="text-sm font-semibold text-slate-800">
                        {new Date().toLocaleDateString("fr-FR")}
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">

                      <Activity className="w-4 h-4 text-slate-500" />

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Réponses analysées
                      </p>

                      <p className="text-sm font-semibold text-slate-800">
                        {totalResponses}
                      </p>

                    </div>

                  </div>

                </div>

              </section>
<section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
  <div className="flex items-center gap-3 mb-5">
    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
      <User className="w-4 h-4 text-[#0A2E61]" />
    </div>

    <div>
      <h3 className="font-bold text-slate-900">
        Informations du patient
      </h3>

      <p className="text-xs text-slate-400 mt-0.5">
        Patient concerné par cette analyse
      </p>
    </div>
  </div>

  <div className="space-y-4">

    <div>
      <p className="text-xs text-slate-400">
        Nom complet
      </p>

      <p className="text-sm font-semibold text-slate-800">
        {patient?.prenom || ""} {patient?.nom || ""}
      </p>
    </div>

    <div>
      <p className="text-xs text-slate-400">
        Adresse email
      </p>

      <p className="text-sm font-semibold text-slate-800 break-all">
        {patient?.email || "Non renseigné"}
      </p>
    </div>

    <div>
      <p className="text-xs text-slate-400">
        Téléphone
      </p>

      <p className="text-sm font-semibold text-slate-800">
        {patient?.telephone || "Non renseigné"}
      </p>
    </div>

  </div>
</section>

              {/* ======================================================
                  CENTRE DE SANTÉ
              ======================================================= */}
              <section className="bg-[#0A2E61] rounded-3xl p-6 text-white shadow-xl">

                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-5">

                  <MapPin className="w-5 h-5" />

                </div>

                <h3 className="font-bold text-lg">
                  Besoin d'une consultation ?
                </h3>

                <p className="text-sm text-blue-100 mt-2 leading-relaxed">

                  Trouvez un centre dentaire à proximité et obtenez
                  votre itinéraire.

                </p>

                <button
                  className="mt-5 w-full bg-white text-[#0A2E61] rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition"
                  onClick={() => navigate("/centresdesante")}
                >

                  Trouver un centre

                  <ChevronRight className="w-4 h-4" />

                </button>

              </section>


              {/* ======================================================
                  DISCLAIMER
              ======================================================= */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">

                <div className="flex gap-3">

                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />

                  <p className="text-xs text-amber-800 leading-relaxed">

                    <strong>Important :</strong> Dentalis IA fournit une
                    orientation basée sur les informations déclarées.
                    Elle ne constitue pas un diagnostic médical et ne
                    remplace pas l'examen d'un chirurgien-dentiste ou
                    d'un professionnel de santé.

                  </p>

                </div>

              </div>

            </aside>

          </div>

        </main>

      </div>

    </div>

  </div>
);
}