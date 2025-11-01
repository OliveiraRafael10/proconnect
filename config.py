import os
from dataclasses import dataclass
from typing import List

from dotenv import load_dotenv, find_dotenv, dotenv_values


@dataclass
class Settings:
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""
    cors_origins: str = "*"
    env_loaded: List[str] = None
    # Cookie settings
    cookie_domain: str = None
    cookie_secure: bool = True
    cookie_samesite: str = "Lax"  # 'Lax' | 'Strict' | 'None'
    cookie_max_age: int = 60 * 60 * 24 * 7  # 7 days

    def __post_init__(self) -> None:
        # Carrega valores do ambiente após dotenv ter sido aplicado
        self.supabase_url = os.getenv("SUPABASE_URL", "").strip()
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY", "").strip()
        self.supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
        self.supabase_jwt_secret = os.getenv("SUPABASE_JWT_SECRET", "").strip()
        self.cors_origins = os.getenv("CORS_ORIGINS", "*")
        # cookies
        self.cookie_domain = os.getenv("COOKIE_DOMAIN") or None
        self.cookie_secure = (os.getenv("COOKIE_SECURE", "true").lower() == "true")
        self.cookie_samesite = os.getenv("COOKIE_SAMESITE", "Lax")
        try:
            self.cookie_max_age = int(os.getenv("COOKIE_MAX_AGE", str(self.cookie_max_age)))
        except Exception:
            pass

    def validate(self) -> None:
        missing = []
        if not self.supabase_url:
            missing.append("SUPABASE_URL")
        if not self.supabase_service_role_key:
            missing.append("SUPABASE_SERVICE_ROLE_KEY")
        if not self.supabase_jwt_secret:
            missing.append("SUPABASE_JWT_SECRET")
        if missing:
            raise RuntimeError(
                f"Missing required environment variables: {', '.join(missing)}"
            )

def _load_env_files() -> list:
    loaded = []
    # Try backend/.env first
    backend_env = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(backend_env):
        load_dotenv(backend_env, override=True)
        # fallback defensivo: carrega manualmente e injeta
        kv = dotenv_values(backend_env)
        for k, v in kv.items():
            if v is not None:
                os.environ[k] = str(v)
        loaded.append(backend_env)
    # Then try project root .env
    root_env = find_dotenv(usecwd=True)
    if root_env and root_env not in loaded:
        load_dotenv(root_env, override=True)
        kv = dotenv_values(root_env)
        for k, v in kv.items():
            if v is not None:
                os.environ[k] = str(v)
        loaded.append(root_env)
    return loaded


# Load env on import
_loaded = _load_env_files()
settings = Settings()
settings.env_loaded = _loaded
