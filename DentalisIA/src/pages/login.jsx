import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logoIdeal1.png";
import backgroundImage from "../assets/images/dentist2.png";

function ToothLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#2f6fed">
      <path d="M12 2c-3 0-6 2-6 6 0 3 1 5 1.5 8s1 6 3 6c1.5 0 2-3 2.5-5 .5 2 1 5 2.5 5 2 0 2.5-3 3-6s1.5-5 1.5-8c0-4-3-6-6-6-1 0-1.5.4-2 .4S13 2 12 2Z" />
    </svg>
  );
}

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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5Z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.2-17.1 10.3Z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.7 27 35.5 24 35.5c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.9 39.6 16.4 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.5 5.5C40.9 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5Z" />
    </svg>
  );
}

const API_URL = "http://127.0.0.1:8000";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Email ou mot de passe incorrect");
        setLoading(false);
        return;
      }

      // Stocke le token pour les futures requêtes
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user", data.user);
      console.log("user: ", data.user)

      navigate("/dashboard");
    } catch (err) {
      setError("Impossible de contacter le serveur");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const response = await fetch(`${API_URL}/auth/google`);
      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      setError("Impossible de contacter le serveur");
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-sm bg-white/80 rounded-2xl shadow-xl border border-white/60 p-8">
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

        <h1 className="text-xl font-bold text-center text-slate-900">Bienvenue !</h1>
        <p className="text-sm text-slate-600 text-center mt-1 mb-6">
          Connectez-vous à votre compte
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@mail.com"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
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
            <div className="text-right mt-1.5">
              <a href="#" className="text-xs text-blue-600 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Se souvenir de moi
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-slate-300" />
          <span className="text-xs text-slate-500">ou continuer avec</span>
          <div className="h-px flex-1 bg-slate-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-slate-300 rounded-lg py-2.5 text-sm font-medium text-slate-700 bg-white/90 hover:bg-white transition-colors"
        >
          <GoogleIcon />
          Se connecter avec Google
        </button>

        <p className="text-center text-sm text-slate-600 mt-6">
          Vous n'avez pas de compte ?{" "}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}