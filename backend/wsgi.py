import sys
import os

# Obtém o diretório do backend
backend_dir = os.path.dirname(os.path.abspath(__file__))
# Obtém o diretório pai (lance-facil)
parent_dir = os.path.dirname(backend_dir)

# Adiciona o diretório pai ao path para que 'backend' seja reconhecido como pacote
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Agora podemos importar usando o caminho absoluto do pacote
from backend.app import app as application

# PythonAnywhere procura por uma variável chamada `application`
# que é o WSGI callable.

if __name__ == "__main__":
    # Para rodar localmente
    import logging
    # Configurar logging para ignorar erros de requisições malformadas
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)  # Só mostra erros, não warnings de requisições malformadas
    
    print("🚀 Iniciando servidor Flask...")
    print("📚 Documentação Swagger: http://localhost:5000/api/docs/")
    print("🔍 Health Check: http://localhost:5000/api/health")
    print("=" * 60)
    application.run(host="0.0.0.0", port=5000, debug=True)