from functools import lru_cache
from supabase import create_client, Client

from .config import settings


@lru_cache(maxsize=1)
def get_admin_client() -> Client:
    """Supabase client with Service Role key (admin operations).
    
    Nota: Para lidar com erros de rede (WinError 10035), use execute_with_retry
    das utils ao executar queries.
    """
    try:
        settings.validate()
        client = create_client(settings.supabase_url, settings.supabase_service_role_key)
        if not client:
            raise RuntimeError("Falha ao criar cliente Supabase")
        return client
    except Exception as e:
        import traceback
        print(f"[ERRO CRÍTICO] Falha ao criar cliente Supabase admin: {e}")
        print(traceback.format_exc())
        raise


@lru_cache(maxsize=1)
def get_public_client() -> Client:
    """Supabase client with anon key (end-user auth/sign-in flows).

    Falls back to service role if anon key not provided.
    """
    url = settings.supabase_url
    key = settings.supabase_anon_key or settings.supabase_service_role_key
    if not url or not key:
        settings.validate()
    return create_client(url, key)
