import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Building2,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";

const centres = [
  {
    name: "Clinique Dentaire Bastos",
    ville: "Yaoundé",
    adresse: "Quartier Bastos, non loin de l'ambassade de France",
    telephone: "677 12 34 56",
    horaires: "Lun–Sam · 8h–18h",
  },
  {
    name: "Cabinet Odonto-Stomatologique Akwa",
    ville: "Douala",
    adresse: "Avenue de Gaulle, Akwa",
    telephone: "694 45 67 89",
    horaires: "Lun–Ven · 8h–17h30",
  },
  {
    name: "Centre de Santé Dentaire Bonapriso",
    ville: "Douala",
    adresse: "Rue des Manguiers, Bonapriso",
    telephone: "699 23 45 12",
    horaires: "Lun–Sam · 7h30–17h",
  },
  {
    name: "Polyclinique Dentaire Mvog-Ada",
    ville: "Yaoundé",
    adresse: "Carrefour Mvog-Ada",
    telephone: "676 89 12 34",
    horaires: "Lun–Ven · 8h–18h30",
  },
  {
    name: "Cabinet Dentaire du Plateau",
    ville: "Bafoussam",
    adresse: "Avenue du Plateau, centre-ville",
    telephone: "691 34 56 78",
    horaires: "Mar–Sam · 8h–16h",
  },
];

const villes = ["Toutes", ...new Set(centres.map((centre) => centre.ville))];

