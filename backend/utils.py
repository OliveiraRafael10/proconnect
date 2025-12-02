from typing import Any, Dict, Optional, List, Callable, TypeVar
import os
import base64
import time

from flask import jsonify

T = TypeVar('T')


def ok(data: Any, status: int = 200):
    return jsonify(data), status


def fail(message: str, status: int = 400):
    return jsonify({"error": message}), status


def execute_with_retry(
    func: Callable[[], T],
    max_attempts: int = 3,
    delay: float = 0.3,
    retry_on_network_error: bool = True
) -> T:
    """Executa uma função com retry automático para erros de rede.
    
    Args:
        func: Função a ser executada (deve retornar o resultado da query)
        max_attempts: Número máximo de tentativas
        delay: Delay entre tentativas em segundos
        retry_on_network_error: Se True, retenta apenas em erros de rede
    
    Returns:
        Resultado da função
    
    Raises:
        Exception: Se todas as tentativas falharem
    """
    last_exception = None
    
    for attempt in range(max_attempts):
        try:
            return func()
        except Exception as e:
            last_exception = e
            error_str = str(e)
            
            # Verifica se é erro de rede
            is_network_error = (
                "WinError 10035" in error_str or
                "10035" in error_str or
                "ReadError" in error_str or
                "socket" in error_str.lower() or
                "network" in error_str.lower() or
                "connection" in error_str.lower() or
                "timeout" in error_str.lower()
            )
            
            # Se não for erro de rede e retry_on_network_error=True, não retenta
            if retry_on_network_error and not is_network_error:
                raise
            
            # Se for última tentativa, levanta exceção
            if attempt == max_attempts - 1:
                raise
            
            # Aguarda antes de tentar novamente
            time.sleep(delay * (attempt + 1))  # Backoff exponencial
    
    # Nunca deve chegar aqui, mas por segurança
    raise last_exception if last_exception else Exception("Erro desconhecido")


def to_int(value: Optional[str], default: int = 0) -> int:
    try:
        return int(value) if value is not None else default
    except Exception:
        return default


def paginate_params(args) -> Dict[str, int]:
    page = max(to_int(args.get("page"), 1), 1)
    page_size = min(max(to_int(args.get("page_size"), 20), 1), 100)
    offset = (page - 1) * page_size
    return {"page": page, "page_size": page_size, "offset": offset, "limit": page_size}


# -------------------- Worker Profile helpers --------------------
# Monta objeto perfil_worker agregando tabelas: perfil_worker, worker_categorias, worker_portfolio
def build_worker_profile_batch(admin_client, user_ids: List[str]) -> Dict[str, Dict[str, Any]]:
    """Busca perfis de worker em lote para múltiplos usuários.
    
    Args:
        admin_client: Cliente admin do Supabase
        user_ids: Lista de IDs de usuários
    
    Returns:
        Dicionário mapeando user_id -> perfil_worker
    """
    if not admin_client or not user_ids:
        return {}
    
    result_map = {}
    
    try:
        # Buscar todos os perfis de uma vez
        perfis_base = execute_with_retry(
            lambda: admin_client.table("perfil_worker")
                .select("*")
                .in_("user_id", user_ids)
                .execute()
                .data or [],
            max_attempts=2,
            delay=0.2
        )
        
        # Buscar todas as categorias de uma vez
        worker_categorias = execute_with_retry(
            lambda: admin_client.table("worker_categorias")
                .select("user_id, categoria_id")
                .in_("user_id", user_ids)
                .execute()
                .data or [],
            max_attempts=2,
            delay=0.2
        )
        
        # Buscar todos os portfolios de uma vez
        portfolios = execute_with_retry(
            lambda: admin_client.table("worker_portfolio")
                .select("user_id, id, url")
                .in_("user_id", user_ids)
                .order("id")
                .execute()
                .data or [],
            max_attempts=2,
            delay=0.2
        )
        
        # Obter IDs de categorias únicos
        categoria_ids = list({wc.get("categoria_id") for wc in worker_categorias if wc.get("categoria_id")})
        categorias_map = {}
        if categoria_ids:
            try:
                cats = execute_with_retry(
                    lambda: admin_client.table("categorias")
                        .select("id, nome")
                        .in_("id", categoria_ids)
                        .execute()
                        .data or [],
                    max_attempts=2,
                    delay=0.2
                )
                categorias_map = {c.get("id"): c.get("nome") for c in cats if c.get("id") and c.get("nome")}
            except Exception:
                categorias_map = {}
        
        # Agrupar dados por user_id
        categorias_por_user = {}
        for wc in worker_categorias:
            user_id = wc.get("user_id")
            cat_id = wc.get("categoria_id")
            if user_id and cat_id:
                if user_id not in categorias_por_user:
                    categorias_por_user[user_id] = []
                cat_nome = categorias_map.get(cat_id)
                if cat_nome:
                    categorias_por_user[user_id].append(cat_nome)
        
        portfolio_por_user = {}
        for p in portfolios:
            user_id = p.get("user_id")
            if user_id:
                if user_id not in portfolio_por_user:
                    portfolio_por_user[user_id] = []
                portfolio_por_user[user_id].append({
                    "id": p.get("id"),
                    "url": p.get("url")
                })
        
        # Montar perfis
        for base in perfis_base:
            user_id = base.get("user_id")
            if not user_id:
                continue
            
            disponibilidade = {
                "segunda": bool(base.get("disp_segunda")),
                "terca": bool(base.get("disp_terca")),
                "quarta": bool(base.get("disp_quarta")),
                "quinta": bool(base.get("disp_quinta")),
                "sexta": bool(base.get("disp_sexta")),
                "sabado": bool(base.get("disp_sabado")),
                "domingo": bool(base.get("disp_domingo")),
            }
            
            result_map[user_id] = {
                "descricao": base.get("descricao"),
                "experiencia": base.get("experiencia"),
                "disponibilidade": disponibilidade,
                "categorias": categorias_por_user.get(user_id, []),
                "portfolio": portfolio_por_user.get(user_id, []),
            }
    except Exception as e:
        import traceback
        print(f"[AVISO] Erro ao buscar perfis em lote: {e}")
        traceback.print_exc()
    
    return result_map


