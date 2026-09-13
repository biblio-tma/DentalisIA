import os
import base64
import binascii
import logging
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from google import genai


# ============================================================
# CONFIGURATION
# ============================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "La variable GEMINI_API_KEY est absente du fichier .env"
    )


MODEL_NAME = "gemini-3.6-flash"


# ============================================================
# LOGGING
# ============================================================

logging.basicConfig(
    level=logging.INFO,
)

logger = logging.getLogger("dentalis")


# ============================================================
# CLIENT GEMINI
# ============================================================

client = genai.Client(
    api_key=GEMINI_API_KEY
)







# ============================================================
# MODELES D'ENTREE
# ============================================================

class AnalyseRequest(BaseModel):
    user_id: str

    symptomes: List[str] = Field(
        default_factory=list
    )

    douleur: List[str] = Field(
        default_factory=list
    )

    evolution: List[str] = Field(
        default_factory=list
    )

    informations: List[str] = Field(
        default_factory=list
    )


# ============================================================
# MODELES DE SORTIE
# ============================================================

class Pathologie(BaseModel):

    nom: str = Field(
        description=(
            "Nom de l'affection ou hypothèse clinique "
            "la plus probable. Ne pas présenter comme "
            "un diagnostic certain."
        )
    )

    description: str = Field(
        description=(
            "Description claire et compréhensible "
            "de l'hypothèse clinique."
        )
    )


class NiveauUrgence(BaseModel):

    niveau: str = Field(
        description=(
            "Niveau d'urgence : faible, modérée, "
            "élevée ou urgente."
        )
    )

    description: str = Field(
        description=(
            "Explication de la raison du niveau "
            "d'urgence et des signes d'alerte éventuels."
        )
    )


class AnalyseDentaire(BaseModel):

    pathologie: Pathologie

    niveau_urgence: NiveauUrgence

    conduite_preliminaire: List[str] = Field(
        description=(
            "Mesures préliminaires prudentes que "
            "le patient peut suivre avant une consultation."
        )
    )

    conseils_prevention: List[str] = Field(
        description=(
            "Conseils de prévention dentaire pertinents "
            "pour la situation décrite."
        )
    )


# ============================================================
# VALIDATION IMAGE BASE64
# ============================================================

def decode_base64_image(
    image_data: str
):
    """
    Transforme une image de type :

    data:image/png;base64,AAAA...

    en bytes exploitables par Gemini.
    """

    if not image_data:
        return None

    if not image_data.startswith(
        "data:image/"
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Le format de l'image doit être "
                "une Data URI image base64."
            ),
        )

    try:

        header, encoded = image_data.split(
            ",",
            1
        )

        mime_type = (
            header
            .split(";")[0]
            .replace(
                "data:",
                ""
            )
        )

        image_bytes = base64.b64decode(
            encoded,
            validate=True
        )

        return (
            mime_type,
            image_bytes
        )

    except (
        ValueError,
        binascii.Error
    ) as error:

        logger.error(
            "Erreur décodage image: %s",
            error
        )

        raise HTTPException(
            status_code=400,
            detail="Image base64 invalide."
        )


# ============================================================
# EXTRACTION DE L'IMAGE
# ============================================================

def find_image(
    informations: List[str]
):
    """
    Recherche automatiquement une Data URI
    parmi les informations reçues.
    """

    for information in informations:

        if isinstance(
            information,
            str
        ) and information.startswith(
            "data:image/"
        ):

            return information

    return None


# ============================================================
# NETTOYAGE DES DONNEES
# ============================================================

def clean_information_list(
    values: List[str]
):

    cleaned = []

    for value in values:

        if not isinstance(
            value,
            str
        ):
            continue

        value = value.strip()

        if not value:
            continue

        # On ne transmet pas le gros base64
        # dans le texte du prompt.
        if value.startswith(
            "data:image/"
        ):
            continue

        cleaned.append(
            value
        )

    return cleaned


# ============================================================
# CONSTRUCTION DU CONTEXTE CLINIQUE
# ============================================================

def build_clinical_context(
    data: AnalyseRequest
):

    symptomes = clean_information_list(
        data.symptomes
    )

    douleur = clean_information_list(
        data.douleur
    )

    evolution = clean_information_list(
        data.evolution
    )

    informations = clean_information_list(
        data.informations
    )

    return f"""
DONNÉES DU PATIENT
==================

SYMPTÔMES
---------
{chr(10).join(f"- {item}" for item in symptomes)
if symptomes else "- Aucun symptôme renseigné."}


DOULEUR
-------
{chr(10).join(f"- {item}" for item in douleur)
if douleur else "- Aucune information sur la douleur."}


ÉVOLUTION
---------
{chr(10).join(f"- {item}" for item in evolution)
if evolution else "- Aucune information sur l'évolution."}


AUTRES INFORMATIONS
-------------------
{chr(10).join(f"- {item}" for item in informations)
if informations else "- Aucune autre information."}
"""


# ============================================================
# PROMPT MEDICAL
# ============================================================

SYSTEM_PROMPT = """
Tu es Dentalis IA, un assistant spécialisé dans
l'orientation dentaire.

Ta mission est d'analyser les informations fournies
par un patient afin de produire une ORIENTATION
DENTAIRE INDICATIVE.

IMPORTANT :

1. Tu ne dois jamais présenter ton analyse comme
   un diagnostic médical certain.

2. Tu dois distinguer :
   - les symptômes observés ;
   - les hypothèses ou affections possibles ;
   - les situations nécessitant une consultation.

3. Tu dois tenir compte de tous les éléments fournis.

4. Si une image est fournie, analyse uniquement ce qui
   est réellement observable sur l'image.
   Ne prétends jamais voir des éléments qui ne sont
   pas clairement visibles.

5. Une image seule ne permet généralement pas de poser
   un diagnostic dentaire définitif.

6. Si plusieurs pathologies sont possibles, indique
   l'hypothèse la plus cohérente avec les informations
   disponibles, tout en restant prudent.

7. Le niveau d'urgence doit être déterminé selon les
   symptômes et signes d'alerte.

8. Une difficulté à respirer, avaler ou parler,
   un gonflement important ou qui progresse rapidement,
   une atteinte importante du visage ou du cou,
   une altération importante de l'état général ou
   d'autres signes sévères doivent conduire à recommander
   une prise en charge urgente.

9. Ne recommande pas de traitement médicamenteux
   nécessitant une prescription ou une décision médicale
   spécifique.

10. Les conseils doivent rester prudents et adaptés
    à une orientation pré-consultation.

11. Réponds en français.

12. Le résultat doit être directement compréhensible
    par un patient non professionnel de santé.

13. Ne fais pas de diagnostic définitif.

14. Utilise exactement la structure JSON demandée.
"""