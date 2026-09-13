import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  Filter,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useAnalyse } from "../hooks/AnalyseContext";


/* ============================================================
   CONFIGURATION
============================================================ */

const API_URL = "http://127.0.0.1:8000";

/*
  Ton backend FastAPI doit avoir :

  app.include_router(analyse_router, prefix="/analyse")

  et dans routes.py :

  @router.get("/api/mes-analyses")

  => URL finale :
  http://127.0.0.1:8000/analyse/api/mes-analyses
*/

/* ============================================================
   HELPERS
============================================================ */

export function parseDateFr(dateString) {
  if (!dateString) return 0;

  if (dateString instanceof Date) {
    return dateString.getTime();
  }

  // Date ISO provenant de Supabase
  const isoDate = new Date(dateString);

  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate.getTime();
  }

  // Ancien format DD/MM/YYYY
  const parts = String(dateString).split("/");

  if (parts.length === 3) {
    const [jour, mois, annee] = parts;

    return new Date(
      Number(annee),
      Number(mois) - 1,
      Number(jour)
    ).getTime();
  }

  return 0;
}

function formatDate(dateString) {
  const timestamp = parseDateFr(dateString);

  if (!timestamp) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(timestamp));
}

function formatDateComplete(dateString) {
  const timestamp = parseDateFr(dateString);

  if (!timestamp) {
    return "Date inconnue";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

/* ============================================================
   NORMALISATION URGENCE
============================================================ */

export function normalizeUrgence(value) {
  const urgence = String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  switch (urgence) {
    case "faible":
      return "Faible";

    case "modérée":
    case "moyen":
    case "moyenne":
      return "Modérée";

    case "elevee":
    case "élevée":
      return "Élevée";

    case "urgente":
    case "urgence":
      return "Urgente";

    default:
      return "Faible";
  }
}

/* ============================================================
   CONFIGURATION VISUELLE URGENCE
============================================================ */

export const urgenceConfig = {
  faible: {
    label: "Faible",
    color: "#16A34A",
    background: "#ECFDF3",
    border: "#BBF7D0",
    icon: ShieldCheck,
    description: "Aucune urgence immédiate détectée.",
  },

  modérée: {
    label: "Modérée",
    color: "#D97706",
    background: "#FFF7ED",
    border: "#FED7AA",
    icon: Clock3,
    description: "Une consultation dentaire est recommandée.",
  },

  élevée: {
    label: "Élevée",
    color: "#EA580C",
    background: "#FFF7ED",
    border: "#FDBA74",
    icon: AlertTriangle,
    description: "Une consultation rapide est recommandée.",
  },

  urgente: {
    label: "Urgente",
    color: "#DC2626",
    background: "#FEF2F2",
    border: "#FECACA",
    icon: AlertCircle,
    description: "Une prise en charge dentaire rapide est nécessaire.",
  },
};

/* ============================================================
   BADGE URGENCE
============================================================ */

function UrgenceBadge({ urgence }) {
  const config =
    urgenceConfig[urgence] || urgenceConfig.Faible;

  const Icon = config.icon;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
      style={{
        color: config.color,
        backgroundColor: config.background,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon size={14} strokeWidth={2.4} />
      {config.label}
    </span>
  );
}

/* ============================================================
   TRANSFORMATION SUPABASE → FORMAT UI
============================================================ */

function normalizeAnalyse(row) {
  const reponse = row?.reponse || {};
  const questionnaire = row?.questionnaire || {};

  const pathologie =
    reponse?.pathologie?.nom ||
    reponse?.pathologie?.name ||
    "Analyse dentaire";

  const description =
    reponse?.pathologie?.description ||
    "Aucune description disponible.";

  const urgence = normalizeUrgence(
    reponse?.niveau_urgence?.niveau
  );

  const urgenceDescription =
    reponse?.niveau_urgence?.description ||
    urgenceConfig[urgence]?.description ||
    "";

  const confiance =
    typeof reponse?.confiance === "number"
      ? Math.round(reponse.confiance)
      : null;

  const createdAt = row?.created_at || row?.updated_at;

  return {
    id: row?.id,

    date: formatDate(createdAt),

    dateComplete: formatDateComplete(createdAt),

    timestamp: parseDateFr(createdAt),

    pathologie,

    description,

    urgence,

    urgenceDescription,

    confiance,

    conduitePreliminaire:
      Array.isArray(reponse?.conduite_preliminaire)
        ? reponse.conduite_preliminaire
        : [],

    conseilsPrevention:
      Array.isArray(reponse?.conseils_prevention)
        ? reponse.conseils_prevention
        : [],

    questionnaire,

    reponse,

    user_id: row?.user_id,

    created_at: row?.created_at,

    updated_at: row?.updated_at,
  };
}

/* ============================================================
   TRI
============================================================ */

export function getHistoriqueTrie(historique = []) {
  return [...historique].sort(
    (a, b) =>
      (b.timestamp || parseDateFr(b.date)) -
      (a.timestamp || parseDateFr(a.date))
  );
}

/* ============================================================
   DERNIÈRE ANALYSE
============================================================ */

export function getDerniereAnalyse(historique = []) {
  return getHistoriqueTrie(historique)[0] || null;
}

/* ============================================================
   NIVEAU DE SANTÉ
============================================================ */

export function getNiveauSante(historique = []) {
  if (!historique.length) {
    return {
      label: "Aucune donnée",
      description: "Votre historique apparaîtra ici.",
    };
  }

  const derniere = getDerniereAnalyse(historique);

  if (!derniere) {
    return {
      label: "Aucune donnée",
      description: "Votre historique apparaîtra ici.",
    };
  }

  switch (derniere.urgence) {
    case "Urgente":
      return {
        label: "Attention requise",
        description:
          "Votre dernière analyse indique une urgence dentaire.",
      };

    case "Élevée":
      return {
        label: "Consultation recommandée",
        description:
          "Une consultation dentaire rapide est recommandée.",
      };

    case "Modérée":
      return {
        label: "Surveillance recommandée",
        description:
          "Une consultation dentaire est recommandée.",
      };

    default:
      return {
        label: "Situation stable",
        description:
          "Aucune urgence immédiate n'a été détectée.",
      };
  }
}

/* ============================================================
   MODAL RAPPORT
============================================================ */

function RapportModal({ analyse, onClose }) {
  if (!analyse) {
    return null;
  }

  const urgence =
    urgenceConfig[analyse.urgence] ||
    urgenceConfig.Faible;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative overflow-hidden bg-[#0A2E61] px-6 py-6 text-white sm:px-8">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>

          <div className="relative">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <FileText size={24} />
            </div>

            <p className="mb-1 text-sm font-medium text-blue-200">
              Rapport d'analyse dentaire
            </p>

            <h2 className="pr-10 text-2xl font-bold sm:text-3xl">
              {analyse.pathologie}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <UrgenceBadge urgence={analyse.urgence} />

              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
                <CalendarDays size={14} />
                {analyse.dateComplete}
              </span>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-5 sm:p-8">
          {/* URGENCE */}
          <div
            className="mb-6 rounded-2xl border p-5"
            style={{
              backgroundColor: urgence.background,
              borderColor: urgence.border,
            }}
          >
            <div className="flex gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: urgence.background,
                  color: urgence.color,
                }}
              >
                {React.createElement(urgence.icon, {
                  size: 23,
                })}
              </div>

              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: urgence.color }}
                >
                  Niveau d'urgence : {urgence.label}
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {analyse.urgenceDescription}
                </p>
              </div>
            </div>
          </div>

          {/* PATHOLOGIE */}
          <section className="mb-7">
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-[#0A2E61]">
              <Activity size={18} />
              Résultat de l'analyse
            </h3>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-lg font-bold text-slate-900">
                {analyse.pathologie}
              </h4>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                {analyse.description}
              </p>
            </div>
          </section>

          {/* CONFIANCE */}
          {analyse.confiance !== null && (
            <section className="mb-7">
              <h3 className="mb-3 text-base font-bold text-[#0A2E61]">
                Indicateur de confiance IA
              </h3>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">
                    Confiance indiquée par le modèle
                  </span>

                  <span className="text-lg font-bold text-[#0A2E61]">
                    {analyse.confiance}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#104A8D] to-[#1672C8]"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, analyse.confiance)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </section>
          )}

          {/* CONDUITE */}
          {analyse.conduitePreliminaire.length > 0 && (
            <section className="mb-7">
              <h3 className="mb-3 text-base font-bold text-[#0A2E61]">
                Conduite préliminaire
              </h3>

              <div className="space-y-2">
                {analyse.conduitePreliminaire.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[#0A2E61]">
                        {index + 1}
                      </span>

                      <p className="text-sm leading-6 text-slate-600">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* PREVENTION */}
          {analyse.conseilsPrevention.length > 0 && (
            <section className="mb-7">
              <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-[#0A2E61]">
                <ShieldCheck size={18} />
                Conseils de prévention
              </h3>

              <div className="space-y-2">
                {analyse.conseilsPrevention.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
                    >
                      <p className="text-sm leading-6 text-slate-600">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* QUESTIONNAIRE */}
          {Object.keys(analyse.questionnaire || {}).length >
            0 && (
            <section>
              <h3 className="mb-3 text-base font-bold text-[#0A2E61]">
                Informations utilisées
              </h3>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(
                    analyse.questionnaire || {}
                  ).map(([key, value]) => {
                    const displayValue = Array.isArray(value)
                      ? value.join(", ")
                      : typeof value === "object" &&
                        value !== null
                      ? JSON.stringify(value)
                      : String(value ?? "");

                    return (
                      <div key={key}>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          {key.replaceAll("_", " ")}
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {displayValue || "Non renseigné"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* AVERTISSEMENT */}
          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle
                className="mt-0.5 shrink-0 text-amber-600"
                size={18}
              />

              <p className="text-xs leading-6 text-amber-800">
                Ce rapport constitue une orientation préliminaire
                basée sur les informations fournies. Il ne remplace
                pas l'examen clinique réalisé par un chirurgien-dentiste.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#0A2E61] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#08264F]"
          >
            Fermer le rapport
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SKELETON
============================================================ */

function HistoriqueSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-4 p-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-100 p-4"
          >
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-3 h-5 w-48 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}


export default function Historique({
  onVoirPlus,
  onOuvrirRapport,
}) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [filtreUrgence, setFiltreUrgence] =
    useState("Tous");

  const [selectedAnalyse, setSelectedAnalyse] =
    useState(null);
  const {
    historique,
    historiqueCharge,
    loading,
    error,
    recupererHistorique,
  } = useAnalyse();

  useEffect(() => {
    if (!historiqueCharge) {
      recupererHistorique().catch(() => {});
    }
  }, [
    historiqueCharge,
    recupererHistorique,
  ]);

  const historiqueFiltre = useMemo(() => {
    const terme = search.trim().toLowerCase();

    return historique.filter((analyse) => {
      const correspondRecherche =
        !terme ||
        analyse.pathologie
          ?.toLowerCase()
          .includes(terme);

      const correspondUrgence =
        filtreUrgence === "Tous" ||
        analyse.urgence === filtreUrgence;

      return (
        correspondRecherche &&
        correspondUrgence
      );
    });
  }, [historique, search, filtreUrgence]);

  /* ==========================================================
     STATS
  ========================================================== */

  const derniereAnalyse =
    getDerniereAnalyse(historique);

  const niveauSante =
    getNiveauSante(historique);

  const totalAnalyses = historique.length;

  const analysesUrgentes = historique.filter(
    (item) => item.urgence === "urgente"
  ).length;

  const analysesElevees = historique.filter(
    (item) => item.urgence === "élevée"
  ).length;

  /* ==========================================================
     OUVERTURE RAPPORT
  ========================================================== */

  const handleOpenReport = (analyse) => {
    navigate("/rapport", {
    state: {
      section: analyse.questionnaire,
      analyse: analyse.reponse,
    },
  });
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      <div className="min-h-screen bg-[#F5F8FC] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0A2E61]">
                <Sparkles size={14} />
                Dentalis IA
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#0A2E61] sm:text-4xl">
                Mon historique
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Retrouvez l'ensemble de vos analyses dentaires
                réalisées avec Dentalis IA.
              </p>
            </div>

            <button
              type="button"
              onClick={recupererHistorique}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#0A2E61] shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Actualiser
            </button>
          </div>

          {/* ==================================================
              ERREUR
          ================================================== */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <AlertCircle
                    size={20}
                    className="text-red-600"
                  />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-red-800">
                    Impossible de charger l'historique
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={recupererHistorique}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    <RefreshCw size={14} />
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              STATISTIQUES
          ================================================== */}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Analyses réalisées
                  </p>

                  <p className="mt-2 text-3xl font-black text-[#0A2E61]">
                    {totalAnalyses}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#0A2E61]">
                  <Activity size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Depuis votre première analyse
              </p>
            </div>

            {/* DERNIÈRE */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    Dernière analyse
                  </p>

                  <p className="mt-2 truncate text-lg font-black text-[#0A2E61]">
                    {derniereAnalyse
                      ? derniereAnalyse.pathologie
                      : "Aucune"}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FileText size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {derniereAnalyse
                  ? derniereAnalyse.date
                  : "—"}
              </p>
            </div>

            {/* URGENCES */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Attention élevée
                  </p>

                  <p className="mt-2 text-3xl font-black text-orange-600">
                    {analysesElevees}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <AlertTriangle size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Analyses classées comme élevées
              </p>
            </div>

            {/* URGENTES */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Urgences
                  </p>

                  <p className="mt-2 text-3xl font-black text-red-600">
                    {analysesUrgentes}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <AlertCircle size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Analyses nécessitant une attention rapide
              </p>
            </div>
          </div>

          {/* ==================================================
              ÉTAT DE SANTÉ
          ================================================== */}

          {!loading && historique.length > 0 && (
            <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2E61] to-[#104A8D] p-6 text-white shadow-xl sm:p-7">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-blue-200">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Situation actuelle
                    </span>
                  </div>

                  <h2 className="text-2xl font-black">
                    {niveauSante.label}
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-blue-100">
                    {niveauSante.description}
                  </p>
                </div>

                {derniereAnalyse && (
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                    <p className="text-xs text-blue-200">
                      Dernier niveau détecté
                    </p>

                    <div className="mt-2">
                      <UrgenceBadge
                        urgence={derniereAnalyse.urgence}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================
              FILTRES
          ================================================== */}

          <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Rechercher une pathologie..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1672C8] focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* FILTER */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Filter size={18} />
                </div>

                <select
                  value={filtreUrgence}
                  onChange={(event) =>
                    setFiltreUrgence(event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#1672C8] focus:ring-4 focus:ring-blue-50"
                >
                  <option value="Tous">
                    Toutes les urgences
                  </option>

                  <option value="faible">
                    Faible
                  </option>

                  <option value="modérée">
                    Modérée
                  </option>

                  <option value="élevée">
                    Élevée
                  </option>

                  <option value="urgente">
                    Urgente
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ==================================================
              CONTENU
          ================================================== */}

          {loading ? (
            <HistoriqueSkeleton />
          ) : historiqueFiltre.length === 0 ? (
            /* EMPTY */
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0A2E61]">
                <FileText size={28} />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#0A2E61]">
                {historique.length === 0
                  ? "Aucune analyse pour le moment"
                  : "Aucun résultat trouvé"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {historique.length === 0
                  ? "Lorsque vous réaliserez une analyse dentaire, elle apparaîtra automatiquement dans cet espace."
                  : "Essayez de modifier votre recherche ou votre filtre d'urgence."}
              </p>

              {historique.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (onVoirPlus) {
                      onVoirPlus();
                    }
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0A2E61] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#08264F]"
                >
                  Commencer une analyse
                  <ChevronRight size={17} />
                </button>
              )}
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP TABLE
              ================================================= */}

              <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                          Date
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                          Pathologie
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                          Urgence
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                          Confiance
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {historiqueFiltre.map(
                        (analyse, index) => (
                          <tr
                            key={
                              analyse.id ||
                              `${analyse.date}-${index}`
                            }
                            className="group border-b border-slate-100 last:border-0 transition hover:bg-blue-50/30"
                          >
                            {/* DATE */}
                            <td className="whitespace-nowrap px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0A2E61]">
                                  <CalendarDays size={17} />
                                </div>

                                <div>
                                  <p className="text-sm font-bold text-slate-700">
                                    {analyse.date}
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    Analyse dentaire
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* PATHOLOGIE */}
                            <td className="px-6 py-5">
                              <p className="font-bold text-slate-800">
                                {analyse.pathologie}
                              </p>

                              {analyse.description && (
                                <p className="mt-1 max-w-sm truncate text-xs text-slate-400">
                                  {analyse.description}
                                </p>
                              )}
                            </td>

                            {/* URGENCE */}
                            <td className="px-6 py-5">
                              <UrgenceBadge
                                urgence={analyse.urgence}
                              />
                            </td>

                            {/* CONFIANCE */}
                            <td className="px-6 py-5">
                              {analyse.confiance !== null ? (
                                <div className="flex items-center gap-3">
                                  <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                      className="h-full rounded-full bg-[#1672C8]"
                                      style={{
                                        width: `${Math.min(
                                          100,
                                          Math.max(
                                            0,
                                            analyse.confiance
                                          )
                                        )}%`,
                                      }}
                                    />
                                  </div>

                                  <span className="text-sm font-bold text-slate-700">
                                    {analyse.confiance}%
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                      className="h-full rounded-full bg-[#1672C8]"
                                      style={{
                                        width: `${Math.min(
                                          100,
                                          Math.max(
                                            0,
                                            95
                                          )
                                        )}%`,
                                      }}
                                    />
                                  </div>

                                  <span className="text-sm font-bold text-slate-700">
                                    95%
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* ACTION */}
                            <td className="px-6 py-5 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenReport(
                                    analyse
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0A2E61] transition hover:border-blue-200 hover:bg-blue-50"
                              >
                                Voir le rapport
                                <ChevronRight size={15} />
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* =================================================
                  MOBILE / TABLET CARDS
              ================================================= */}

              <div className="grid gap-4 lg:hidden">
                {historiqueFiltre.map(
                  (analyse, index) => (
                    <div
                      key={
                        analyse.id ||
                        `${analyse.date}-${index}`
                      }
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0A2E61]">
                            <FileText size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-base font-black text-[#0A2E61]">
                              {analyse.pathologie}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                              <CalendarDays size={13} />
                              {analyse.date}
                            </p>
                          </div>
                        </div>

                        <UrgenceBadge
                          urgence={analyse.urgence}
                        />
                      </div>

                      {analyse.description && (
                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                          {analyse.description}
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Confiance
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-700">
                            {analyse.confiance !== null
                              ? `${analyse.confiance}%`
                              : "Non disponible"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenReport(
                              analyse
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0A2E61] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#08264F]"
                        >
                          Voir le rapport
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* =================================================
                  COMPTEUR
              ================================================= */}

              <div className="mt-5 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {historiqueFiltre.length} analyse
                  {historiqueFiltre.length > 1
                    ? "s"
                    : ""}{" "}
                  affichée
                  {historiqueFiltre.length > 1
                    ? "s"
                    : ""}
                </span>

                <span>
                  {historique.length} analyse
                  {historique.length > 1
                    ? "s"
                    : ""}{" "}
                  au total
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {selectedAnalyse && (
        <RapportModal
          analyse={selectedAnalyse}
          onClose={() => setSelectedAnalyse(null)}
        />
      )}
    </>
  );
}