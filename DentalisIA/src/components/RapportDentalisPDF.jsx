import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

/* -------------------------------------------------------------------------- */
/* STYLES                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({

  page: {
    backgroundColor: "#F5F7FB",
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    color: "#172033",
  },

  /* ---------------------------------------------------------------------- */
  /* HEADER                                                                  */
  /* ---------------------------------------------------------------------- */

  header: {
    backgroundColor: "#0A2E61",
    padding: 22,
    borderRadius: 12,
    marginBottom: 20,
  },

  logo: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  logoAccent: {
    color: "#60A5FA",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 9,
    color: "#C9D8EF",
  },

  reportMeta: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#315487",
  },

  reportMetaText: {
    fontSize: 8,
    color: "#D8E4F5",
    marginBottom: 3,
  },


  patientCard: {
    backgroundColor: "#F7F9FC",
    border: "1 solid #E2E8F0",
    borderRadius: 10,
    padding: 16,
    marginBottom: 18,
  },

  patientGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  patientItem: {
    width: "50%",
    marginBottom: 10,
    paddingRight: 10,
  },

  label: {
    fontSize: 8,
    color: "#94A3B8",
    marginBottom: 3,
  },

  value: {
    fontSize: 10,
    color: "#1E293B",
    fontWeight: 600,
  },


  /* ---------------------------------------------------------------------- */
  /* INTRO                                                                   */
  /* ---------------------------------------------------------------------- */

  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#172033",
    marginBottom: 5,
  },

  description: {
    fontSize: 9,
    color: "#64748B",
    lineHeight: 1.5,
    marginBottom: 17,
  },

  /* ---------------------------------------------------------------------- */
  /* GENERAL SECTION                                                         */
  /* ---------------------------------------------------------------------- */

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    padding: 16,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0A2E61",
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 8,
    color: "#94A3B8",
    marginBottom: 11,
  },

  /* ---------------------------------------------------------------------- */
  /* ANALYSE                                                                 */
  /* ---------------------------------------------------------------------- */

  resultBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 10,
    padding: 14,
  },

  resultLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#2563EB",
    textTransform: "uppercase",
    marginBottom: 5,
  },

  resultTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#172033",
    marginBottom: 7,
  },

  resultText: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.5,
  },

  /* ---------------------------------------------------------------------- */
  /* URGENCE                                                                 */
  /* ---------------------------------------------------------------------- */

  urgencyBox: {
    marginTop: 10,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 9,
    padding: 12,
  },

  urgencyLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#C2410C",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  urgencyValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9A3412",
    marginBottom: 5,
  },

  urgencyDescription: {
    fontSize: 8.5,
    color: "#7C2D12",
    lineHeight: 1.45,
  },

  /* ---------------------------------------------------------------------- */
  /* LISTES                                                                  */
  /* ---------------------------------------------------------------------- */

  listItem: {
    flexDirection: "row",
    marginBottom: 7,
  },

  bullet: {
    width: 14,
    fontSize: 9,
    fontWeight: "bold",
    color: "#0A2E61",
  },

  listText: {
    flex: 1,
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.45,
  },

  /* ---------------------------------------------------------------------- */
  /* QUESTIONNAIRE                                                           */
  /* ---------------------------------------------------------------------- */

  questionnaireSection: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 9,
    marginBottom: 9,
    overflow: "hidden",
  },

  questionnaireHeader: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  questionnaireTitle: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#172033",
  },

  questionnaireDescription: {
    marginTop: 3,
    fontSize: 7.5,
    color: "#94A3B8",
  },

  questionnaireBody: {
    padding: 10,
  },

  response: {
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 5,
    fontSize: 8.5,
    color: "#1E40AF",
  },

  emptyResponse: {
    fontSize: 8,
    color: "#94A3B8",
    fontStyle: "italic",
  },

    photoContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 9,
    },

    photoTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#172033",
    marginBottom: 8,
    },

    photo: {
    width: "100%",
    height: 240,
    objectFit: "contain",
    borderRadius: 7,
    backgroundColor: "#F1F5F9",
    },

  /* ---------------------------------------------------------------------- */
  /* RECOMMANDATION                                                          */
  /* ---------------------------------------------------------------------- */

  recommendationBox: {
    backgroundColor: "#0A2E61",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  recommendationTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },

  recommendationText: {
    fontSize: 8.5,
    color: "#DCE8F8",
    lineHeight: 1.5,
  },

  /* ---------------------------------------------------------------------- */
  /* AVERTISSEMENT                                                           */
  /* ---------------------------------------------------------------------- */

  warning: {
    backgroundColor: "#FFF7ED",
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
    borderRadius: 7,
    padding: 12,
    marginBottom: 15,
  },

  warningTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#C2410C",
    marginBottom: 4,
  },

  warningText: {
    fontSize: 8,
    color: "#7C2D12",
    lineHeight: 1.45,
  },

  /* ---------------------------------------------------------------------- */
  /* FOOTER                                                                  */
  /* ---------------------------------------------------------------------- */

  footer: {
    marginTop: "auto",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  footerText: {
    fontSize: 7.5,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 1.4,
  },

});

