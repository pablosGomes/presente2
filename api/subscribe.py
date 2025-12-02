"""
Endpoint para salvar inscrições de Push Notification
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import psycopg2
from datetime import datetime

# ============== CONFIGURAÇÕES ==============
POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")

def get_db_connection():
    if not POSTGRES_URL:
        return None
    return psycopg2.connect(POSTGRES_URL)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            
            subscription = data.get('subscription')
            if not subscription:
                self.send_response(400)
                self.end_headers()
                return

            endpoint = subscription.get('endpoint')
            keys = subscription.get('keys', {})
            p256dh = keys.get('p256dh')
            auth = keys.get('auth')

            if not endpoint or not p256dh or not auth:
                self.send_response(400)
                self.end_headers()
                return

            conn = get_db_connection()
            if conn:
                cur = conn.cursor()
                # Criar tabela se não existir
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS push_subscriptions (
                        id SERIAL PRIMARY KEY,
                        endpoint TEXT NOT NULL UNIQUE,
                        p256dh TEXT NOT NULL,
                        auth TEXT NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                
                # Inserir ou Atualizar
                cur.execute("""
                    INSERT INTO push_subscriptions (endpoint, p256dh, auth)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (endpoint) DO UPDATE 
                    SET p256dh = EXCLUDED.p256dh, 
                        auth = EXCLUDED.auth,
                        created_at = CURRENT_TIMESTAMP;
                """, (endpoint, p256dh, auth))
                
                conn.commit()
                cur.close()
                conn.close()

            self.send_response(201)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok'}).encode())

        except Exception as e:
            print(f"Erro subscribe: {e}")
            self.send_response(500)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