def build_worker_profile(admin_client, user_id: str) -> Optional[Dict[str, Any]]:
    if not admin_client or not user_id:
        return None
    
    # Tentar buscar perfil_worker com retry para lidar com WinError 10035
    base = None
    max_tentativas = 2
    for tentativa in range(max_tentativas):
        try:
            base = (
                admin_client.table("perfil_worker")
                .select("*")
                .eq("user_id", user_id)
                .single()
                .execute()
                .data
            )
            break  # Sucesso, sair do loop
        except Exception as e:
            error_str = str(e)
            is_expected_error = (
                "No rows" in error_str or 
                "not found" in error_str.lower() or
                "PGRST116" in error_str or  # Cannot coerce to single JSON object (0 rows)
                "0 rows" in error_str
            )
            is_network_error = (
                "WinError 10035" in error_str or
                "10035" in error_str or
                "socket" in error_str.lower() or
                "network" in error_str.lower()
            )
            
            # Se for erro esperado (sem perfil), não logar e retornar None
            if is_expected_error:
                base = None
                break
            
            # Se for erro de rede e ainda há tentativas, tentar novamente
            if is_network_error and tentativa < max_tentativas - 1:
                import time
                time.sleep(0.3)
                continue
            
            # Se não for erro esperado nem de rede, ou última tentativa, logar apenas se não for erro de rede
            if not is_network_error:
                import traceback
                print(f"[AVISO] Erro ao buscar perfil_worker para {user_id}: {e}")
            base = None
            break

    if not base:
        return None

    # Disponibilidade em objeto
    disponibilidade = {
        "segunda": bool(base.get("disp_segunda")),
        "terca": bool(base.get("disp_terca")),
        "quarta": bool(base.get("disp_quarta")),
        "quinta": bool(base.get("disp_quinta")),
        "sexta": bool(base.get("disp_sexta")),
        "sabado": bool(base.get("disp_sabado")),
        "domingo": bool(base.get("disp_domingo")),
    }

    # Categorias (nomes)
    try:
        wc = (
            admin_client.table("worker_categorias")
            .select("categoria_id")
            .eq("user_id", user_id)
            .execute()
            .data
            or []
        )
        categoria_ids: List[int] = [c.get("categoria_id") for c in wc if c and c.get("categoria_id") is not None]
    except Exception:
        categoria_ids = []

    categorias: List[str] = []
    if categoria_ids:
        try:
            cats = (
                admin_client.table("categorias")
                .select("id, nome")
                .in_("id", categoria_ids)
                .execute()
                .data
                or []
            )
            categorias = [c.get("nome") for c in cats]
        except Exception:
            categorias = []

    # Portfólio
    try:
        portfolio_rows = (
            admin_client.table("worker_portfolio")
            .select("id, url, criado_em")
            .eq("user_id", user_id)
            .order("id")
            .execute()
            .data
            or []
        )
        portfolio = [
            {"id": p.get("id"), "url": p.get("url")}
            for p in portfolio_rows
        ]
    except Exception:
        portfolio = []

    return {
        "descricao": base.get("descricao"),
        "experiencia": base.get("experiencia"),
        "disponibilidade": disponibilidade,
        "categorias": categorias,
        "portfolio": portfolio,
    }


