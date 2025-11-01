from app import app as application

# PythonAnywhere procura por uma variável chamada `application`
# que é o WSGI callable.

if __name__ == "__main__":
    # Para rodar localmente
    print("🚀 Iniciando servidor Flask...")
    print("📚 Documentação Swagger: http://localhost:5000/api/docs/")
    print("🔍 Health Check: http://localhost:5000/api/health")
    print("=" * 60)
    application.run(host="127.0.0.1", port=5000, debug=True)