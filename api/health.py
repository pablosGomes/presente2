"""
Health Check Endpoint - Vercel Serverless Function
Verifica o status da API e suas dependências
"""
from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

# Tentar importar dependências
try:
    import psycopg2
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Health check com verificação de dependências"""
        
        # Verificar configurações
        groq_configured = bool(os.environ.get('GROQ_API_KEY'))
        db_configured = bool(os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL'))
        
        # Testar conexão com banco se disponível
        db_status = 'not_configured'
        if db_configured and DB_AVAILABLE:
            try:
                conn_str = os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL')
                conn = psycopg2.connect(conn_str)
                # Testar query simples
                cur = conn.cursor()
                cur.execute("SELECT 1")
                cur.close()
                conn.close()
                db_status = 'connected'
            except Exception as e:
                db_status = f'error: {str(e)[:50]}'
        elif db_configured:
            db_status = 'library_missing'
        elif DB_AVAILABLE:
            db_status = 'not_configured'
        
        # Status geral
        all_ok = groq_configured and (db_status == 'connected') and OPENAI_AVAILABLE
        
        response = {
            'status': 'healthy' if all_ok else 'degraded',
            'timestamp': datetime.utcnow().isoformat(),
            'message': '🎆 Matteo API está funcionando!' if all_ok else '⚠️ API com problemas',
            'checks': {
                'groq_api': {
                    'configured': groq_configured,
                    'status': 'ok' if groq_configured else 'missing_api_key'
                },
                'database': {
                    'configured': db_configured,
                    'library_available': DB_AVAILABLE,
                    'status': db_status
                },
                'openai_library': {
                    'available': OPENAI_AVAILABLE,
                    'status': 'ok' if OPENAI_AVAILABLE else 'library_missing'
                }
            },
            'environment': {
                'python_version': os.sys.version.split()[0],
                'vercel_env': os.environ.get('VERCEL_ENV', 'development'),
                'vercel_region': os.environ.get('VERCEL_REGION', 'unknown'),
                'node_env': os.environ.get('NODE_ENV', 'development')
            }
        }
        
        # Status HTTP baseado na saúde
        status_code = 200 if all_ok else 503
        
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        
        self.wfile.write(json.dumps(response, ensure_ascii=False, indent=2).encode('utf-8'))