def upsert_worker_profile(admin_client, user_id: str, worker: Dict[str, Any]):
    """Grava dados do perfil do trabalhador nas tabelas normalizadas.
    worker: {
      descricao?, experiencia?, disponibilidade?: {segunda..domingo}, categorias?: [string|int], portfolio?: [{url,name?}]
    }
    """
    # Upsert no perfil_worker
    disponibilidade = worker.get("disponibilidade") or {}
    payload = {
        "user_id": user_id,
        "descricao": worker.get("descricao"),
        "experiencia": worker.get("experiencia"),
        "disp_segunda": bool(disponibilidade.get("segunda")),
        "disp_terca": bool(disponibilidade.get("terca")),
        "disp_quarta": bool(disponibilidade.get("quarta")),
        "disp_quinta": bool(disponibilidade.get("quinta")),
        "disp_sexta": bool(disponibilidade.get("sexta")),
        "disp_sabado": bool(disponibilidade.get("sabado")),
        "disp_domingo": bool(disponibilidade.get("domingo")),
    }

    admin_client.table("perfil_worker").upsert(payload, on_conflict="user_id").execute()

    # Categorias: aceita nomes ou ids
    categorias = worker.get("categorias") or []
    if categorias is not None:
        # Limpa e recria (estratégia simples)
        admin_client.table("worker_categorias").delete().eq("user_id", user_id).execute()
        if categorias:
            # Mapear qualquer formato (id, string id, slug, nome) -> id
            ids: List[int] = []
            try:
                cats_all = (
                    admin_client.table("categorias")
                    .select("id, nome")
                    .execute()
                    .data
                    or []
                )
            except Exception:
                cats_all = []
            by_nome = {str((c.get("nome") or "").strip().lower()): c.get("id") for c in cats_all}
            for c in categorias:
                if isinstance(c, int):
                    ids.append(c)
                    continue
                s = str(c).strip()
                if not s:
                    continue
                # string que representa número
                try:
                    n = int(s)
                    ids.append(n)
                    continue
                except Exception:
                    pass
                key_nome = s.lower()
                cid = by_nome.get(key_nome)
                if cid is not None:
                    ids.append(cid)

            rows = [{"user_id": user_id, "categoria_id": cid} for cid in ids]
            if rows:
                admin_client.table("worker_categorias").insert(rows).execute()

    # Portfólio: substituir lista
    portfolio = worker.get("portfolio")
    if portfolio is not None:
        admin_client.table("worker_portfolio").delete().eq("user_id", user_id).execute()
        rows = []
        for item in portfolio:
            if not item:
                continue
            url = item.get("url") if isinstance(item, dict) else None
            nome = item.get("name") if isinstance(item, dict) else None
            # Se veio data URL (base64), faz upload para o storage e usa URL pública
            if isinstance(url, str) and url.startswith("data:"):
                try:
                    public_url = upload_data_url(admin_client, "portifolio-fotos", user_id, url, nome)
                    if public_url:
                        url = public_url
                except Exception:
                    # ignora falha em upload desse item específico
                    url = None
            if url:
                rows.append({"user_id": user_id, "url": url})
        if rows:
            admin_client.table("worker_portfolio").insert(rows).execute()


# -------------------- Storage helpers --------------------
def _ensure_bucket(admin, bucket: str):
    try:
        buckets = admin.storage.list_buckets()
        names = set()
        for b in buckets or []:
            if isinstance(b, dict):
                names.add(b.get("name") or b.get("id"))
            else:
                try:
                    names.add(getattr(b, "name", None) or getattr(b, "id", None))
                except Exception:
                    pass
        if bucket not in names:
            admin.storage.create_bucket(bucket, public=True)
        else:
            try:
                admin.storage.update_bucket(bucket, public=True)
            except Exception:
                pass
    except Exception:
        try:
            admin.storage.create_bucket(bucket, public=True)
        except Exception:
            pass


