import React, { useState } from "react";
import {
  LayoutDashboard,
  FilePlus,
  History,
  MapPin,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../assets/images/logoIdeal.png";
import { useAnalyse } from "../hooks/AnalyseContext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profil: patient,
  } = useAnalyse();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Tableau de bord",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Nouvelle analyse",
      icon: FilePlus,
      path: "/question1",
    },
    {
      name: "Historique",
      icon: History,
      path: "/historique",
    },
    {
      name: "Centres de santé",
      icon: MapPin,
      path: "/centresdeSante",
    },
    {
      name: "Centre d'aide",
      icon: MessageSquare,
      path: "/chat",
    },
  ];

  const isItemActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    if (path === "/question1") {
      return location.pathname.startsWith("/question");
    }

    return location.pathname === path;
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f8fc] font-sans text-slate-800">

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[285px]
          max-w-[88vw]
          flex-col
          border-r
          border-white/10
          bg-[#071a33]
          text-white
          shadow-[20px_0_60px_rgba(7,26,51,0.18)]
          transition-transform
          duration-300
          ease-out
          lg:translate-x-0

          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* ---------------------------------------------------------
            BRAND
        --------------------------------------------------------- */}
        <div className="flex h-[88px] shrink-0 items-center justify-between border-b border-white/[0.07] px-6">

          <button
            type="button"
            onClick={() => handleNavigation("/dashboard")}
            className="flex min-w-0 items-center gap-3.5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-2 shadow-lg ring-1 ring-white/10">
              <img
                src={logo}
                alt="Dentalis IA"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0 text-left">
              <p className="truncate text-[17px] font-bold tracking-tight text-white">
                Dentalis IA
              </p>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-blue-300/80">
                Santé dentaire
              </p>
            </div>
          </button>

          {/* Close mobile */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Fermer le menu"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ---------------------------------------------------------
            NAVIGATION
        --------------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto px-4 py-7">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Navigation
          </p>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    gap-3.5
                    rounded-2xl
                    px-3.5
                    py-3.5
                    text-left
                    text-[13px]
                    font-semibold
                    transition-all
                    duration-200

                    ${
                      active
                        ? "bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.28)]"
                        : "text-slate-400 hover:bg-white/[0.055] hover:text-white"
                    }
                  `}
                >

                  {/* Active indicator */}
                  {active && (
                    <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-blue-300" />
                  )}

                  <span
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      transition-all

                      ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-white/[0.045] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-blue-300"
                      }
                    `}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>

                  <span className="min-w-0 flex-1 truncate">
                    {item.name}
                  </span>

                  {active && (
                    <ChevronRight className="h-4 w-4 shrink-0 text-blue-200" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* -------------------------------------------------------
              INFORMATION CARD
          ------------------------------------------------------- */}
          {/* <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">

            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-[18px] w-[18px]" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Votre santé
                </p>

                <p className="text-[10px] text-slate-500">
                  Suivi intelligent
                </p>
              </div>
            </div>

            <p className="text-[11px] leading-5 text-slate-500">
              Analysez vos symptômes et suivez l’évolution de votre santé
              dentaire depuis votre espace personnel.
            </p>
          </div> */}
        </div>

        {/* ---------------------------------------------------------
            USER / LOGOUT
        --------------------------------------------------------- */}
        <div className="shrink-0 border-t border-white/[0.07] p-4">

          <button
            type="button"
            onClick={() => handleNavigation("/profil")}
            className="mb-2 flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition hover:bg-white/[0.055]"
          >
<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-700 ring-1 ring-white/10">
  {patient?.avatar ? (
    <img
      src={patient.avatar}
      alt={`${patient?.prenom || ""} ${patient?.nom || ""}`}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
      <User
        size={20}
        className="text-white"
        strokeWidth={1.8}
      />
    </div>
  )}

  <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#071a33] bg-emerald-400" />
</div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {patient?.prenom || ""} {patient?.nom || ""}
              </p>

              <p className="truncate text-[10px] text-slate-500">
                Mon profil
              </p>
            </div>

            <ChevronRight className="h-4 w-4 text-slate-600" />
          </button>

<button
  type="button"
  onClick={() => {
    closeSidebar();

    // Supprime toutes les données du localStorage
    localStorage.clear();

    // Redirection vers la connexion
    navigate("/login", { replace: true });
  }}
  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
>
  <LogOut className="h-[17px] w-[17px]" />
  Déconnexion
</button>
        </div>
      </aside>

      {/* =========================================================
          MAIN AREA
      ========================================================= */}
      <div className="min-h-screen lg:pl-[285px]">

        {/* ---------------------------------------------------------
            HEADER
        --------------------------------------------------------- */}
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#f6f8fc]/90 backdrop-blur-xl">

          <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">

            {/* Left */}
            <div className="flex min-w-0 items-center gap-3">

              {/* Mobile menu */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Ouvrir le menu"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                  Espace personnel
                </p>

                <h2 className="truncate text-sm font-bold text-slate-900 sm:mt-0.5 sm:text-base">
                  {location.pathname === "/dashboard"
                    ? "Tableau de bord"
                    : navItems.find((item) => isItemActive(item.path))
                        ?.name || "Dentalis IA"}
                </h2>
              </div>
            </div>

            {/* Right */}
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">

              {/* Notification */}
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
              >
                <Bell className="h-[18px] w-[18px]" />

                <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              <div className="hidden h-7 w-px bg-slate-200 sm:block" />

              {/* Profile */}
              <button
                type="button"
                onClick={() => navigate("/profil")}
                className="group flex items-center gap-2.5 rounded-xl p-1 transition hover:bg-white"
              >
<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-700 ring-1 ring-white/10">
  {patient?.avatar ? (
    <img
      src={patient.avatar}
      alt={`${patient?.prenom || ""} ${patient?.nom || ""}`}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
      <User
        size={20}
        className="text-white"
        strokeWidth={1.8}
      />
    </div>
  )}

  <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#071a33] bg-emerald-400" />
</div>

                <div className="hidden min-w-0 text-left md:block">
                  <p className="max-w-[100px] truncate text-xs font-bold text-slate-800">
                    {patient?.prenom || ""} {patient?.nom || ""}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Patient
                  </p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------
            PAGE CONTENT
        --------------------------------------------------------- */}
        <main className="min-h-[calc(100vh-72px)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9 xl:px-10">
          <div className="mx-auto w-full max-w-[1500px] min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}