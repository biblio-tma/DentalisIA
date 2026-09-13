import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
  Car,
  Footprints,
  LocateFixed,
  Route,
  CheckCircle2,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =========================================================
   CENTRES
========================================================= */

const centres = [
  {
    name: "Clinique Dentaire Bastos",
    ville: "Yaoundé",
    adresse:
      "Quartier Bastos, non loin de l'ambassade de France",
    telephone: "677 12 34 56",
    horaires: "Lun–Sam · 8h–18h",

    // Exemple : À remplacer par les coordonnées EXACTES
    latitude: 3.8915,
    longitude: 11.5154,
  },

  {
    name: "Cabinet Odonto-Stomatologique Akwa",
    ville: "Douala",
    adresse: "Avenue de Gaulle, Akwa",
    telephone: "694 45 67 89",
    horaires: "Lun–Ven · 8h–17h30",

    // Exemple : À remplacer par les coordonnées EXACTES
    latitude: 4.0511,
    longitude: 9.6914,
  },

  {
    name: "Centre de Santé Dentaire Bonapriso",
    ville: "Douala",
    adresse: "Rue des Manguiers, Bonapriso",
    telephone: "699 23 45 12",
    horaires: "Lun–Sam · 7h30–17h",

    latitude: 4.0186,
    longitude: 9.6954,
  },

  {
    name: "Polyclinique Dentaire Mvog-Ada",
    ville: "Yaoundé",
    adresse: "Carrefour Mvog-Ada",
    telephone: "676 89 12 34",
    horaires: "Lun–Ven · 8h–18h30",

    latitude: 3.8615,
    longitude: 11.5287,
  },

  {
    name: "Cabinet Dentaire du Plateau",
    ville: "Bafoussam",
    adresse: "Avenue du Plateau, centre-ville",
    telephone: "691 34 56 78",
    horaires: "Mar–Sam · 8h–16h",

    latitude: 5.4781,
    longitude: 10.4177,
  },
];

/* =========================================================
   ICONES LEAFLET
========================================================= */

const userIcon = new L.DivIcon({
  className: "custom-user-marker",
  html: `
    <div style="
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #2563eb;
      border: 4px solid white;
      box-shadow: 0 6px 20px rgba(37,99,235,.35);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:20px;
    ">
      ●
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

const destinationIcon = new L.DivIcon({
  className: "custom-destination-marker",
  html: `
    <div style="
      width: 46px;
      height: 46px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background: #ef4444;
      border: 4px solid white;
      box-shadow: 0 6px 20px rgba(239,68,68,.35);
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <div style="
        transform: rotate(45deg);
        color:white;
        font-size:20px;
      ">
        ●
      </div>
    </div>
  `,
  iconSize: [46, 46],
  iconAnchor: [23, 46],
});

/* =========================================================
   RECENTRAGE DE LA CARTE
========================================================= */

function FitRoute({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length < 2) return;

    const bounds = L.latLngBounds(positions);

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 16,
    });
  }, [positions, map]);

  return null;
}

/* =========================================================
   FORMAT DISTANCE
========================================================= */

function formatDistance(meters) {
  if (!meters) return "--";

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}

/* =========================================================
   FORMAT DUREE
========================================================= */

function formatDuration(seconds) {
  if (!seconds) return "--";

  const minutes = Math.round(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return `${hours} h ${remaining} min`;
}

/* =========================================================
   COMPOSANT PRINCIPAL
========================================================= */

export default function Localisation() {
  const [searchParams] = useSearchParams();

  const centreName = searchParams.get("centre");

  const centre = useMemo(() => {
    if (!centreName) return null;

    return centres.find(
      (item) =>
        item.name.toLowerCase() ===
        centreName.toLowerCase()
    );
  }, [centreName]);

  const [userPosition, setUserPosition] =
    useState(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState([]);

  const [distance, setDistance] = useState(null);

  const [duration, setDuration] = useState(null);

  const [travelMode, setTravelMode] =
    useState("driving");

  const [loadingLocation, setLoadingLocation] =
    useState(true);

  const [loadingRoute, setLoadingRoute] =
    useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     POSITION GPS
  ======================================================= */

  function obtenirPosition() {
    if (!navigator.geolocation) {
      setError(
        "La géolocalisation n'est pas supportée par votre navigateur."
      );

      setLoadingLocation(false);

      return;
    }

    setLoadingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoadingLocation(false);
      },

      () => {
        setError(
          "Impossible d'obtenir votre position. Autorisez la localisation dans votre navigateur."
        );

        setLoadingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  /* =======================================================
     OBTENIR POSITION AU CHARGEMENT
  ======================================================= */

  useEffect(() => {
    obtenirPosition();
  }, []);

  /* =======================================================
     CALCUL ITINERAIRE REEL
  ======================================================= */

  async function calculerItineraire() {
    if (!userPosition || !centre) return;

    setLoadingRoute(true);
    setError("");

    try {
      /*
       * OSRM utilise :
       *
       * longitude,latitude
       */

      const profile =
        travelMode === "walking"
          ? "foot"
          : "car";

      const url =
        `https://router.project-osrm.org/route/v1/${profile}/` +
        `${userPosition.longitude},${userPosition.latitude};` +
        `${centre.longitude},${centre.latitude}` +
        `?overview=full&geometries=geojson`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Erreur lors du calcul de l'itinéraire."
        );
      }

      const data = await response.json();

      if (
        !data.routes ||
        data.routes.length === 0
      ) {
        throw new Error(
          "Aucun itinéraire trouvé."
        );
      }

      const route = data.routes[0];

      /*
       * OSRM retourne :
       * [longitude, latitude]
       *
       * Leaflet attend :
       * [latitude, longitude]
       */

      const coordinates =
        route.geometry.coordinates.map(
          ([longitude, latitude]) => [
            latitude,
            longitude,
          ]
        );

      setRouteCoordinates(coordinates);

      setDistance(route.distance);

      setDuration(route.duration);
    } catch (err) {
      console.error(err);

      setError(
        "Impossible de calculer l'itinéraire réel. Vérifiez votre connexion Internet."
      );
    } finally {
      setLoadingRoute(false);
    }
  }

  /* =======================================================
     RECALCUL AUTOMATIQUE
  ======================================================= */

  useEffect(() => {
    if (!userPosition || !centre) return;

    calculerItineraire();
  }, [
    userPosition,
    centre,
    travelMode,
  ]);

  /* =======================================================
     GOOGLE MAPS
  ======================================================= */

  function ouvrirGoogleMaps() {
    if (!centre) return;

    const destination =
      `${centre.latitude},${centre.longitude}`;

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${encodeURIComponent(
        destination
      )}` +
      `&travelmode=${travelMode}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  /* =======================================================
     TELEPHONE
  ======================================================= */

  function appeler() {
    if (!centre) return;

    window.location.href =
      `tel:${centre.telephone.replace(
        /\s/g,
        ""
      )}`;
  }

  /* =======================================================
     CENTRE INEXISTANT
  ======================================================= */

  if (!centre) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-5">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MapPin size={28} />
            </div>

            <h1 className="mt-6 text-2xl font-black">
              Aucun centre sélectionné
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Sélectionnez d'abord un centre de santé
              afin d'afficher son itinéraire.
            </p>

            <Link
              to="/centres"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white"
            >
              <MapPin size={17} />
              Voir les centres
            </Link>

          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          <Link
            to="/centres"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Retour aux centres
          </Link>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
            <ShieldCheck
              size={15}
              className="text-emerald-500"
            />
            Navigation sécurisée
          </div>

        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#071B3A]">

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-blue-100">
              <Route size={14} />
              Navigation GPS
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Votre itinéraire
              <span className="block text-blue-400">
                en temps réel
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Visualisez votre position actuelle et
              l'itinéraire routier réel vers le centre
              de santé sélectionné.
            </p>

          </div>

        </div>

      </section>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* =================================================
              CARTE REELLE
          ================================================== */}

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="relative h-[500px]">

              {loadingLocation && (
                <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm">

                  <div className="flex flex-col items-center">

                    <Loader2
                      className="animate-spin text-blue-600"
                      size={35}
                    />

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      Localisation en cours...
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Autorisez l'accès à votre position GPS
                    </p>

                  </div>

                </div>
              )}

              {error && (
                <div className="absolute left-4 right-4 top-4 z-[1000] rounded-2xl border border-red-200 bg-white p-4 shadow-xl">

                  <div className="flex gap-3">

                    <AlertCircle
                      className="shrink-0 text-red-500"
                      size={20}
                    />

                    <div>

                      <p className="text-sm font-bold text-red-700">
                        Navigation indisponible
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {error}
                      </p>

                    </div>

                  </div>

                </div>
              )}

              <MapContainer
                center={[
                  centre.latitude,
                  centre.longitude,
                ]}
                zoom={14}
                scrollWheelZoom={true}
                className="h-full w-full"
              >

                {/* =================================================
                    OPENSTREETMAP
                ================================================== */}

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* POSITION UTILISATEUR */}

                {userPosition && (
                  <Marker
                    position={[
                      userPosition.latitude,
                      userPosition.longitude,
                    ]}
                    icon={userIcon}
                  >
                    <Popup>
                      <strong>
                        Votre position
                      </strong>
                    </Popup>
                  </Marker>
                )}

                {/* CENTRE */}

                <Marker
                  position={[
                    centre.latitude,
                    centre.longitude,
                  ]}
                  icon={destinationIcon}
                >

                  <Popup>

                    <div>
                      <strong>
                        {centre.name}
                      </strong>

                      <br />

                      <span>
                        {centre.adresse}
                      </span>

                    </div>

                  </Popup>

                </Marker>

                {/* ITINERAIRE REEL */}

                {routeCoordinates.length > 0 && (
                  <>
                    <Polyline
                      positions={routeCoordinates}
                      pathOptions={{
                        color: "#2563eb",
                        weight: 7,
                        opacity: 0.9,
                      }}
                    />

                    <FitRoute
                      positions={
                        routeCoordinates
                      }
                    />
                  </>
                )}

              </MapContainer>

              {/* =================================================
                  MAP INFO
              ================================================== */}

              <div className="absolute bottom-4 left-4 right-4 z-[999]">

                <div className="rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur">

                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Route size={20} />
                      </div>

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Itinéraire réel
                        </p>

                        <div className="mt-1 flex items-center gap-3">

                          <span className="text-sm font-black text-slate-900">
                            {formatDistance(distance)}
                          </span>

                          <span className="text-slate-300">
                            •
                          </span>

                          <span className="text-sm font-bold text-slate-600">
                            {formatDuration(duration)}
                          </span>

                        </div>

                      </div>

                    </div>

                    <button
                      onClick={obtenirPosition}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <RefreshCw size={14} />
                      Actualiser
                    </button>

                  </div>

                </div>

              </div>

            </div>

            {/* BOTTOM MAP */}

            <div className="border-t border-slate-100 p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={20} />
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Destination
                  </p>

                  <h2 className="mt-1 text-base font-extrabold">
                    {centre.name}
                  </h2>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              SIDEBAR
          ================================================== */}

          <aside className="space-y-5">

            {/* CENTRE */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="flex items-start gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Navigation size={21} />
                </div>

                <div className="min-w-0">

                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">

                    <CheckCircle2 size={11} />

                    Centre référencé

                  </span>

                  <h2 className="mt-2 text-lg font-black leading-6">
                    {centre.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-blue-600">

                    <MapPin size={13} />

                    {centre.ville}

                  </div>

                </div>

              </div>

              <div className="mt-6 space-y-3">

                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">

                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-slate-500"
                  />

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Adresse
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {centre.adresse}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">

                  <Phone
                    size={17}
                    className="shrink-0 text-slate-500"
                  />

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Téléphone
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {centre.telephone}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">

                  <Clock
                    size={17}
                    className="shrink-0 text-slate-500"
                  />

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Horaires
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {centre.horaires}
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={appeler}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Phone size={15} />
                  Appeler
                </button>

                <button
                  type="button"
                  onClick={ouvrirGoogleMaps}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                >
                  <Navigation size={15} />
                  Navigation
                </button>

              </div>

            </div>

            {/* MODE DE TRANSPORT */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <h3 className="text-sm font-extrabold">
                Mode de déplacement
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                L'itinéraire sera recalculé selon votre choix.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setTravelMode("driving")
                  }
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition ${
                    travelMode === "driving"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <Car size={20} />

                  <span className="text-xs font-bold">
                    Voiture
                  </span>

                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTravelMode("walking")
                  }
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition ${
                    travelMode === "walking"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >

                  <Footprints size={20} />

                  <span className="text-xs font-bold">
                    À pied
                  </span>

                </button>

              </div>

            </div>

            {/* RESUME */}

            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">

              <div className="flex items-start gap-3">

                <LocateFixed
                  size={19}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>

                  <h3 className="text-xs font-extrabold text-blue-900">
                    Navigation GPS
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-blue-700/80">
                    La carte utilise votre position GPS et
                    calcule un itinéraire routier réel vers
                    le centre sélectionné.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}