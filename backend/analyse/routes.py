import logging
from fastapi import APIRouter, HTTPException, Header
from google.genai import types
from .schemas import ChatRequest, ChatResponse
from .services.chat_ai import generate_response
from .services.analyse_ai import AnalyseDentaire, AnalyseRequest, decode_base64_image, find_image, SYSTEM_PROMPT, build_clinical_context, client, MODEL_NAME
from supabase_client import supabase


router = APIRouter(prefix="/analyse", tags=["analyse"])


logger = logging.getLogger("dentalis")



@router.get("/api/analyses/{user_id}/")
async def recuperer_analyses(user_id: str):

    try:
        response = (
            supabase
            .table("analyse")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "success": True,
            "analyses": response.data
        }

    except Exception as error:
        print("Erreur récupération analyses :", error)

        raise HTTPException(
            status_code=500,
            detail="Impossible de récupérer les analyses."
        )


@router.post(
    "/api/analyse-dentaire",
    response_model=AnalyseDentaire
)
async def analyse_dentaire(
    data: AnalyseRequest
):
    logger.info(
        "Nouvelle demande d'analyse dentaire"
    )

    if not any([
        data.symptomes,
        data.douleur,
        data.evolution,
        data.informations,
    ]):
        raise HTTPException(
            status_code=400,
            detail=(
                "Aucune information clinique "
                "n'a été fournie."
            ),
        )

    # =========================================================
    # IMAGE
    # =========================================================

    image_data = find_image(
        data.informations
    )

    image_part = None

    if image_data:
        logger.info(
            "Une image a été fournie."
        )

        mime_type, image_bytes = (
            decode_base64_image(
                image_data
            )
        )

        max_size = 10 * 1024 * 1024

        if len(image_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail=(
                    "L'image ne doit pas dépasser "
                    "10 Mo."
                ),
            )

        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type
        )

    # =========================================================
    # CONTEXTE CLINIQUE
    # =========================================================

    clinical_context = (
        build_clinical_context(data)
    )

    prompt = f"""
{SYSTEM_PROMPT}

Analyse maintenant les données suivantes :

{clinical_context}

Tu dois retourner :

- pathologie :
    - nom
    - description

- niveau_urgence :
    - niveau
    - description

- conduite_preliminaire :
    - liste d'actions prudentes

- conseils_prevention :
    - liste de conseils adaptés

Le niveau d'urgence doit être exprimé par l'une
des catégories suivantes :

- faible
- modérée
- élevée
- urgente

Ne crée pas de faits qui ne sont pas présents
dans les données.

Si les informations sont insuffisantes pour identifier
une hypothèse suffisamment fiable, indique une hypothèse
prudente et précise que l'examen clinique par un dentiste
est nécessaire.
"""

    contents = [
        types.Part.from_text(
            text=prompt
        )
    ]

    if image_part:
        contents.append(
            image_part
        )

    # =========================================================
    # GEMINI
    # =========================================================

    try:

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
            config=types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json",
                response_schema=AnalyseDentaire,
            ),
        )

    except Exception as error:

        logger.exception(
            "Erreur Gemini"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "Impossible de contacter "
                "le service d'analyse IA."
            ),
        )

    # =========================================================
    # VALIDATION DE LA REPONSE
    # =========================================================

    try:

        if not response.text:
            raise ValueError(
                "Gemini a retourné une réponse vide."
            )

        result = (
            AnalyseDentaire
            .model_validate_json(
                response.text
            )
        )

    except Exception as error:

        logger.exception(
            "Réponse Gemini invalide"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "La réponse de l'IA n'a pas pu "
                "être interprétée correctement."
            ),
        )

    # =========================================================
    # SAUVEGARDE SUPABASE
    # =========================================================

    try:

        questionnaire = {
            "symptomes": data.symptomes,
            "douleur": data.douleur,
            "evolution": data.evolution,
            "informations": data.informations,
        }

        reponse = result.model_dump()

        analyse_data = {
            "user_id": data.user_id,
            "questionnaire": questionnaire,
            "reponse": reponse,
        }

        saved = (
            supabase
            .table("analyse")
            .insert(analyse_data)
            .select("id, user_id, created_at")
            .execute()
        )

        logger.info(
            "Analyse sauvegardée avec succès : %s",
            saved.data
        )

    except Exception as error:

        logger.exception(
            "Erreur lors de la sauvegarde Supabase"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "L'analyse a été générée mais "
                "n'a pas pu être sauvegardée."
            ),
        )

    return result



@router.post(
    "/api/chat",
    response_model=ChatResponse,
)
async def chat(
    request: ChatRequest,
):

    try:

        result = await generate_response(
            message=request.message,
            history=request.history,
            image=request.image,
        )

        return result

    except Exception as error:

        print(
            "Erreur Dentalis IA :",
            error,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Une erreur est survenue "
                "pendant le traitement de votre demande."
            ),
        )