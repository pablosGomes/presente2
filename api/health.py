"""
Health Check Endpoint - Vercel Serverless Function
"""
from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Verificar se variáveis estão configuradas
        has_openai = bool(os.environ.get('OPENAI_API_KEY'))
        has_db = bool(os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL'))
        
        response = {
            'status': 'ok',
            'platform': 'vercel',
            'openai_configured': has_openai,
            'database_configured': has_db
        }
        self.wfile.write(json.dumps(response).encode())
