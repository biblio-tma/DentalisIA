import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  VenusAndMars,
  ShieldCheck,
  Pencil,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  HeartPulse,
  Droplets,
  Stethoscope,
  Activity,
  Lock,
  Sparkles,
  Camera,
  Image,
} from "lucide-react";
import { useAnalyse } from "../hooks/AnalyseContext";

const API_URL = "http://127.0.0.1:8000";

/* ============================================================
   DONNÉES DE DÉMONSTRATION
   ============================================================ */

const DEFAULT_PATIENT = {
  id: "PAT-2026-001",
  nom: "Jean",
  prenom: "Marie",
  adresse: "Douala",
  email: "marie@example.com",
  telephone: "699 000 000",
  age: "25",
  sexe: "Femme",

  // Informations médicales
  groupe_sanguin: "",
  allergies: "",
  antecedents: "",

  // Statistiques
  derniere_analyse: "",
  nombre_analyses: 0,
};

/* ============================================================
   PETIT COMPOSANT POUR LES INFORMATIONS
   ============================================================ */

function InfoItem({
  icon: Icon,
  label,
  value,
  accent = "blue",
}) {
  const accentClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="group flex items-start gap-4 py-4 border-b border-slate-100 last:border-b-0">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          accentClasses[accent] || accentClasses.blue
        }`}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400 mb-1">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-800 break-words">
          {value || "Non renseigné"}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   CHAMP DU FORMULAIRE
   ============================================================ */

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
        {required && (
          <span className="text-blue-600 ml-1">*</span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-12 rounded-xl border border-slate-200 bg-slate-50/70
            text-sm text-slate-800 placeholder:text-slate-400
            outline-none transition-all
            focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
            ${Icon ? "pl-11 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

/* ============================================================
   MODAL DE MODIFICATION
   ============================================================ */

function EditProfileModal({
  patient,
  onClose,
  onSave,
  saving,
}) {
  const [form, setForm] = useState({
    nom: patient?.nom || "",
    prenom: patient?.prenom || "",
    adresse: patient?.adresse || "",
    email: patient?.email || "",
    telephone: patient?.telephone || "",
    age: patient?.age || "",
    sexe: patient?.sexe || "",
  });
const [avatarFile, setAvatarFile] = useState(null);
const [avatarPreview, setAvatarPreview] = useState(
  patient?.avatar || ""
);

  const [formError, setFormError] = useState("");

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, saving]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };


const handleSubmit = async (event) => {
  event.preventDefault();

  const nom = String(form.nom ?? "").trim();
  const prenom = String(form.prenom ?? "").trim();
  const adresse = String(form.adresse ?? "").trim();
  const email = String(form.email ?? "").trim();
  const telephone = String(form.telephone ?? "").trim();
  const age = String(form.age ?? "").trim();
  const sexe = String(form.sexe ?? "").trim();

  if (!nom || !prenom) {
    setFormError("Le nom et le prénom sont obligatoires.");
    return;
  }

  if (!email) {
    setFormError("L'adresse email est obligatoire.");
    return;
  }

  if (!telephone) {
    setFormError("Le numéro de téléphone est obligatoire.");
    return;
  }

  if (!age) {
    setFormError("L'âge est obligatoire.");
    return;
  }

  setFormError("");

  await onSave({
    nom,
    prenom,
    adresse,
    email,
    telephone,
    age,
    sexe,
    avatarFile,
  });
};

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => {
          if (!saving) onClose();
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden bg-white rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden px-6 md:px-8 py-6 border-b border-slate-100">
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Pencil
                  size={20}
                  className="text-white"
                  strokeWidth={2}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Modifier mon profil
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Mettez à jour vos informations personnelles.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="w-10 h-10 rounded-xl flex items-center justify-center
                text-slate-400 hover:text-slate-700 hover:bg-slate-100
                transition disabled:opacity-40"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(92vh-170px)]"
        >
          <div className="p-6 md:p-8 space-y-7">
            {/* Message erreur */}
            {formError && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                <AlertCircle
                  size={19}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />

                <p className="text-sm font-medium text-red-700">
                  {formError}
                </p>
              </div>
            )}
{/* =====================================================
    PHOTO DE PROFIL
    ===================================================== */}
<div>
  <div className="flex items-center gap-2 mb-5">
    <Camera size={17} className="text-blue-600" />

    <h3 className="text-sm font-bold text-slate-800">
      Photo de profil
    </h3>
  </div>

  <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
    {/* Avatar */}
    <div className="relative shrink-0">
      <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Photo de profil"
            className="w-full h-full object-cover"
          />
        ) : (
          <User
            size={42}
            className="text-white"
            strokeWidth={1.5}
          />
        )}
      </div>

      <label
        htmlFor="avatar"
        className="absolute -right-2 -bottom-2 w-10 h-10 rounded-xl
          bg-blue-600 text-white flex items-center justify-center
          cursor-pointer shadow-lg shadow-blue-600/30
          hover:bg-blue-700 hover:scale-105 transition-all"
      >
        <Camera size={17} />

        <input
          id="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (!file) return;

            // 5 Mo maximum
            if (file.size > 5 * 1024 * 1024) {
              setFormError(
                "La photo ne doit pas dépasser 5 Mo."
              );
              return;
            }

            setFormError("");
            setAvatarFile(file);

            const preview = URL.createObjectURL(file);
            setAvatarPreview(preview);
          }}
        />
      </label>
    </div>

    {/* Informations */}
    <div className="text-center sm:text-left">
      <p className="text-sm font-bold text-slate-800">
        Votre photo
      </p>

      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        Ajoutez une photo pour personnaliser votre espace
        patient.
      </p>

      <p className="text-[11px] text-slate-400 mt-2">
        JPG, PNG ou WebP · 5 Mo maximum
      </p>

      {avatarFile && (
        <p className="text-xs font-semibold text-blue-600 mt-2">
          {avatarFile.name}
        </p>
      )}
    </div>
  </div>
</div>
            {/* Identité */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <User size={17} className="text-blue-600" />

                <h3 className="text-sm font-bold text-slate-800">
                  Identité
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Prénom"
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  icon={User}
                  required
                />

                <FormField
                  label="Nom"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  icon={User}
                  required
                />

                <FormField
                  label="Âge"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Votre âge"
                  type="number"
                  icon={Calendar}
                  required
                />

                <div>
                  <label
                    htmlFor="sexe"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Sexe
                  </label>

                  <div className="relative">
                    <VenusAndMars
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <select
                      id="sexe"
                      name="sexe"
                      value={form.sexe}
                      onChange={handleChange}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200
                        bg-slate-50/70 text-sm text-slate-800 outline-none
                        focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                        transition-all appearance-none"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Femme">Femme</option>
                      <option value="Homme">Homme</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Mail size={17} className="text-blue-600" />

                <h3 className="text-sm font-bold text-slate-800">
                  Coordonnées
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Adresse email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  type="email"
                  icon={Mail}
                  required
                />

                <FormField
                  label="Téléphone"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="6XX XXX XXX"
                  type="tel"
                  icon={Phone}
                  required
                />

                <div className="md:col-span-2">
                  <FormField
                    label="Adresse"
                    name="adresse"
                    value={form.adresse}
                    onChange={handleChange}
                    placeholder="Votre ville / adresse"
                    icon={MapPin}
                  />
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <ShieldCheck
                  size={18}
                  className="text-blue-600"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Vos informations sont protégées
                </p>

                <p className="text-xs leading-relaxed text-blue-700/70 mt-1">
                  Les informations de votre profil sont utilisées
                  uniquement pour personnaliser votre expérience
                  Dentalis IA.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 md:px-8 py-4">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="h-12 px-5 rounded-xl border border-slate-200
                  text-sm font-semibold text-slate-600
                  hover:bg-slate-50 transition disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={saving}
                className="h-12 px-6 rounded-xl bg-blue-600 text-white
                  text-sm font-semibold
                  shadow-lg shadow-blue-600/20
                  hover:bg-blue-700 transition
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE PROFIL
   ============================================================ */

export default function ProfilPatient({ onModifier }) {
  const {
    profil: patient,
    profilLoading: loading,
    profilError: error,
    profilSaving: saving,
    modifierProfil,
    historique,
  } = useAnalyse();
  const [success, setSuccess] = useState("");
  const [editOpen, setEditOpen] = useState(false);
const derniereAnalyse = historique[0] || null;

  const handleModifier = () => {
    setSuccess("");

    setEditOpen(true);

    if (typeof onModifier === "function") {
      onModifier();
    }
  };

  const handleSave = async (updatedPatient) => {
    try {
      setSuccess("");

      await modifierProfil(updatedPatient);

      setEditOpen(false);

      setSuccess(
        "Votre profil a été mis à jour avec succès."
      );

      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      // L'erreur est déjà enregistrée dans le Context.
      console.error(
        "Erreur sauvegarde profil :",
        err
      );
    }
  };


  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Loader2
              size={24}
              className="text-white animate-spin"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Chargement de votre profil
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Veuillez patienter...
          </p>
        </div>
      </div>
    );
  }

  /* ==========================================================
     PAGE
     ========================================================== */

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* =====================================================
          HEADER DE PAGE
          ===================================================== */}

      <div className="border-b border-slate-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-7 md:py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="text-slate-400">
                Espace patient
              </span>

              <ChevronRight
                size={13}
                className="text-slate-300"
              />

              <span className="text-blue-600">
                Profil
              </span>
            </div>

            {/* Title */}
            <div className="mt-5 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                    <Sparkles size={12} />
                    ESPACE PERSONNEL
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                  Mon profil patient
                </h1>

                <p className="text-sm md:text-base text-slate-500 mt-2 max-w-2xl">
                  Gérez vos informations personnelles et
                  consultez les données associées à votre
                  parcours bucco-dentaire.
                </p>
              </div>

              {/* Bouton */}
              <button
                type="button"
                onClick={handleModifier}
                className="inline-flex items-center justify-center gap-2 h-12 px-5
                  rounded-xl bg-blue-600 text-white
                  text-sm font-semibold
                  shadow-lg shadow-blue-600/20
                  hover:bg-blue-700 hover:-translate-y-0.5
                  active:translate-y-0
                  transition-all duration-200"
              >
                <Pencil size={17} />
                Modifier mon profil
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENU
          ===================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Message succès */}
        {success && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2
                size={19}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-800">
                Modification enregistrée
              </p>

              <p className="text-xs text-emerald-700/70 mt-0.5">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Message erreur */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle
                size={19}
                className="text-red-600"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-red-800">
                Une erreur est survenue
              </p>

              <p className="text-xs text-red-700/70 mt-0.5">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            HERO PROFIL
            =================================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-slate-950 shadow-xl shadow-slate-900/10">
          {/* Décor */}
          <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-blue-600/25 blur-3xl" />
          <div className="absolute -bottom-40 left-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-2xl">
                  <div className="w-full h-full rounded-[22px] bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <User
                      size={48}
                      className="text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <div className="absolute -right-2 -bottom-2 w-9 h-9 rounded-xl bg-emerald-500 border-4 border-slate-950 flex items-center justify-center">
                  <CheckCircle2
                    size={15}
                    className="text-white"
                  />
                </div>
              </div>

              {/* Identité */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Profil patient
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 truncate">
                  {patient.prenom} {patient.nom}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    {patient.age || "-"} ans
                  </span>

                  <span className="hidden sm:block text-slate-700">
                    •
                  </span>

                  <span className="flex items-center gap-1.5">
                    <VenusAndMars size={15} />
                    {patient.sexe || "Non renseigné"}
                  </span>

                  <span className="hidden sm:block text-slate-700">
                    •
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    {patient.adresse || "Non renseigné"}
                  </span>
                </div>

                {/* Code patient */}
                <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10">
                  <ShieldCheck
                    size={15}
                    className="text-blue-300"
                  />

                  <span className="text-[11px] font-bold tracking-wider text-slate-300">
                    CODE PATIENT
                  </span>

                  <span className="text-xs font-bold text-white">
                    {patient.id
                      ? String(patient.id)
                          .slice(0, 12)
                          .toUpperCase()
                      : "PATIENT"}
                  </span>
                </div>
              </div>

              {/* Stat */}
              <div className="md:w-44 flex-shrink-0">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Activity
                      size={16}
                      className="text-blue-300"
                    />

                    <span className="text-xs font-medium text-slate-400">
                      Analyses réalisées
                    </span>
                  </div>

                  <p className="text-3xl font-bold text-white mt-2">
                    {historique.length ?? 0}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    depuis la création du compte
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            INFORMATIONS
            =================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* -------------------------------------------------
              IDENTITÉ & CONTACT
              ------------------------------------------------- */}

          <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">
            <div className="px-6 md:px-7 py-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Informations personnelles
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Identité &amp; contacts
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <User
                    size={18}
                    className="text-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 md:px-7">
              <InfoItem
                icon={User}
                label="Nom complet"
                value={`${patient.prenom || "-"} ${
                  patient.nom || "-"
                }`}
              />

              <InfoItem
                icon={Mail}
                label="Adresse email"
                value={patient.email}
                accent="violet"
              />

              <InfoItem
                icon={Phone}
                label="Téléphone"
                value={patient.telephone}
                accent="emerald"
              />

              <InfoItem
                icon={MapPin}
                label="Adresse"
                value={patient.adresse}
                accent="amber"
              />

              <InfoItem
                icon={Calendar}
                label="Âge"
                value={
                  patient.age
                    ? `${patient.age} ans`
                    : null
                }
              />

              <InfoItem
                icon={VenusAndMars}
                label="Sexe"
                value={patient.sexe}
                accent="rose"
              />
            </div>
          </section>

          {/* -------------------------------------------------
              INFORMATIONS MÉDICALES
              ------------------------------------------------- */}

          <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">
            <div className="px-6 md:px-7 py-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Données de santé
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Informations médicales
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <HeartPulse
                    size={18}
                    className="text-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 md:px-7">
              <InfoItem
                icon={Droplets}
                label="Groupe sanguin"
                value={
                  patient.groupe_sanguin ||
                  "Non renseigné"
                }
                accent="rose"
              />

              <InfoItem
                icon={ShieldCheck}
                label="Allergies connues"
                value={
                  patient.allergies ||
                  "Non renseigné"
                }
                accent="amber"
              />

              <InfoItem
                icon={Stethoscope}
                label="Antécédents médicaux"
                value={
                  derniereAnalyse?.questionnaire?.evolution[3] ?? "Non renseigné"
                }
                accent="violet"
              />

              <InfoItem
                icon={Activity}
                label="Dernière analyse bucco-dentaire"
                value={
                  derniereAnalyse?.pathologie ??
                  "Aucune analyse"
                }
                accent="blue"
              />

              <InfoItem
                icon={HeartPulse}
                label="Nombre total d'analyses"
                value={`${historique.length ?? 0}`}
                accent="emerald"
              />
            </div>
          </section>
        </div>

        {/* ===================================================
            BLOC SÉCURITÉ
            =================================================== */}

        <section className="mt-6 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <Lock
                size={20}
                className="text-blue-600"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900">
                Vos données personnelles
              </h3>

              <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
                Vos informations sont associées à votre
                espace patient et doivent rester exactes
                afin de garantir une expérience personnalisée.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white px-3 py-2 rounded-xl border border-emerald-100">
              <CheckCircle2 size={15} />
              Profil sécurisé
            </div>
          </div>
        </section>

        {/* ===================================================
            MOBILE BOTTOM SPACE
            =================================================== */}

        <div className="h-6" />
      </main>

      {/* =====================================================
          MODAL
          ===================================================== */}

      {editOpen && (
        <EditProfileModal
          patient={patient}
          onClose={() => {
            if (!saving) {
              setEditOpen(false);
            }
          }}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}





// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// // interface User {
// // nom: string;
// // prenom: string;
// // adresse: string;
// // email: string;
// // telephone: string;
// // age: string;
// // sexe: string;
// // }

// const UserIcon = () => (
//   <svg viewBox="0 0 24 24" className="w-9 h-9 text-blue-600" fill="currentColor">
//     <circle cx="12" cy="8" r="4" />
//     <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
//   </svg>
// );

// function InfoRow({ label, value }) {
//   return (
//     <div className="mb-4 last:mb-0">
//       <p className="text-xs text-gray-400">{label}</p>
//       <p className="text-sm font-semibold text-gray-900 mt-0.5">{value ?? "-"}</p>
//     </div>
//   );
// }

// const API_URL = "http://127.0.0.1:8000";

// export default function ProfilPatient({ onModifier }) {
// const [patient, setPatient] = useState({
//     nom: "jean",
//     prenom: "Marie",
//     adresse: "Douala",
//     email: "marie@example.com",
//     telephone: "699000000",
//     age: "25",
//     sexe: "Femme",
// });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // useEffect(() => {
//   //   async function fetchProfile() {
//       // const token = localStorage.getItem("access_token");

//       // if (!token) {
//       //   setError("Vous n'êtes pas connecté");
//       //   setLoading(false);
//       //   return;
//       // }

//       // try {
//         // const response = await fetch(`${API_URL}/auth/me`, {
//         //   headers: {
//         //     Authorization: `Bearer ${token}`,
//         //   },
//         // });

//         // const data = await response.json();

//         // if (!response.ok) {
//         //   setError(data.detail || "Impossible de charger le profil");
//         //   setLoading(false);
//         //   return;
//         // }

//         // setPatient(data);
//   //     } catch (err) {
//   //       setError("Impossible de contacter le serveur");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }

//   //   fetchProfile();
//   // }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-gray-500">Chargement du profil...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-red-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-10">
//       <div className="max-w-4xl mx-auto">
//         <p className="text-xs font-semibold text-gray-400 tracking-wide mb-4">
//           ESPACE PATIENT{" "}
//           <span className="mx-1 text-gray-300">/</span>{" "}
//           <span className="text-blue-600">PROFIL</span>
//         </p>

//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-xl font-bold text-blue-900">
//                 Mon Profil Patient
//               </h1>
//               <p className="text-sm text-gray-400 mt-1">
//                 Gérez vos informations personnelles et médicales.
//               </p>
//             </div>
//             <button
//               onClick={onModifier}
//               className="bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Modifier mon profil
//             </button>
//           </div>

//           <div className="mt-6 bg-gray-50 rounded-xl p-5 flex items-center gap-5">
//             <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
//               <UserIcon />
//             </div>
//             <div>
//               <p className="text-lg font-bold text-blue-900">
//                 {patient.prenom} {patient.nom}
//               </p>
//               <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">
//                 {patient.age ?? "-"} ans • {patient.sexe ?? "-"} • {patient.adresse ?? "-"}
//               </p>
//               <span className="inline-block mt-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
//                 CODE PATIENT : {patient.id?.slice(0, 8).toUpperCase()}
//               </span>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 mt-6">
//             <div className="bg-white border border-gray-100 rounded-xl p-5">
//               <h2 className="text-xs font-bold text-blue-600 tracking-wide border-b border-blue-100 pb-2 mb-4">
//                 IDENTITÉ &amp; CONTACTS
//               </h2>
//               <InfoRow label="Nom complet" value={`${patient.prenom} ${patient.nom}`} />
//               <InfoRow label="Adresse email" value={patient.email} />
//               <InfoRow label="Téléphone" value={patient.telephone} />
//               <InfoRow label="Âge" value={patient.age} />
//               <InfoRow label="Sexe" value={patient.sexe} />
//             </div>

//             <div className="bg-white border border-gray-100 rounded-xl p-5">
//               <h2 className="text-xs font-bold text-blue-600 tracking-wide border-b border-blue-100 pb-2 mb-4">
//                 INFORMATIONS MÉDICALES
//               </h2>
//               <InfoRow label="Groupe sanguin" value="Non renseigné" />
//               <InfoRow label="Allergies connues" value="Non renseigné" />
//               <InfoRow label="Antécédents médicaux" value="Non renseigné" />
//               <InfoRow label="Dernière analyse bucco-dentaire" value="Aucune analyse" />
//               <InfoRow label="Nombre total d'analyses" value={0} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }