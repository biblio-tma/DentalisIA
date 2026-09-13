import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AnalyseContext = createContext(null);

const API_URL = "http://127.0.0.1:8000";
// ============================================================
// NORMALISATION
// ============================================================

function normalizeAnalyse(row) {
  const reponse = row?.reponse || {};

  const timestamp =
    row?.created_at ||
    row?.updated_at ||
    null;

  const urgence =
    reponse?.niveau_urgence?.niveau ||
    "Non définie";

  const urgenceKey = urgence
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const confiance =
    typeof reponse?.confiance === "number"
      ? Math.round(reponse.confiance)
      : null;

  return {
    ...row,

    timestamp,

    date: timestamp
      ? new Date(timestamp).toLocaleDateString(
          "fr-FR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        )
      : "—",

    pathologie:
      reponse?.pathologie?.nom ||
      "Analyse dentaire",

    description:
      reponse?.pathologie?.description ||
      "",

    urgence,

    urgenceKey,

    confiance,
  };
}

const DEFAULT_PROFIL = {
  id: null,
  nom: "",
  prenom: "",
  adresse: "",
  email: "",
  telephone: "",
  age: "",
  sexe: "",

  // Informations médicales
  groupe_sanguin: "",
  allergies: "",
  antecedents: "",

  // Statistiques
  derniere_analyse: "",
  nombre_analyses: 0,
};
// ============================================================
// PROVIDER
// ============================================================

export function AnalyseProvider({ children }) {

  const [userId, setUserId] = useState(
    () => localStorage.getItem("user_id")
  );
  const [profil, setProfil] =
    useState(DEFAULT_PROFIL);

  const [profilLoading, setProfilLoading] =
    useState(false);

  const [profilError, setProfilError] =
    useState("");

  const [profilCharge, setProfilCharge] =
    useState(false);

  const [profilSaving, setProfilSaving] =
    useState(false);

  const [historique, setHistorique] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [historiqueCharge, setHistoriqueCharge] =
    useState(false);


  const recupererUser = useCallback(() => {
    const id = localStorage.getItem("user_id");

    setUserId(id);

    return id;
  }, []);

  /* ==========================================================
     RÉCUPÉRER LE PROFIL
  ========================================================== */

  const recupererProfil = useCallback(
    async ({ force = false } = {}) => {
      const token =
        localStorage.getItem("access_token");

      if (!token) {
        setProfilError(
          "Vous n'êtes pas connecté."
        );

        return null;
      }

      /*
       * Évite de refaire le GET inutilement.
       * force=true permet de forcer une actualisation.
       */
      if (profilCharge && !force) {
        return profil;
      }

      try {
        setProfilLoading(true);
        setProfilError("");

        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Impossible de récupérer votre profil."
          );
        }

        const profilRecu = {
          ...DEFAULT_PROFIL,
          ...data,
        };
console.log("prof: ", profilRecu)
        setProfil(profilRecu);

        /*
         * Si ton backend renvoie l'id utilisateur,
         * on le synchronise avec userId.
         */
        if (profilRecu.id) {
          setUserId(String(profilRecu.id));
          localStorage.setItem(
            "user_id",
            String(profilRecu.id)
          );
        }

        setProfilCharge(true);

        return profilRecu;
      } catch (err) {
        console.error(
          "Erreur récupération profil :",
          err
        );

        setProfilError(
          err?.message ||
            "Impossible de contacter le serveur."
        );

        throw err;
      } finally {
        setProfilLoading(false);
      }
    },
    [profil, profilCharge]
  );

  /* ==========================================================
     MODIFIER LE PROFIL
  ========================================================== */

const modifierProfil = useCallback(
  async (updatedProfil) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("Vous n'êtes pas connecté.");
    }

    try {
      setProfilSaving(true);
      setProfilError("");

      const formData = new FormData();

      formData.append("nom", updatedProfil.nom || "");
      formData.append("prenom", updatedProfil.prenom || "");
      formData.append("adresse", updatedProfil.adresse || "");
      formData.append("email", updatedProfil.email || "");
      formData.append(
        "telephone",
        updatedProfil.telephone || ""
      );
      formData.append("age", updatedProfil.age || "");
      formData.append("sexe", updatedProfil.sexe || "");

      if (updatedProfil.avatarFile) {
        formData.append(
          "avatar",
          updatedProfil.avatarFile
        );
      }

      const response = await fetch(
        `${API_URL}/auth/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Impossible d'enregistrer les modifications."
        );
      }

      setProfil(data);
      setProfilCharge(true);

      return data;
    } catch (err) {
      console.error(
        "Erreur modification profil :",
        err
      );

      setProfilError(
        err?.message ||
          "Une erreur est survenue lors de la sauvegarde."
      );

      throw err;
    } finally {
      setProfilSaving(false);
    }
  },
  []
);

  useEffect(() => {
    recupererProfil().catch(() => {});
  }, [recupererProfil]);
  // ==========================================================
  // RÉCUPÉRER L'HISTORIQUE
  // ==========================================================

  const recupererHistorique = useCallback(async () => {
    const userId = localStorage.getItem("user_id");

    console.log("👤 user_id :", userId);

    if (!userId) {
      const message = "Utilisateur non identifié.";

      setError(message);
      throw new Error(message);
    }

    try {
      setLoading(true);
      setError("");

      const url =
        `http://127.0.0.1:8000/analyse/api/analyses/${userId}/`;

      console.log("🌐 GET historique :", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log(
        "📡 Statut API historique :",
        response.status
      );

      const data = await response.json();

      console.log(
        "📥 Réponse historique :",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Impossible de récupérer l'historique."
        );
      }

      if (
        !data ||
        data.success !== true ||
        !Array.isArray(data.analyses)
      ) {
        throw new Error(
          "Format de données invalide."
        );
      }

      const analyses = data.analyses
        .map(normalizeAnalyse)
        .sort(
          (a, b) =>
            new Date(b.timestamp || 0) -
            new Date(a.timestamp || 0)
        );

      console.log(
        "📊 Nombre d'analyses reçues :",
        analyses.length
      );

      setHistorique(analyses);

      setHistoriqueCharge(true);

      return analyses;
    } catch (err) {
      console.error(
        "❌ Erreur récupération historique :",
        err
      );

      setError(
        err?.message ||
          "Impossible de récupérer l'historique."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // CHARGEMENT INITIAL
  //
  // Une seule fois lorsque AnalyseProvider est monté.
  // ==========================================================

  useEffect(() => {
    const chargerHistoriqueInitial = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        console.warn(
          "⚠️ Aucun user_id trouvé."
        );
        return;
      }

      try {
        await recupererHistorique();
      } catch (err) {
        console.error(
          "❌ Chargement initial historique :",
          err
        );
      }
    };

    chargerHistoriqueInitial();
  }, [recupererHistorique]);

  // ==========================================================
  // AJOUTER UNE ANALYSE
  // ==========================================================

  const ajouterAnalyse = useCallback((analyse) => {
    if (!analyse) {
      return;
    }

    const analyseNormalisee =
      normalizeAnalyse(analyse);

    setHistorique((previous) => {
      if (
        analyseNormalisee.id &&
        previous.some(
          (item) =>
            item.id === analyseNormalisee.id
        )
      ) {
        return previous;
      }

      return [
        analyseNormalisee,
        ...previous,
      ].sort(
        (a, b) =>
          new Date(b.timestamp || 0) -
          new Date(a.timestamp || 0)
      );
    });

    setHistoriqueCharge(true);
  }, []);

  // ==========================================================
  // DERNIÈRE ANALYSE
  // ==========================================================

  const derniereAnalyse =
    historique.length > 0
      ? historique[0]
      : null;

  // ==========================================================
  // CONTEXT
  // ==========================================================

  const value = useMemo(
    () => ({
      userId,
      recupererUser,

      profil,
      profilLoading,
      profilError,
      profilCharge,
      profilSaving,

      recupererProfil,
      modifierProfil,
      historique,
      setHistorique,

      loading,
      error,

      historiqueCharge,

      derniereAnalyse,

      recupererHistorique,

      ajouterAnalyse,
    }),
    [
      userId,
      recupererUser,

      profil,
      profilLoading,
      profilError,
      profilCharge,
      profilSaving,

      recupererProfil,
      modifierProfil,
      historique,
      loading,
      error,
      historiqueCharge,
      derniereAnalyse,
      recupererHistorique,
      ajouterAnalyse,
    ]
  );

  return (
    <AnalyseContext.Provider value={value}>
      {children}
    </AnalyseContext.Provider>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useAnalyse() {
  const context =
    useContext(AnalyseContext);

  if (!context) {
    throw new Error(
      "useAnalyse doit être utilisé à l'intérieur de AnalyseProvider."
    );
  }

  return context;
}