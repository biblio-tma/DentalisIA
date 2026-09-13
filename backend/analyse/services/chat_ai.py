import json
import os

from dotenv import load_dotenv
from google import genai

from analyse.schemas import ChatMessage
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.6-flash",
)

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY est absente du fichier .env"
    )

client = genai.Client(
    api_key=GEMINI_API_KEY
)


SYSTEM_PROMPT = """
Tu es Dentalis IA, un assistant intelligent
d'orientation dentaire.

Tu aides l'utilisateur à comprendre ses symptômes
dentaires et à déterminer le niveau d'urgence.

Tu ne remplaces jamais un dentiste ou un professionnel
de santé.

Tu ne dois jamais présenter une hypothèse comme un
diagnostic certain.

Tu peux :
- expliquer les causes possibles ;
- poser des questions complémentaires ;
- donner des conseils généraux ;
- orienter vers une consultation.

REGLES DE SECURITE :

Considère comme urgente une situation comprenant
notamment :

- difficulté à respirer ;
- difficulté importante à avaler ;
- difficulté à parler ;
- gonflement important du visage ;
- gonflement vers l'œil ou le cou ;
- fièvre associée à un gonflement ;
- pus avec aggravation importante ;
- altération importante de l'état général ;
- saignement important persistant ;
- traumatisme dentaire important.

Dans ces situations, recommande clairement une
prise en charge professionnelle rapide.

Ne prescris jamais de médicament ou de dosage.

Ne recommande jamais de percer ou presser un abcès.

Ne donne jamais de diagnostic définitif.

FORMAT OBLIGATOIRE :

Retourne uniquement un JSON valide :

{
  "message": "...",
  "orientation": "...",
  "urgence": "faible|moderee|urgente"
}

Le champ message doit être une réponse naturelle
en français.

Le champ orientation doit contenir une recommandation
générale.

Le champ urgence doit être exactement :

- faible
- moderee
- urgente

Si les informations sont insuffisantes, pose des
questions complémentaires.

L'orientation fournie est indicative et ne remplace
pas l'avis d'un professionnel de santé.
"""


def build_history(history):

    messages = []

    for item in history[-20:]:
        messages.append(
            f"{item.role}: {item.content}"
        )

    return "\n".join(messages)


def clean_response(text):

    text = text.strip()

    if text.startswith("```"):
        text = text.replace(
            "```json",
            ""
        )
        text = text.replace(
            "```",
            ""
        )

    try:
        return json.loads(text.strip())

    except json.JSONDecodeError:

        return {
            "message": text,
            "orientation": (
                "Cette orientation est indicative "
                "et ne remplace pas l'avis d'un "
                "professionnel de santé."
            ),
            "urgence": "faible",
        }


async def generate_response(
    message: str,
    history: list[ChatMessage],
    image: str | None = None,
):

    history_text = build_history(history)

    prompt = f"""
{SYSTEM_PROMPT}

HISTORIQUE DE LA CONVERSATION :

{history_text}

NOUVEAU MESSAGE DE L'UTILISATEUR :

{message}
"""

    if image:
        prompt += """

Une image dentaire a également été fournie.
Prends-la en compte uniquement comme élément
complémentaire d'orientation.

Ne prétends pas établir un diagnostic visuel
certain à partir de l'image.
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    data = clean_response(
        response.text
    )

    urgence = data.get(
        "urgence",
        "faible"
    )

    if urgence not in [
        "faible",
        "moderee",
        "urgente",
    ]:
        urgence = "faible"

    return {
        "message": str(
            data.get(
                "message",
                "Je n'ai pas pu traiter votre demande."
            )
        ),

        "orientation": str(
            data.get(
                "orientation",
                "Une consultation professionnelle "
                "peut être nécessaire."
            )
        ),

        "urgence": urgence,
    }