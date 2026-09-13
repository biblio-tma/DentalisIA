import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Client "public" - utilisé pour l'authentification (signup/login)
supabase_public: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Client "admin" - utilisé pour les opérations backend qui contournent les RLS
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY
)