/* -------------------------------------------------------------------------- */
/* COMPOSANT LISTE                                                           */
/* -------------------------------------------------------------------------- */

function ResponseList({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Text style={styles.emptyResponse}>
        Aucune réponse renseignée pour cette section.
      </Text>
    );
  }

  const textResponses = data.filter(
    (item) =>
      !(
        typeof item === "string" &&
        item.startsWith("data:image/")
      )
  );

  if (textResponses.length === 0) {
    return (
      <Text style={styles.emptyResponse}>
        Aucune réponse textuelle renseignée.
      </Text>
    );
  }

  return (
    <View>
      {textResponses.map((item, index) => (
        <Text
          key={index}
          style={styles.response}
        >
          {String(item)}
        </Text>
      ))}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPOSANT SECTION QUESTIONNAIRE                                           */
/* -------------------------------------------------------------------------- */

function QuestionnaireSection({
  number,
  title,
  description,
  data,
}) {

  return (

    <View style={styles.questionnaireSection}>

      <View style={styles.questionnaireHeader}>

        <Text style={styles.questionnaireTitle}>
          {number} — {title}
        </Text>

        <Text style={styles.questionnaireDescription}>
          {description}
        </Text>

      </View>

      <View style={styles.questionnaireBody}>

        <ResponseList data={data} />

      </View>

    </View>

  );
}

/* -------------------------------------------------------------------------- */
/* COMPOSANT LISTE ANALYSE                                                   */
/* -------------------------------------------------------------------------- */

function AnalysisList({ items }) {

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <Text style={styles.emptyResponse}>
        Aucune information disponible.
      </Text>
    );
  }

  return (

    <View>

      {items.map((item, index) => (

        <View
          key={index}
          style={styles.listItem}
        >

          <Text style={styles.bullet}>
            ✓
          </Text>

          <Text style={styles.listText}>
            {item}
          </Text>

        </View>

      ))}

    </View>

  );
}

function getBase64Image(data) {
  if (!Array.isArray(data)) return null;

  return data.find(
    (item) =>
      typeof item === "string" &&
      item.startsWith("data:image/")
  );
}

/* -------------------------------------------------------------------------- */
/* DOCUMENT PDF                                                              */
/* -------------------------------------------------------------------------- */