def upload_data_url(admin, bucket: str, user_id: str, data_url: str, name: Optional[str] = None) -> Optional[str]:
    """Recebe uma data URL (ex.: data:image/png;base64,AAA...) e publica no storage, retornando a URL pública."""
    _ensure_bucket(admin, bucket)
    if not data_url.startswith("data:"):
        return None
    try:
        header, b64 = data_url.split(",", 1)
        mime = header.split(";")[0].split(":")[1] if ":" in header else "application/octet-stream"
        ext = {
            "image/png": ".png",
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/gif": ".gif",
            "image/webp": ".webp",
        }.get(mime, "")
        raw = base64.b64decode(b64)
        filename = (name or "portfolio")
        path = f"{user_id}/{int(os.getenv('EPOCH', '0')) or 0}_{abs(hash(filename))}{ext}"
        admin.storage.from_(bucket).upload(path, raw, {"content-type": mime})
        url_data = admin.storage.from_(bucket).get_public_url(path)
        if isinstance(url_data, str):
            return url_data
        if isinstance(url_data, dict):
            return url_data.get("public_url") or url_data.get("publicURL") or url_data.get("signedURL")
        try:
            return getattr(url_data, "public_url", None) or getattr(url_data, "publicURL", None)
        except Exception:
            return None
    except Exception:
        return None


def upload_anuncio_image(admin, bucket: str, user_id: str, anuncio_id: Optional[int], file_data: bytes, filename: str, mimetype: str) -> Optional[str]:
    """Faz upload de uma imagem de anúncio para o storage e retorna a URL pública.
    
    Args:
        admin: Cliente admin do Supabase
        bucket: Nome do bucket (ex: 'img-anuncios')
        user_id: ID do usuário dono do anúncio
        anuncio_id: ID do anúncio (opcional, para organizar por anúncio)
        file_data: Bytes do arquivo
        filename: Nome original do arquivo
        mimetype: Tipo MIME da imagem
    
    Returns:
        URL pública da imagem ou None em caso de erro
    """
    _ensure_bucket(admin, bucket)
    
    try:
        import time
        import hashlib
        
        # Gera nome único para o arquivo
        timestamp = int(time.time())
        file_hash = hashlib.md5(file_data).hexdigest()[:8]
        name, ext = os.path.splitext(filename)
        ext = ext or (".jpg" if "jpeg" in mimetype else ".png")
        
        # Organiza por usuário e anúncio (se disponível)
        if anuncio_id:
            path = f"{user_id}/anuncio_{anuncio_id}/{timestamp}_{file_hash}{ext}"
        else:
            path = f"{user_id}/temp/{timestamp}_{file_hash}{ext}"
        
        # Faz upload
        admin.storage.from_(bucket).upload(path, file_data, {"content-type": mimetype})
        
        # Obtém URL pública
        url_data = admin.storage.from_(bucket).get_public_url(path)
        
        if isinstance(url_data, str):
            return url_data
        elif isinstance(url_data, dict):
            return url_data.get("public_url") or url_data.get("publicURL") or url_data.get("signedURL")
        else:
            try:
                return getattr(url_data, "public_url", None) or getattr(url_data, "publicURL", None)
            except Exception:
                pass
        
        # Fallback: constrói URL manualmente
        storage_url = getattr(admin.storage, "url", None) or os.getenv("SUPABASE_URL", "")
        if storage_url:
            return f"{storage_url}/storage/v1/object/public/{bucket}/{path}"
        
        return None
    except Exception as e:
        print(f"[ERRO] Falha ao fazer upload de imagem de anúncio: {e}")
        import traceback
        print(traceback.format_exc())
        return None


def delete_anuncio_image(admin, bucket: str, image_url: str) -> bool:
    """Deleta uma imagem de anúncio do storage.
    
    Args:
        admin: Cliente admin do Supabase
        bucket: Nome do bucket
        image_url: URL da imagem a ser deletada
    
    Returns:
        True se deletado com sucesso, False caso contrário
    """
    if not image_url:
        return False
    
    try:
        import re
        # Extrai o path da URL
        patterns = [
            rf'/object/public/{re.escape(bucket)}/(.+)',
            rf'/storage/v1/object/public/{re.escape(bucket)}/(.+)',
        ]
        
        path = None
        for pattern in patterns:
            match = re.search(pattern, image_url)
            if match:
                path = match.group(1).split('?')[0].split('#')[0]
                break
        
        if not path:
            return False
        
        admin.storage.from_(bucket).remove([path])
        return True
    except Exception as e:
        print(f"[ERRO] Falha ao deletar imagem de anúncio: {e}")
        return False


