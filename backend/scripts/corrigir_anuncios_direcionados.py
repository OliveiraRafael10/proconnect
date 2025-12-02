#!/usr/bin/env python3
"""
Script para corrigir anúncios que foram criados como gerais mas deveriam ser direcionados.

Este script:
1. Busca anúncios que contêm "Esta oportunidade foi direcionada ao profissional" na descrição
2. Extrai o ID do profissional da descrição
3. Atualiza o campo profissional_direcionado_id no banco de dados
4. Remove a nota da descrição (opcional)
"""

import re
import sys
import os

# Adicionar o diretório raiz do projeto ao path
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
project_root = os.path.dirname(backend_dir)
sys.path.insert(0, project_root)
sys.path.insert(0, backend_dir)

from backend.supabase_client import get_admin_client
from backend.config import settings

def extrair_id_profissional_da_descricao(descricao):
    """Extrai o ID do profissional da descrição usando regex."""
    # Padrão: "Esta oportunidade foi direcionada ao profissional NOME (ID: UUID)"
    pattern = r'ID:\s*([a-f0-9-]{36})'
    match = re.search(pattern, descricao, re.IGNORECASE)
    if match:
        return match.group(1)
    return None

def remover_nota_direcionamento(descricao):
    """Remove a nota de direcionamento da descrição."""
    # Remove a linha que contém "Esta oportunidade foi direcionada"
    lines = descricao.split('\n')
    filtered_lines = []
    skip_next = False
    for i, line in enumerate(lines):
        if 'Esta oportunidade foi direcionada' in line or '📌' in line:
            skip_next = True
            continue
        if skip_next and line.strip() == '':
            skip_next = False
            continue
        skip_next = False
        filtered_lines.append(line)
    
    return '\n'.join(filtered_lines).strip()

def corrigir_anuncios():
    """Corrige anúncios que foram criados incorretamente."""
    admin = get_admin_client()
    
    # Buscar todos os anúncios do tipo "oportunidade"
    anuncios = admin.table("anuncios").select("*").eq("tipo", "oportunidade").execute().data
    
    print(f"Encontrados {len(anuncios)} anúncios do tipo 'oportunidade'")
    
    corrigidos = 0
    erros = 0
    
    for anuncio in anuncios:
        descricao = anuncio.get("descricao", "")
        profissional_id = extrair_id_profissional_da_descricao(descricao)
        
        if profissional_id:
            print(f"\nAnúncio ID {anuncio['id']}:")
            print(f"  Título: {anuncio.get('titulo', 'N/A')}")
            print(f"  Profissional ID encontrado: {profissional_id}")
            
            # Verificar se o profissional existe
            try:
                profissional = admin.table("usuarios").select("id, nome").eq("id", profissional_id).single().execute().data
                print(f"  Profissional: {profissional.get('nome', 'N/A')}")
            except Exception as e:
                print(f"  [AVISO] Erro ao buscar profissional: {e}")
                erros += 1
                continue
            
            # Atualizar o anúncio
            try:
                descricao_limpa = remover_nota_direcionamento(descricao)
                
                update_data = {
                    "profissional_direcionado_id": profissional_id,
                    "descricao": descricao_limpa
                }
                
                admin.table("anuncios").update(update_data).eq("id", anuncio["id"]).execute()
                
                print(f"  [OK] Anuncio corrigido com sucesso!")
                print(f"  Descricao limpa: {descricao_limpa[:100]}...")
                corrigidos += 1
            except Exception as e:
                print(f"  [ERRO] Erro ao atualizar anuncio: {e}")
                erros += 1
    
    print(f"\n{'='*60}")
    print(f"Resumo:")
    print(f"  Anúncios corrigidos: {corrigidos}")
    print(f"  Erros: {erros}")
    print(f"{'='*60}")

if __name__ == "__main__":
    try:
        settings.validate()
        corrigir_anuncios()
    except Exception as e:
        print(f"Erro ao executar script: {e}")
        sys.exit(1)

