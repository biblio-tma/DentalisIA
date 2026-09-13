import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logoIdeal1.png";
import backgroundImage from "../assets/images/dentition2.jpg";

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.9 17.9A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.6 20.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a20.6 20.6 0 0 1-2.68 3.68M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <path d="m3 6.5 9 6 9-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const FIELD =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90";
const LABEL = "block text-sm font-medium text-slate-700 mb-1.5";

const API_URL = "http://127.0.0.1:8000";

function calculateAge(dateString) {
  if (!dateString) return null;
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
  nom: "",
  prenom: "",
  sexe: "",
  dateNaissance: "",
  telephone: "",
  adresse: "",
  email: "",
  motDePasse: "",

  });

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const age = calculateAge(form.dateNaissance);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.motDePasse,
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone || null,
          sexe: form.sexe || null,
          adresse: form.adresse || null,
          age: age,
      }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Erreur lors de la création du compte");
        setLoading(false);
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Impossible de contacter le serveur");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-xl border border-white/60 p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-2">
            <img
              src={logo}
              alt="Logo Dentalis AI"
              className="w-9 h-9 object-contain"
            />
            <strong className="text-xl text-slate-900">DentalisIA</strong>
          </span>
        </div>

        <h1 className="text-xl font-bold text-center text-slate-900">Créer un compte</h1>
        <p className="text-sm text-slate-600 text-center mt-1 mb-6">
          Rejoignez DentalisIA
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             {/* nom */}
            <div>
              <label htmlFor="nom" className={LABEL}>Nom</label>
              <input
                id="nom"
                type="text"
                value={form.nom}
                onChange={update("nom")}
                className={FIELD}
              />
            </div>

             {/* Prénom */}
            <div>
              <label htmlFor="prenom" className={LABEL}>Prénom</label>
              <input
                id="prenom"
                type="text"
                value={form.prenom}
                onChange={update("prenom")}
                className={FIELD}
              />
            </div>
          </div>

           {/* Sexe */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sexe" className={LABEL}>Sexe</label>
              <div className="relative">
                <select
                  id="sexe"
                  value={form.sexe}
                  onChange={update("sexe")}
                  className={`${FIELD} appearance-none pr-9 text-slate-700`}
                >
                  <option value="" disabled>Sélectionner</option>
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                  <option value="autre">Autre</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
             {/* Date de naissance */}
            <div>
              <label htmlFor="dateNaissance" className={LABEL}>Date de naissance</label>
              <div className="relative">
                <input
                  id="dateNaissance"
                  type="date"
                  value={form.dateNaissance}
                  onChange={update("dateNaissance")}
                  className={`${FIELD} pr-9 text-slate-700`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <CalendarIcon />
                </span>
              </div>
            </div>
          </div>
          {/* Adresse */}
          <div>
            <label htmlFor="adresse" className={LABEL}>Adresse</label>
              <input
                id="adresse"
                type="text"
                placeholder="Yaoundé, Cameroun"
                value={form.adresse}
                onChange={update("adresse")}
               className={FIELD}
              />
            </div>

           {/* Téléphone */}
          <div>
            <label htmlFor="telephone" className={LABEL}>Téléphone</label>
            <input
              id="telephone"
              type="tel"
              placeholder="+237 XXX XXX XXX"
              value={form.telephone}
              onChange={update("telephone")}
              className={FIELD}
            />
          </div>

          <div>
            <label htmlFor="email" className={LABEL}>Email</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                <MailIcon />
              </span>
              <input
                id="email"
                type="email"
                placeholder="exemple@mail.com"
                value={form.email}
                onChange={update("email")}
                className={`${FIELD} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="motDePasse" className={LABEL}>Mot de passe</label>
            <div className="relative">
              <input
                id="motDePasse"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.motDePasse}
                onChange={update("motDePasse")}
                className={`${FIELD} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-60"
          >
            {loading ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}