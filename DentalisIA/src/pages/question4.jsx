import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  FileImage,
  FileText,
  Info,
  LoaderCircle,
  LockKeyhole,
  MessageSquareText,
  Pill,
  Send,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";

export default function QuestionnaireStep4({
  currentStep = 4,
  totalSteps = 4,
  onSubmit,
  onBack,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [traitement, setTraitement] = useState(null);
  const [detailTraitement, setDetailTraitement] = useState("");
  const [fievre, setFievre] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = Math.round(
    (currentStep / totalSteps) * 100
  );

  /* ==========================================================
     PHOTO
  ========================================================== */

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setPhoto(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  }

  function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(null);
    setPhotoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const canSubmit =
    traitement !== null &&
    fievre !== null &&
    photo !== null;

  const completionCount =
    (traitement !== null ? 1 : 0) +
    (fievre !== null ? 1 : 0) +
    (photo ? 1 : 0) +
    (notes.trim() ? 1 : 0);

  const completionText = useMemo(() => {
    if (completionCount === 0) {
      return "Aucune information complémentaire";
    }

    if (completionCount === 1) {
      return "1 information renseignée";
    }

    return `${completionCount} informations renseignées`;
  }, [completionCount]);

  /* ==========================================================
     SUBMIT
  ========================================================== */

  async function handleSubmit() {
    if (!canSubmit || isSubmitting) return;
    const traite = traitement ? "Je suis actuellement sous traitement." : "Je ne prends aucun traitement actuellement.";
    const fievres = fievre ? "J'ai la fièvre ou un gonflement du visage" : "Je n'ai pas la fièvre ou un gonflement du visage";
    const photoBase64 = photo
      ? await fileToDataURL(photo)
      : null;
    const data = {
      traite,
      fievres,
      photoBase64,
      notes: notes.trim(),
    };

    sessionStorage.setItem(
      "dentalis_question4",
      JSON.stringify(data)
    );

    if (onSubmit) {
      onSubmit(data);
      return;
    }

    setIsSubmitting(true);

    /*
      Simulation courte du lancement de l'analyse.
      À remplacer ensuite par l'appel API FastAPI.
    */

    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    navigate("/analyseencours", { replace: true });
  }

  /* ==========================================================
     BACK
  ========================================================== */

  function handleBack() {
    if (onBack) {
      onBack();
      return;
    }

    navigate("/question3");
  }

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
                  Finalisation de l'analyse
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

          <span>Évolution</span>

          <ChevronRight
            size={12}
            className="text-slate-300"
          />

          <span className="text-blue-600">
            Finalisation
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
                    Dernière étape
                  </span>

                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-4">
                  Quelques dernières informations
                </h1>

                <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
                  Vérifiez vos informations, ajoutez
                  éventuellement une photo et lancez votre
                  analyse Dentalis IA.
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
                        className="h-1 rounded-full bg-blue-400"
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

            {/* =================================================
                QUESTION 1
            ================================================= */}

            <div className="p-6 sm:p-7 border-b border-slate-100">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">

                  <Pill
                    size={22}
                    className="text-blue-600"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Question 01
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Prenez-vous actuellement un traitement ?
                  </h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Cette information peut être utile pour
                    contextualiser votre situation.
                  </p>

                </div>

              </div>

              {/* Oui / Non */}

              <div className="grid grid-cols-2 gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setTraitement(true)}
                  className={`
                    relative p-4 rounded-2xl border
                    text-left transition-all duration-200
                    ${
                      traitement === true
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                    }
                  `}
                >

                  <div className="flex items-center justify-between">

                    <span
                      className={`text-sm font-bold ${
                        traitement === true
                          ? "text-blue-900"
                          : "text-slate-700"
                      }`}
                    >
                      Oui
                    </span>

                    <div
                      className={`
                        w-6 h-6 rounded-lg border flex items-center justify-center
                        ${
                          traitement === true
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-200"
                        }
                      `}
                    >
                      {traitement === true && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}
                    </div>

                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    Je suis actuellement sous traitement.
                  </p>

                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTraitement(false);
                    setDetailTraitement("");
                  }}
                  className={`
                    relative p-4 rounded-2xl border
                    text-left transition-all duration-200
                    ${
                      traitement === false
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                    }
                  `}
                >

                  <div className="flex items-center justify-between">

                    <span
                      className={`text-sm font-bold ${
                        traitement === false
                          ? "text-blue-900"
                          : "text-slate-700"
                      }`}
                    >
                      Non
                    </span>

                    <div
                      className={`
                        w-6 h-6 rounded-lg border flex items-center justify-center
                        ${
                          traitement === false
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-200"
                        }
                      `}
                    >
                      {traitement === false && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}
                    </div>

                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    Je ne prends aucun traitement actuellement.
                  </p>

                </button>

              </div>

              {/* Détail traitement */}

              {traitement === true && (
                <div className="mt-4">

                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Quel traitement prenez-vous ?
                  </label>

                  <div className="relative">

                    <Pill
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={detailTraitement}
                      onChange={(e) =>
                        setDetailTraitement(e.target.value)
                      }
                      placeholder="Ex. antibiotique, anticoagulant..."
                      className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                QUESTION 2
            ================================================= */}

            <div className="p-6 sm:p-7 border-b border-slate-100">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">

                  <AlertCircle
                    size={22}
                    className="text-red-500"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                    Question 02
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Avez-vous de la fièvre ou un gonflement du visage ?
                  </h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Cette information peut signaler une
                    situation nécessitant une attention particulière.
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setFievre(true)}
                  className={`
                    p-4 rounded-2xl border text-left
                    transition-all duration-200
                    ${
                      fievre === true
                        ? "border-red-400 bg-red-50 shadow-sm"
                        : "border-slate-200 hover:border-red-200 hover:bg-slate-50"
                    }
                  `}
                >

                  <div className="flex items-center justify-between">

                    <span
                      className={`text-sm font-bold ${
                        fievre === true
                          ? "text-red-800"
                          : "text-slate-700"
                      }`}
                    >
                      Oui
                    </span>

                    <div
                      className={`
                        w-6 h-6 rounded-lg border flex items-center justify-center
                        ${
                          fievre === true
                            ? "bg-red-500 border-red-500"
                            : "border-slate-200"
                        }
                      `}
                    >

                      {fievre === true && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}

                    </div>

                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    Fièvre ou gonflement présent.
                  </p>

                </button>

                <button
                  type="button"
                  onClick={() => setFievre(false)}
                  className={`
                    p-4 rounded-2xl border text-left
                    transition-all duration-200
                    ${
                      fievre === false
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                    }
                  `}
                >

                  <div className="flex items-center justify-between">

                    <span
                      className={`text-sm font-bold ${
                        fievre === false
                          ? "text-blue-900"
                          : "text-slate-700"
                      }`}
                    >
                      Non
                    </span>

                    <div
                      className={`
                        w-6 h-6 rounded-lg border flex items-center justify-center
                        ${
                          fievre === false
                            ? "bg-blue-600 border-blue-600"
                            : "border-slate-200"
                        }
                      `}
                    >

                      {fievre === false && (
                        <Check
                          size={14}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}

                    </div>

                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    Aucun de ces symptômes.
                  </p>

                </button>

              </div>

              {fievre === true && (
                <div className="mt-4 flex gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">

                  <AlertCircle
                    size={18}
                    className="text-red-500 flex-shrink-0 mt-0.5"
                  />

                  <p className="text-[11px] leading-relaxed text-red-700">
                    Une fièvre ou un gonflement du visage
                    peut nécessiter une évaluation médicale
                    rapide. Dentalis IA ne remplace pas une
                    consultation professionnelle.
                  </p>

                </div>
              )}

            </div>

            {/* =================================================
                QUESTION 3 — PHOTO
            ================================================= */}

            <div className="p-6 sm:p-7 border-b border-slate-100">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">

                  <Camera
                    size={22}
                    className="text-indigo-600"
                  />

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Question 03
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Ajouter une photo de la zone concernée
                  </h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Facultatif — une image nette peut
                    apporter un contexte supplémentaire.
                  </p>

                </div>

              </div>

              {/* Upload */}

              {!photo ? (
                <label
                  htmlFor="dentalis-photo"
                  className="mt-6 flex flex-col items-center justify-center min-h-[190px] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 hover:border-blue-300 cursor-pointer transition-all group"
                >

                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:border-blue-200 group-hover:shadow-blue-100 transition">

                    <Upload
                      size={22}
                      className="text-slate-400 group-hover:text-blue-600 transition"
                    />

                  </div>

                  <p className="text-sm font-bold text-slate-700 mt-4">
                    Ajouter une photo
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1 text-center px-4">
                    PNG, JPG ou JPEG · image claire et bien cadrée
                  </p>

                  <span className="mt-4 px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200">
                    Parcourir les fichiers
                  </span>

                  <input
                    ref={fileInputRef}
                    id="dentalis-photo"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                </label>
              ) : (
                <div className="mt-6 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">

                  <div className="relative">

                    <img
                      src={photoPreview}
                      alt="Aperçu de la zone concernée"
                      className="w-full h-64 sm:h-80 object-cover"
                    />

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-950/70 text-white backdrop-blur flex items-center justify-center hover:bg-red-500 transition"
                      aria-label="Supprimer la photo"
                    >
                      <X size={17} />
                    </button>

                  </div>

                  <div className="p-4 flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">

                      <FileImage
                        size={18}
                        className="text-indigo-600"
                      />

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-bold text-slate-800 truncate">
                        {photo.name}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Image ajoutée à l'analyse
                      </p>

                    </div>

                    <Check
                      size={18}
                      className="text-emerald-500"
                    />

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                QUESTION 4 — NOTES
            ================================================= */}

            <div className="p-6 sm:p-7">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">

                  <MessageSquareText
                    size={22}
                    className="text-emerald-600"
                  />

                </div>

                <div className="flex-1">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Question 04
                  </p>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Souhaitez-vous ajouter une précision ?
                  </h2>

                  <p className="text-sm text-slate-400 mt-2">
                    Décrivez librement tout élément qui vous
                    semble important.
                  </p>

                </div>

              </div>

              <div className="mt-6 relative">

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Ex. La douleur apparaît surtout le soir..."
                  rows={5}
                  maxLength={1000}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <div className="absolute bottom-3 right-4 text-[10px] text-slate-400">
                  {notes.length}/1000
                </div>

              </div>

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-sm font-bold text-slate-700">
                    {completionText}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Les réponses Oui/Non sont nécessaires
                    pour générer votre analyse.
                  </p>

                </div>

                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="h-12 px-5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >

                    <ArrowLeft size={16} />

                    Retour

                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className={`
                      h-12 px-6 rounded-xl w-full sm:w-auto
                      flex items-center justify-center gap-2
                      text-sm font-bold
                      whitespace-nowrap
                      leading-none
                      transition-all duration-200
                      ${
                        !canSubmit || isSubmitting
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="animate-spin shrink-0"
                        />
                        <span className="whitespace-nowrap">
                          Analyse en cours...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="whitespace-nowrap">
                          Lancer mon analyse
                        </span>

                        <Send
                          size={17}
                          className="shrink-0"
                        />
                      </>
                    )}
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

                  <FileText
                    size={18}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <p className="text-xs font-bold text-slate-800">
                    Analyse presque prête
                  </p>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dernière étape
                  </p>

                </div>

              </div>

              <div className="mt-5">

                <div className="flex items-center justify-between mb-2">

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Progression
                  </span>

                  <span className="text-xs font-bold text-blue-600">
                    {progress}%
                  </span>

                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                  <div className="h-full w-full bg-blue-600 rounded-full" />

                </div>

              </div>

              <div className="mt-5 space-y-3">

                {[
                  "Symptômes",
                  "Déclencheurs",
                  "Évolution",
                  "Informations complémentaires",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >

                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">

                      <Check
                        size={13}
                        strokeWidth={3}
                        className="text-emerald-600"
                      />

                    </div>

                    <span className="text-[11px] font-medium text-slate-600">
                      {item}
                    </span>

                  </div>
                ))}

              </div>

            </div>

            {/* IA */}

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
                  Votre analyse est prête à démarrer
                </h3>

                <p className="text-xs text-blue-100/80 leading-relaxed mt-2">
                  Dentalis IA va utiliser les informations
                  renseignées dans les quatre étapes pour
                  produire votre résultat.
                </p>

              </div>

            </div>

            {/* Confidentialité */}

            <div className="bg-white border border-slate-200/70 rounded-3xl p-5">

              <div className="flex gap-3">

                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">

                  <LockKeyhole
                    size={16}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <p className="text-xs font-bold text-slate-800">
                    Vos informations
                  </p>

                  <p className="text-[11px] leading-relaxed text-slate-400 mt-1.5">
                    Les informations saisies sont utilisées
                    dans le cadre de votre parcours d'analyse.
                  </p>

                </div>

              </div>

            </div>

            {/* Info photo */}

            <div className="rounded-3xl bg-indigo-50 border border-indigo-100 p-5">

              <div className="flex gap-3">

                <Info
                  size={18}
                  className="text-indigo-600 flex-shrink-0 mt-0.5"
                />

                <div>

                  <p className="text-xs font-bold text-indigo-900">
                    Conseil pour la photo
                  </p>

                  <p className="text-[11px] leading-relaxed text-indigo-700/70 mt-1.5">
                    Utilisez une photo nette, suffisamment
                    éclairée et centrée sur la zone concernée.
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
                    Important
                  </p>

                  <p className="text-[11px] leading-relaxed text-amber-700/80 mt-1.5">
                    Dentalis IA fournit une aide à
                    l'orientation et ne remplace pas le
                    diagnostic d'un professionnel dentaire.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6 mb-4">

          <div className="flex items-center gap-2">

            <ShieldCheck
              size={14}
              className="text-emerald-500"
            />

            <p className="text-[11px] text-slate-400">
              Parcours sécurisé
            </p>

          </div>

          <span className="hidden sm:block text-slate-300">
            •
          </span>

          <p className="text-[11px] text-slate-400">
            Étape finale de votre analyse Dentalis IA
          </p>

        </div>

      </main>
    </div>
  );
}




// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import backgroundImage from "../assets/images/1.jpg";

// export default function QuestionnaireStep4({
//   currentStep = 4,
//   totalSteps = 4,
//   onSubmit,
//   onBack,
// }) {
//   const [traitement, setTraitement] = useState(null); // true | false | null
//   const [detailTraitement, setDetailTraitement] = useState("");
//   const [fievre, setFievre] = useState(null);
//   const [photo, setPhoto] = useState(null);
//   const [notes, setNotes] = useState("");

//   const progress = Math.round((currentStep / totalSteps) * 100);

//   const navigate = useNavigate();

//   function handlePhotoChange(e) {
//     const file = e.target.files?.[0];
//     if (file) setPhoto(file);
//   }

//   function handleSubmit() {
//     if (onSubmit) {
//       onSubmit({ traitement, detailTraitement, fievre, photo, notes });
//     }
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
//         <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6">
//           <div
//             className="h-1.5 bg-blue-600 rounded-full transition-all"
//             style={{ width: `${progress}%` }}
//           />
//         </div>

//         <h1 className="text-lg font-semibold text-black">
//           Informations complémentaires
//         </h1>
//         <p className="text-sm text-gray-400 mt-1">
//           Dernière étape avant votre rapport
//         </p>

//         {/* Question 1 : traitement en cours */}
//         <div className="mt-6">
//           <p className="text-sm font-medium text-gray-900">
//             Prenez-vous un traitement médical actuellement ?
//           </p>
//           <div className="flex gap-3 mt-3">
//             <button
//               type="button"
//               onClick={() => setTraitement(true)}
//               className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
//                 traitement === true
//                   ? "bg-blue-600 text-white border-blue-600"
//                   : "border-gray-200 text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               Oui
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setTraitement(false);
//                 setDetailTraitement("");
//               }}
//               className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
//                 traitement === false
//                   ? "bg-blue-600 text-white border-blue-600"
//                   : "border-gray-200 text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               Non
//             </button>
//           </div>

//           {traitement === true && (
//             <input
//               type="text"
//               value={detailTraitement}
//               onChange={(e) => setDetailTraitement(e.target.value)}
//               placeholder="Précisez le traitement (ex : antibiotique, anticoagulant...)"
//               className="w-full mt-3 rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           )}
//         </div>

//         {/* Question 2 : fièvre / gonflement */}
//         <div className="mt-6">
//           <p className="text-sm font-medium text-gray-900">
//             Avez-vous de la fièvre ou un gonflement du visage ?
//           </p>
//           <div className="flex gap-3 mt-3">
//             <button
//               type="button"
//               onClick={() => setFievre(true)}
//               className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
//                 fievre === true
//                   ? "bg-blue-600 text-white border-blue-600"
//                   : "border-gray-200 text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               Oui
//             </button>
//             <button
//               type="button"
//               onClick={() => setFievre(false)}
//               className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
//                 fievre === false
//                   ? "bg-blue-600 text-white border-blue-600"
//                   : "border-gray-200 text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               Non
//             </button>
//           </div>
//         </div>

//         {/* Question 3 : photo */}
//         <div className="mt-6">
//           <p className="text-sm font-medium text-gray-900">
//             Importer une photo de la zone concernée
//           </p>
//           <p className="text-xs text-gray-400 mt-0.5">Optionnel</p>

//           <label className="mt-3 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-6 cursor-pointer hover:bg-gray-50 transition-colors">
//             <span className="text-gray-400 text-xl">📷</span>
//             <span className="text-sm text-gray-500">
//               {photo ? photo.name : "Cliquez pour choisir une photo"}
//             </span>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handlePhotoChange}
//               className="hidden"
//             />
//           </label>
//         </div>

//         {/* Question 4 : notes libres */}
//         <div className="mt-6">
//           <label className="text-sm font-medium text-gray-900">
//             Souhaitez-vous ajouter des précisions ?
//           </label>
//           <textarea
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             placeholder="Écrivez ici toute information utile..."
//             rows={3}
//             className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//           />
//         </div>

//         <div className="flex gap-3 mt-8">
//           {onBack && (
//             <button
//               onClick={onBack}
//               className="flex-1 border border-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Retour
//             </button>
//           )}
//           <button
//             onClick={handleSubmit}
//             className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Obtenir mon rapport
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