export default function RapportDentalisPDF({
  questionnaire,
  analyse,
  reportId,
  patient,
}) {

  const date = new Date().toLocaleString("fr-FR");

  const data = questionnaire || {};

  const photo = getBase64Image(data.informations);

  return (

    <Document>

      {/* ================================================================== */}
      {/* PAGE 1                                                             */}
      {/* ================================================================== */}

      <Page
        size="A4"
        style={styles.page}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.logo}>
            Dentalis
            <Text style={styles.logoAccent}>
              {" "}IA
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Rapport intelligent d'orientation dentaire
          </Text>

          <View style={styles.reportMeta}>

            <Text style={styles.reportMetaText}>
              Rapport N° {reportId}
            </Text>

            <Text style={styles.reportMetaText}>
              Généré le {date}
            </Text>

          </View>

        </View>


<View style={styles.patientCard}>
  <Text style={styles.sectionTitle}>
    Informations du patient
  </Text>

  <View style={styles.patientGrid}>

    <View style={styles.patientItem}>
      <Text style={styles.label}>
        Nom complet
      </Text>

      <Text style={styles.value}>
        {patient?.prenom || ""} {patient?.nom || ""}
      </Text>
    </View>

    <View style={styles.patientItem}>
      <Text style={styles.label}>
        Email
      </Text>

      <Text style={styles.value}>
        {patient?.email || "Non renseigné"}
      </Text>
    </View>

    <View style={styles.patientItem}>
      <Text style={styles.label}>
        Téléphone
      </Text>

      <Text style={styles.value}>
        {patient?.telephone || "Non renseigné"}
      </Text>
    </View>

    <View style={styles.patientItem}>
      <Text style={styles.label}>
        Adresse
      </Text>

      <Text style={styles.value}>
        {patient?.adresse || "Non renseignée"}
      </Text>
    </View>

  </View>
</View>


        {/* INTRO */}

        <Text style={styles.title}>
          Rapport personnalisé
        </Text>

        <Text style={styles.description}>
          Ce rapport présente une synthèse des informations
          renseignées dans le questionnaire Dentalis IA,
          accompagnée d'une orientation indicative,
          d'une estimation du niveau d'urgence et de
          recommandations générales.
        </Text>

        {/* ================================================================ */}
        {/* RESULTAT                                                         */}
        {/* ================================================================ */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            01 — Orientation clinique
          </Text>

          <Text style={styles.sectionSubtitle}>
            Résultat indicatif basé sur les informations déclarées
          </Text>

          <View style={styles.resultBox}>

            <Text style={styles.resultLabel}>
              Pathologie suspectée
            </Text>

            <Text style={styles.resultTitle}>
              {analyse?.diagnostic ||
                "Orientation non déterminée"}
            </Text>

            <Text style={styles.resultText}>
              {analyse?.description ||
                "Les informations recueillies nécessitent une évaluation par un professionnel de santé."}
            </Text>

          </View>

          {/* URGENCE */}

          <View style={styles.urgencyBox}>

            <Text style={styles.urgencyLabel}>
              Niveau d'urgence estimé
            </Text>

            <Text style={styles.urgencyValue}>
              {analyse?.niveauUrgence ||
                "Non déterminé"}
            </Text>

            <Text style={styles.urgencyDescription}>
              {analyse?.urgenceDescription ||
                "Le niveau d'urgence doit être confirmé par un professionnel de santé."}
            </Text>

          </View>

        </View>

        {/* ================================================================ */}
        {/* CONDUITE PRELIMINAIRE                                             */}
        {/* ================================================================ */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            02 — Conduite préliminaire
          </Text>

          <Text style={styles.sectionSubtitle}>
            Mesures générales proposées en attendant une évaluation professionnelle
          </Text>

          <AnalysisList
            items={analyse?.traitement}
          />

        </View>

        {/* ================================================================ */}
        {/* PREVENTION                                                        */}
        {/* ================================================================ */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            03 — Conseils de prévention
          </Text>

          <Text style={styles.sectionSubtitle}>
            Bonnes pratiques de prévention bucco-dentaire
          </Text>

          <AnalysisList
            items={analyse?.prevention}
          />

        </View>

        {/* FOOTER */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            Dentalis IA — Assistant intelligent d'orientation dentaire
          </Text>

          <Text style={styles.footerText}>
            Document généré automatiquement
          </Text>

        </View>

      </Page>

      {/* ================================================================== */}
      {/* PAGE 2                                                             */}
      {/* ================================================================== */}

      <Page
        size="A4"
        style={styles.page}
      >

        {/* HEADER COURT */}

        <View style={styles.header}>

          <Text style={styles.logo}>
            Dentalis
            <Text style={styles.logoAccent}>
              {" "}IA
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Données détaillées de l'évaluation
          </Text>

        </View>

        {/* ================================================================ */}
        {/* QUESTIONNAIRE                                                     */}
        {/* ================================================================ */}

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            04 — Données du questionnaire
          </Text>

          <Text style={styles.sectionSubtitle}>
            Réponses prises en compte pour l'orientation générée
          </Text>

          {/* -------------------------------------------------------------- */}
          {/* Q1                                                              */}
          {/* -------------------------------------------------------------- */}

          <QuestionnaireSection
            number="04.1"
            title="Vos symptômes actuels"
            description="Symptômes déclarés au début de l'évaluation."
            data={data.symptomes}
          />

          {/* -------------------------------------------------------------- */}
          {/* Q2                                                              */}
          {/* -------------------------------------------------------------- */}

          <QuestionnaireSection
            number="04.2"
            title="Précisons votre douleur"
            description="Informations renseignées concernant la douleur ressentie."
            data={data.douleur}
          />

          {/* -------------------------------------------------------------- */}
          {/* Q3                                                              */}
          {/* -------------------------------------------------------------- */}

          <QuestionnaireSection
            number="04.3"
            title="L'évolution de vos symptômes"
            description="Informations concernant l'évolution de votre état."
            data={data.evolution}
          />

          {/* -------------------------------------------------------------- */}
          {/* Q4                                                              */}
          {/* -------------------------------------------------------------- */}

          <QuestionnaireSection
            number="04.4"
            title="Quelques dernières informations"
            description="Dernières informations fournies dans le questionnaire."
            data={data.informations}
          />
        {photo && (
        <View style={styles.photoContainer}>
            <Text style={styles.photoTitle}>
            Photo de la zone concernée
            </Text>

            <Image
            src={photo}
            style={styles.photo}
            />
        </View>
        )}

        </View>

        {/* ================================================================ */}
        {/* RECOMMANDATION                                                    */}
        {/* ================================================================ */}

        <View style={styles.recommendationBox}>

          <Text style={styles.recommendationTitle}>
            05 — Prochaine étape recommandée
          </Text>

          <Text style={styles.recommendationText}>
            {analyse?.recommandation ||
              "Une consultation auprès d'un professionnel de santé est recommandée afin de confirmer l'orientation et déterminer la prise en charge appropriée."}
          </Text>

        </View>

        {/* ================================================================ */}
        {/* AVERTISSEMENT                                                     */}
        {/* ================================================================ */}

        <View style={styles.warning}>

          <Text style={styles.warningTitle}>
            Important — Limites de l'analyse
          </Text>

          <Text style={styles.warningText}>
            Dentalis IA fournit une orientation indicative à
            partir des informations déclarées dans le questionnaire.
            Ce rapport ne constitue pas un diagnostic médical et
            ne remplace pas l'examen clinique, l'avis ou la prise
            en charge d'un chirurgien-dentiste ou d'un autre
            professionnel de santé qualifié.
          </Text>

        </View>

        {/* FOOTER */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            Dentalis IA — Rapport d'orientation dentaire
          </Text>

          <Text style={styles.footerText}>
            Rapport N° {reportId} • {date}
          </Text>

        </View>

      </Page>

    </Document>

  );
}