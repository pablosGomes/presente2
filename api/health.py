"""
Health Check Endpoint - Vercel Serverless Function
"""
from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Health check"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            'status': 'ok',
            'platform': 'vercel',
            'db': 'postgres'
        }
        self.wfile.write(json.dumps(response).encode())

