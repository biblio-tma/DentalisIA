import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Brain,
  FileText,
  ScanSearch,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { useAnalyse } from "../hooks/AnalyseContext";

const ETAPES = [
  {
    id: "pretraitement",
    label: "Prétraitement des informations",
    start: 0,
    end: 20,
    icon: ScanSearch,
  },
  {
    id: "symptomes",
    label: "Analyse des symptômes",
    start: 20,
    end: 60,
    icon: Brain,
  },
  {
    id: "risques",
    label: "Évaluation des risques",
    start: 60,
    end: 90,
    icon: ShieldCheck,
  },
  {
    id: "rapport",
    label: "Génération du rapport",
    start: 90,
    end: 100,
    icon: FileText,
  },
];

const getArray = (key) => {
  try {
    const value = sessionStorage.getItem(key);

    if (!value) return [];

    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean);
    }

    if (parsed && typeof parsed === "object") {
      return Object.values(parsed).filter(Boolean);
    }

    if (parsed !== null && parsed !== undefined) {
      return [parsed];
    }

    return [];
  } catch (error) {
    console.error(`Erreur lecture ${key}:`, error);
    return [];
  }
};

export default function AnalyseEnCours() {
  const navigate = useNavigate();
  const {
    // historique,
    recupererHistorique,
  } = useAnalyse();
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(null);

  const [currentStepId, setCurrentStepId] = useState(
    "pretraitement"
  );

  const [error, setError] = useState(null);

  /*
   * ==========================================================
   * RÉCUPÉRATION + ANALYSE RÉELLE
   * ==========================================================
   */
  useEffect(() => {
    let cancelled = false;

    const lancerAnalyse = async () => {
      try {
        /*
         * ------------------------------------------------------
         * 1. RÉCUPÉRATION DES DONNÉES
         * ------------------------------------------------------
         */

const userId = localStorage.getItem("user_id");

if (!userId) {
  throw new Error(
    "Utilisateur non identifié. Veuillez vous reconnecter."
  );
}

const questionnaireData = {
  user_id: userId,
  symptomes: getArray("dentalis_symptomes"),
  douleur: getArray("dentalis_question2"),
  evolution: getArray("dentalis_question3"),
  informations: getArray("dentalis_question4"),
};

        console.log(
          "Données envoyées à Dentalis IA :",
          questionnaireData
        );

        if (cancelled) return;

        setSection(questionnaireData);

        /*
         * ------------------------------------------------------
         * 2. PRÉTRAITEMENT
         *
         * Cette partie correspond à une vraie opération locale.
         * On ne fait pas encore croire que Gemini travaille.
         * ------------------------------------------------------
         */

        setCurrentStepId("pretraitement");
        setProgress(5);

        await attendre(300);

        if (cancelled) return;

        setProgress(10);

        await attendre(300);

        if (cancelled) return;

        setProgress(20);

        /*
         * ------------------------------------------------------
         * 3. ANALYSE DES SYMPTÔMES
         *
         * Ici on démarre la vraie requête FastAPI.
         * ------------------------------------------------------
         */

        setCurrentStepId("symptomes");

        /*
         * Progression visuelle pendant l'attente de Gemini.
         *
         * IMPORTANT :
         * Cette progression ne prétend pas connaître le vrai
         * pourcentage interne de Gemini.
         *
         * Elle indique simplement que la requête est en cours.
         */

        let fakeProgress = 20;

        const progressInterval = setInterval(() => {
          if (cancelled) return;

          fakeProgress += 1;

          /*
           * On bloque volontairement à 58 %.
           *
           * Gemini peut prendre 2 secondes ou 30 secondes.
           * On ne doit jamais afficher 60 % avant sa réponse.
           */
          if (fakeProgress <= 58) {
            setProgress(fakeProgress);
          }
        }, 250);

        /*
         * ------------------------------------------------------
         * APPEL RÉEL AU BACKEND
         * ------------------------------------------------------
         */

        const response = await fetch(
          "http://127.0.0.1:8000/analyse/api/analyse-dentaire",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionnaireData),
          }
        );

        clearInterval(progressInterval);

        if (!response.ok) {
          let errorMessage =
            "Erreur lors de l'analyse dentaire.";

          try {
            const errorData = await response.json();

            if (typeof errorData.detail === "string") {
              errorMessage = errorData.detail;
            } else if (errorData.detail?.message) {
              errorMessage = errorData.detail.message;
            }
          } catch {
            // Rien
          }

          throw new Error(errorMessage);
        }

        /*
         * ------------------------------------------------------
         * 4. RÉPONSE GEMINI REÇUE
         * ------------------------------------------------------
         */

        const analyse = await response.json();

        console.log(
          "Analyse Dentalis IA reçue :",
          analyse
        );

        if (cancelled) return;

        /*
         * Gemini a réellement répondu.
         *
         * On peut maintenant passer à 60 %.
         */

        setProgress(60);
        setCurrentStepId("risques");

        /*
         * ------------------------------------------------------
         * 5. TRAITEMENT DU RÉSULTAT
         * ------------------------------------------------------
         */

        await attendre(400);

        if (cancelled) return;

        setProgress(70);

        await attendre(400);

        if (cancelled) return;

        setProgress(80);

        await attendre(300);

        if (cancelled) return;

        setProgress(90);

        /*
         * ------------------------------------------------------
         * 6. GÉNÉRATION DU RAPPORT
         * ------------------------------------------------------
         */

        setCurrentStepId("rapport");

        /*
         * On sauvegarde l'analyse réelle.
         *
         * C'est beaucoup mieux que de seulement transmettre
         * le questionnaire dans l'URL.
         */

        sessionStorage.setItem(
          "dentalis_analyse_resultat",
          JSON.stringify(analyse)
        );

        sessionStorage.setItem(
          "dentalis_questionnaire",
          JSON.stringify(questionnaireData)
        );

        /*
         * Petite étape finale.
         */

        await attendre(400);

        if (cancelled) return;

        setProgress(95);

        await attendre(300);

        if (cancelled) return;

        setProgress(100);

        /*
         * ------------------------------------------------------
         * 7. NAVIGATION
         * ------------------------------------------------------
         */
        await recupererHistorique();
        await attendre(700);

        if (cancelled) return;

        navigate("/rapport", {
          replace: true,
          state: {
            section: questionnaireData,
            analyse: analyse,
          },
        });
      } catch (err) {
        console.error(
          "Erreur pendant l'analyse :",
          err
        );

        if (cancelled) return;

        setError(
          err.message ||
            "Une erreur est survenue pendant l'analyse."
        );
      }
    };

    lancerAnalyse();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /*
   * ==========================================================
   * FONCTION ATTENTE
   * ==========================================================
   */

  const attendre = (ms) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms)
    );

  /*
   * ==========================================================
   * ÉTAPE ACTUELLE
   * ==========================================================
   */

  const currentStep =
    ETAPES.find(
      (step) =>
        currentStepId === step.id
    ) || ETAPES[0];

  const CurrentIcon = currentStep.icon;

  /*
   * ==========================================================
   * ERREUR
   * ==========================================================
   */

  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">

        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />

        <div className="relative w-full max-w-md rounded-[30px] bg-white p-8 shadow-2xl">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <ShieldCheck className="h-7 w-7 text-red-500" />
          </div>

          <h2 className="text-center text-xl font-bold text-slate-900">
            Analyse impossible
          </h2>

          <p className="mt-3 text-center text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-2xl bg-[#0A2E61] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#08264F]"
          >
            Réessayer
          </button>

        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * RENDU
   * ==========================================================
   */

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />

      {/* MODAL */}
      <div className="relative w-full max-w-xl max-h-[95vh] overflow-hidden rounded-[30px] border border-white/20 bg-white shadow-2xl shadow-slate-950/30">

        {/* ====================================================
            HEADER
        ===================================================== */}

        <div className="relative px-7 pb-5 pt-7">

          <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />

          <div className="relative flex items-center gap-3">

            <div className="relative">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A2E61] to-[#1672C8] shadow-lg shadow-blue-900/25">

                <Sparkles className="h-5 w-5 text-white" />

              </div>

              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500" />

            </div>

            <div>

              <h1 className="text-lg font-bold text-slate-900">
                Dentalis
                <span className="text-[#0A2E61]">
                  {" "}IA
                </span>
              </h1>

              <p className="text-xs text-slate-400">
                Assistant dentaire intelligent
              </p>

            </div>

          </div>
        </div>

        {/* ====================================================
            CONTENU
        ===================================================== */}

        <div className="px-7 pb-7">

          {/* BADGE */}

          <div className="mb-4 flex justify-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-[#0A2E61]">

              <span className="relative flex h-2 w-2">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0A2E61]" />

              </span>

              Analyse en cours

            </div>

          </div>

          {/* TITRE */}

          <div className="text-center">

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Analyse intelligente
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              Dentalis IA analyse les informations
              renseignées afin de préparer votre
              orientation personnalisée.
            </p>

          </div>

          {/* =================================================
              CERCLE
          ================================================= */}

          <div className="flex justify-center py-7">

            <div className="relative h-44 w-44">

              <svg
                width="176"
                height="176"
                viewBox="0 0 176 176"
                className="-rotate-90"
              >

                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  fill="none"
                  stroke="#E8EEF8"
                  strokeWidth="11"
                />

                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  fill="none"
                  stroke="#0A2E61"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={
                    2 * Math.PI * 72
                  }
                  strokeDashoffset={
                    2 * Math.PI * 72 -
                    (progress / 100) *
                      (2 * Math.PI * 72)
                  }
                  className="transition-all duration-500 ease-out"
                />

              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">

                <span className="text-[38px] font-bold tracking-tight text-slate-900">
                  {progress}%
                </span>

                <span className="text-[11px] font-medium text-slate-400">
                  progression
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              ÉTAPE ACTUELLE
          ================================================= */}

          <div className="rounded-2xl border border-blue-100/80 bg-gradient-to-r from-blue-50 to-slate-50 p-4">

            <div className="flex items-center gap-4">

              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">

                <CurrentIcon className="h-5 w-5 text-[#0A2E61]" />

              </div>

              <div className="min-w-0">

                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Étape actuelle
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                  {currentStep.label}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              ÉTAPES
          ================================================= */}

          <div className="mt-5 space-y-3">

            {ETAPES.map((etape) => {

              const done =
                progress >= etape.end;

              const active =
                currentStepId === etape.id &&
                !done;

              const Icon = etape.icon;

              return (
                <div
                  key={etape.id}
                  className={`flex items-center gap-3 px-1 transition-all duration-300 ${
                    done
                      ? "opacity-100"
                      : active
                      ? "opacity-100"
                      : "opacity-50"
                  }`}
                >

                  <div className="flex-shrink-0">

                    {done ? (
                      <CheckCircle2 className="h-[18px] w-[18px] text-emerald-500" />
                    ) : (
                      <Circle
                        className={`h-[18px] w-[18px] ${
                          active
                            ? "text-[#0A2E61]"
                            : "text-slate-300"
                        }`}
                      />
                    )}

                  </div>

                  <div className="flex flex-1 items-center justify-between gap-3">

                    <div className="flex items-center gap-2">

                      <Icon
                        className={`h-4 w-4 ${
                          done || active
                            ? "text-slate-600"
                            : "text-slate-300"
                        }`}
                      />

                      <span
                        className={`text-xs sm:text-sm ${
                          done
                            ? "font-medium text-slate-800"
                            : active
                            ? "font-semibold text-[#0A2E61]"
                            : "text-slate-400"
                        }`}
                      >
                        {etape.label}
                      </span>

                    </div>

                    {done && (
                      <span className="flex-shrink-0 text-[10px] font-semibold text-emerald-500 sm:text-xs">
                        Terminé
                      </span>
                    )}

                    {active && (
                      <span className="flex-shrink-0 text-[10px] font-semibold text-[#0A2E61] sm:text-xs">
                        En cours…
                      </span>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* ====================================================
            FOOTER
        ===================================================== */}

        <div className="border-t border-slate-100 bg-slate-50/80 px-7 py-4">

          <div className="flex items-center justify-center gap-2">

            <ShieldCheck className="h-4 w-4 text-emerald-500" />

            <span className="text-[11px] text-slate-500 sm:text-xs">
              Analyse sécurisée et confidentielle
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}