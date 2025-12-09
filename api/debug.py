"""
Debug endpoint para verificar configurações da API
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import sys

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Debug endpoint - mostra configuração do ambiente"""
        
        # Verificar importações
        imports = {
            'psycopg2': False,
            'openai': False,
            'requests': False
        }
        
        try:
            import psycopg2
            imports['psycopg2'] = True
        except ImportError as e:
            imports['psycopg2_error'] = str(e)
        
        try:
            from openai import OpenAI
            imports['openai'] = True
        except ImportError as e:
            imports['openai_error'] = str(e)
        
        try:
            import requests
            imports['requests'] = True
        except ImportError as e:
            imports['requests_error'] = str(e)
        
        # Verificar variáveis de ambiente
        env_vars = {
            'MISTRAL_API_KEY': {
                'exists': bool(os.environ.get('MISTRAL_API_KEY')),
                'first_chars': os.environ.get('MISTRAL_API_KEY', '')[:10] + '...' if os.environ.get('MISTRAL_API_KEY') else None
            },
            'POSTGRES_URL': {
                'exists': bool(os.environ.get('POSTGRES_URL')),
                'type': 'postgres' if 'postgres' in str(os.environ.get('POSTGRES_URL', '')) else 'unknown'
            },
            'DATABASE_URL': {
                'exists': bool(os.environ.get('DATABASE_URL')),
                'type': 'postgres' if 'postgres' in str(os.environ.get('DATABASE_URL', '')) else 'unknown'
            },
            'VERCEL_ENV': os.environ.get('VERCEL_ENV', 'not_set'),
            'VERCEL_REGION': os.environ.get('VERCEL_REGION', 'not_set'),
            'NODE_ENV': os.environ.get('NODE_ENV', 'not_set')
        }
        
        # Testar conexão com banco
        db_test = {'status': 'not_tested'}
        if imports['psycopg2'] and (env_vars['POSTGRES_URL']['exists'] or env_vars['DATABASE_URL']['exists']):
            try:
                import psycopg2
                conn_str = os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL')
                conn = psycopg2.connect(conn_str)
                cur = conn.cursor()
                
                # Verificar tabelas
                cur.execute("""
                    SELECT table_name FROM information_schema.tables 
                    WHERE table_schema = 'public'
                """)
                tables = [row[0] for row in cur.fetchall()]
                
                cur.close()
                conn.close()
                
                db_test = {
                    'status': 'connected',
                    'tables': tables
                }
            except Exception as e:
                db_test = {
                    'status': 'error',
                    'error': str(e)[:200]
                }
        
        # Testar Mistral
        mistral_test = {'status': 'not_tested'}
        if imports['openai'] and env_vars['MISTRAL_API_KEY']['exists']:
            try:
                from openai import OpenAI
                client = OpenAI(
                    api_key=os.environ.get('MISTRAL_API_KEY'),
                    base_url="https://api.mistral.ai/v1"
                )
                # Teste simples
                response = client.chat.completions.create(
                    model="mistral-large-latest",
                    messages=[{"role": "user", "content": "Diga apenas 'OK'"}],
                    max_tokens=10,
                    temperature=0
                )
                mistral_test = {
                    'status': 'working',
                    'model': 'mistral-large-latest',
                    'response': response.choices[0].message.content
                }
            except Exception as e:
                mistral_test = {
                    'status': 'error',
                    'error': str(e)[:200]
                }
        
        # Informações do Python
        python_info = {
            'version': sys.version,
            'path': sys.executable,
            'modules': list(sys.modules.keys())[:20]  # Primeiros 20 módulos
        }
        
        # Resposta
        response = {
            'debug': True,
            'imports': imports,
            'environment': env_vars,
            'database_test': db_test,
            'mistral_test': mistral_test,
            'python': python_info,
            'recommendations': []
        }
        
        # Recomendações
        if not imports['openai']:
            response['recommendations'].append('⚠️ Biblioteca OpenAI não instalada - execute: pip install openai')
        if not imports['psycopg2']:
            response['recommendations'].append('⚠️ Biblioteca psycopg2 não instalada - execute: pip install psycopg2-binary')
        if not env_vars['MISTRAL_API_KEY']['exists']:
            response['recommendations'].append('❌ MISTRAL_API_KEY não configurada - adicione nas variáveis de ambiente da Vercel')
        if not env_vars['POSTGRES_URL']['exists'] and not env_vars['DATABASE_URL']['exists']:
            response['recommendations'].append('❌ Banco de dados não configurado - configure POSTGRES_URL ou DATABASE_URL')
        if db_test['status'] == 'error':
            response['recommendations'].append('❌ Erro na conexão com banco - verifique a URL de conexão')
        if mistral_test['status'] == 'error':
            response['recommendations'].append('❌ Erro na API do Mistral - verifique a API key')
        
        # Status final
        all_ok = (
            imports['openai'] and
            imports['psycopg2'] and
            env_vars['MISTRAL_API_KEY']['exists'] and
            (env_vars['POSTGRES_URL']['exists'] or env_vars['DATABASE_URL']['exists']) and
            db_test.get('status') == 'connected' and
            mistral_test.get('status') == 'working'
        )
        
        response['status'] = 'ready' if all_ok else 'not_ready'
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        
        self.wfile.write(json.dumps(response, ensure_ascii=False, indent=2).encode('utf-8'))
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
