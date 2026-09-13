from fastapi import APIRouter, HTTPException, Header, File, Form, UploadFile
from supabase_client import supabase_public, supabase_admin
from auth.schemas import SignUpRequest, LoginRequest, ProfileUpdate

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
def signup(payload: SignUpRequest):
    try:
        response = supabase_admin.auth.admin.create_user({
            "email": payload.email,
            "password": payload.password,
            "email_confirm": True,
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    user = response.user
    if not user:
        raise HTTPException(status_code=400, detail="Échec de la création du compte")

    # Créer le profil dans la table users
    supabase_admin.table("users").insert({
        "id": user.id,
        "nom": payload.nom,
        "prenom": payload.prenom,
        "email": payload.email,
        "telephone": payload.telephone,
        "sexe": payload.sexe,
        "adresse": payload.adresse,
        "age": payload.age,
    }).execute()

    return {
        "message": "Compte créé avec succès",
        "user_id": user.id,
    }

@router.post("/login")
def login(payload: LoginRequest):
    try:
        response = supabase_public.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password,
        })
    except Exception:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user_id": response.user.id,
        "user": response.user
    }


@router.get("/google")
def login_with_google():
    response = supabase_public.auth.sign_in_with_oauth({
        "provider": "google",
        "options": {
            "redirect_to": "http://127.0.0.1:8000/auth/callback"
        }
    })
    return {"url": response.url}


@router.get("/callback")
def auth_callback(code: str):
    response = supabase_public.auth.exchange_code_for_session({"auth_code": code})
    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user_id": response.user.id
    }


@router.get("/me")
def get_profile(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")

    try:
        user_response = supabase_public.auth.get_user(token)
        user = user_response.user
    except Exception:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

    profile = supabase_admin.table("users").select("*").eq("id", user.id).single().execute()

    return profile.data



BEARER_PREFIX = "Bearer "

@router.put("/me")
async def update_profile(
    nom: str = Form(...),
    prenom: str = Form(...),
    adresse: str = Form(""),
    email: str = Form(...),
    telephone: str = Form(...),
    age: str = Form(...),
    sexe: str = Form(""),
    avatar: UploadFile | None = File(None),
    authorization: str = Header(...),
):
    # =========================================================
    # AUTHENTIFICATION
    # =========================================================

    print("\n======================================")
    print("🔐 PUT /auth/me")
    print("Authorization reçue :", bool(authorization))
    print(
        "Authorization début :",
        authorization[:35] + "..."
        if authorization
        else None
    )
    print(
        "Longueur Authorization :",
        len(authorization)
        if authorization
        else 0
    )
    print("======================================")

    if not authorization.startswith(BEARER_PREFIX):
        print("❌ Format Authorization invalide")

        raise HTTPException(
            status_code=401,
            detail="Format Authorization invalide"
        )

    token = authorization[
        len(BEARER_PREFIX):
    ].strip()

    print(
        "Token début :",
        token[:30] + "..."
        if token
        else None
    )

    print(
        "Longueur token :",
        len(token)
    )

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Token manquant"
        )
    try:
        user_response = supabase_public.auth.get_user(token)

        print(
            "Supabase user :",
            user_response.user
        )

        user = user_response.user

    except HTTPException:
        raise

    except Exception as e:
        print(
            "❌ ERREUR SUPABASE AUTH :",
            repr(e)
        )

        raise HTTPException(
            status_code=503,
            detail="Le service d'authentification Supabase est temporairement inaccessible."
        )

    if not user:
        print("❌ Aucun utilisateur trouvé pour ce token")

        raise HTTPException(
            status_code=401,
            detail="Utilisateur non authentifié"
        )

    # =========================================================
    # SUITE
    # =========================================================

    update_data = {
        "nom": nom.strip(),
        "prenom": prenom.strip(),
        "adresse": adresse.strip(),
        "email": email.strip(),
        "telephone": telephone.strip(),
        "age": age,
        "sexe": sexe,
    }

    print("👤 User ID :", user.id)
    print(
        "🖼️ Avatar reçu :",
        avatar.filename if avatar else "Aucun"
    )

    # ... garde ensuite ton code avatar et update