export default function CentresDeSante() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [ville, setVille] = useState("Toutes");

  const centresFiltres = useMemo(() => {
    const recherche = search.trim().toLowerCase();

    return centres.filter((centre) => {
      const correspondVille =
        ville === "Toutes" || centre.ville === ville;

      const correspondRecherche =
        !recherche ||
        centre.name.toLowerCase().includes(recherche) ||
        centre.ville.toLowerCase().includes(recherche) ||
        centre.adresse.toLowerCase().includes(recherche);

      return correspondVille && correspondRecherche;
    });
  }, [search, ville]);

  function resetFilters() {
    setSearch("");
    setVille("Toutes");
  }

  function appeler(telephone) {
    window.location.href = `tel:${telephone.replace(/\s/g, "")}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden bg-[#071B3A]">
        {/* Decorative elements */}
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          {/* Top badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 backdrop-blur-md">
            <Sparkles size={14} />
            Réseau de soins Dentalis IA
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Trouvez un centre dentaire
              <span className="block text-blue-400">
                près de chez vous
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Dentalis IA vous aide à identifier des centres de santé
              dentaire et à accéder rapidement à leurs coordonnées pour
              organiser votre prise en charge.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-4xl">
            <div className="rounded-2xl border border-white/10 bg-white p-2 shadow-2xl shadow-black/20 sm:flex sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
                <Search
                  size={20}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un centre, une ville..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Effacer la recherche"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="my-1 hidden h-8 w-px bg-slate-200 sm:block" />

              <div className="flex items-center gap-2 border-t border-slate-100 px-2 pt-2 sm:border-0 sm:pt-0">
                <SlidersHorizontal
                  size={17}
                  className="ml-2 text-slate-400 sm:hidden"
                />

                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="h-11 w-full cursor-pointer rounded-xl border-0 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none ring-0 sm:w-40"
                >
                  {villes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
                  <Building2 size={19} />
                </div>

                <div>
                  <p className="text-xl font-bold text-white">
                    {centres.length}
                  </p>
                  <p className="text-xs text-slate-400">
                    Centres référencés
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-xl font-bold text-white">
                    {villes.length - 1}
                  </p>
                  <p className="text-xs text-slate-400">
                    Villes couvertes
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-md sm:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Orientation
                  </p>
                  <p className="text-xs text-slate-400">
                    Vers un suivi professionnel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        {/* Section heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Centres de santé
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Centres disponibles
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Consultez les établissements référencés et leurs
              coordonnées pour préparer votre consultation.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <Stethoscope size={17} className="text-blue-600" />

            <span className="text-sm font-semibold text-slate-700">
              {centresFiltres.length}
            </span>

            <span className="text-sm text-slate-400">
              résultat{centresFiltres.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Active filter */}
        {(search || ville !== "Toutes") && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Filtres :
            </span>

            {search && (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Recherche : {search}

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="hover:text-blue-900"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {ville !== "Toutes" && (
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                {ville}

                <button
                  type="button"
                  onClick={() => setVille("Toutes")}
                  className="hover:text-blue-900"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="ml-1 text-xs font-semibold text-slate-500 underline-offset-2 hover:text-blue-600 hover:underline"
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* =====================================================
            CARDS
        ====================================================== */}
        {centresFiltres.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {centresFiltres.map((centre, index) => (
              <article
                key={centre.name}
                className="
                  group relative overflow-hidden
                  rounded-3xl border border-slate-200
                  bg-white
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:shadow-xl hover:shadow-blue-900/10
                "
              >
                {/* Top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

                <div className="p-5 sm:p-6">
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        <Stethoscope size={22} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-base font-extrabold leading-6 text-slate-900">
                          {centre.name}
                        </h3>

                        <div className="mt-1.5 flex items-center gap-1.5">
                          <MapPin
                            size={13}
                            className="shrink-0 text-blue-500"
                          />

                          <span className="text-xs font-bold text-blue-600">
                            {centre.ville}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      Référencé
                    </span>
                  </div>

                  {/* Information */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                        <MapPin size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Adresse
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {centre.adresse}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Phone size={15} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Téléphone
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-slate-700">
                          {centre.telephone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                        <Clock size={15} />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Horaires
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-slate-700">
                          {centre.horaires}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => appeler(centre.telephone)}
                      className="
                        inline-flex h-11 items-center justify-center gap-2
                        rounded-xl
                        border border-slate-200
                        bg-white
                        text-xs font-bold text-slate-700
                        transition-all
                        hover:border-blue-200
                        hover:bg-blue-50
                        hover:text-blue-700
                      "
                    >
                      <Phone size={15} />
                      Appeler
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigate(
                          `/localisation?centre=${encodeURIComponent(centre.name)}`
                        );
                      }}
                      className="
                        inline-flex h-11 items-center justify-center gap-2
                        rounded-xl
                        bg-blue-600
                        text-xs font-bold text-white
                        shadow-lg shadow-blue-600/20
                        transition-all
                        hover:bg-blue-700
                        hover:shadow-xl hover:shadow-blue-600/25
                      "
                    >
                      <Navigation size={15} />
                      Itinéraire
                    </button>
                  </div>

                  {/* Bottom status */}
                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <CheckCircle2
                      size={14}
                      className="shrink-0 text-emerald-500"
                    />

                    <span className="text-[11px] font-medium text-slate-400">
                      Informations disponibles pour orientation
                    </span>

                    <ArrowRight
                      size={13}
                      className="ml-auto text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* ===================================================
             EMPTY STATE
          ==================================================== */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={27} />
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-slate-900">
              Aucun centre trouvé
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Aucun établissement ne correspond à votre recherche.
              Essayez une autre ville ou modifiez votre recherche.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {/* =====================================================
            INFORMATION / DISCLAIMER
        ====================================================== */}
        <section className="mt-10 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <ShieldCheck size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-slate-900">
                Une consultation reste essentielle
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                Les informations affichées servent à faciliter votre
                orientation. Dentalis IA ne remplace pas l'examen et
                l'avis d'un professionnel de santé dentaire.
              </p>
            </div>

            <div className="shrink-0 rounded-xl border border-blue-100 bg-white/80 px-4 py-2.5 text-xs font-bold text-blue-700">
              Orientation médicale
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}




// import React from "react";
// import { MapPin, Phone, Clock } from "lucide-react";

// const centres = [
//   { name: "Clinique Dentaire Bastos", ville: "Yaoundé", adresse: "Quartier Bastos, non loin de l'ambassade de France", telephone: "677 12 34 56", horaires: "Lun–Sam · 8h–18h" },
//   { name: "Cabinet Odonto-Stomatologique Akwa", ville: "Douala", adresse: "Avenue de Gaulle, Akwa", telephone: "694 45 67 89", horaires: "Lun–Ven · 8h–17h30" },
//   { name: "Centre de Santé Dentaire Bonapriso", ville: "Douala", adresse: "Rue des Manguiers, Bonapriso", telephone: "699 23 45 12", horaires: "Lun–Sam · 7h30–17h" },
//   { name: "Polyclinique Dentaire Mvog-Ada", ville: "Yaoundé", adresse: "Carrefour Mvog-Ada", telephone: "676 89 12 34", horaires: "Lun–Ven · 8h–18h30" },
//   { name: "Cabinet Dentaire du Plateau", ville: "Bafoussam", adresse: "Avenue du Plateau, centre-ville", telephone: "691 34 56 78", horaires: "Mar–Sam · 8h–16h" },
// ];

// export default function CentresDeSante() {
//   return (
//     <div className="min-h-screen bg-white font-sans">
//       <section className="max-w-5xl mx-auto px-8 py-20">
//         <span className="text-sm font-semibold text-blue-600">Centres de santé</span>
//         <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Nos centres partenaires</h1>
//         <p className="text-gray-600 max-w-2xl mb-12">
//           Dentalis AI vous oriente vers des centres de santé partenaires
//           proches de chez vous pour un suivi professionnel.
//         </p>

//         <div className="grid grid-cols-2 gap-6">
//           {centres.map((c) => (
//             <div key={c.name} className="p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
//               <h3 className="font-semibold text-gray-900 mb-1">{c.name}</h3>
//               <p className="text-sm text-blue-600 font-medium mb-3">{c.ville}</p>
//               <div className="space-y-2 text-sm text-gray-500">
//                 <div className="flex items-start gap-2">
//                   <MapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />
//                   <span>{c.adresse}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone size={15} className="text-gray-400" />
//                   <span>{c.telephone}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Clock size={15} className="text-gray-400" />
//                   <span>{c.horaires}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }