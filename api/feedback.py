"""
Endpoint de Feedback (CRUD) - Vercel Serverless Function
"""
from http.server import BaseHTTPRequestHandler
import json
import uuid
from datetime import datetime
from urllib.parse import urlparse, parse_qs

from _db import get_db_connection, init_db
from _email import send_email_notification


class handler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        """Envia headers CORS"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _get_feedback_id(self):
        """Extrai o feedback_id da URL se existir"""
        parsed = urlparse(self.path)
        path_parts = parsed.path.strip('/').split('/')
        if len(path_parts) >= 2:
            return path_parts[-1]
        return None

    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Buscar todos os feedbacks"""
        try:
            init_db()
            
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("SELECT id, author, message, created_at, updated_at FROM feedback ORDER BY created_at DESC")
            
            col_names = [desc[0] for desc in cur.description]
            rows = cur.fetchall()
            
            # Converter para lista de dicionários e serializar datas
            feedback_list = []
            for row in rows:
                item = dict(zip(col_names, row))
                # Converter datetime para string
                if item.get('created_at'):
                    item['created_at'] = item['created_at'].isoformat() if hasattr(item['created_at'], 'isoformat') else str(item['created_at'])
                if item.get('updated_at'):
                    item['updated_at'] = item['updated_at'].isoformat() if hasattr(item['updated_at'], 'isoformat') else str(item['updated_at'])
                feedback_list.append(item)
            
            cur.close()
            conn.close()
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(feedback_list).encode())
            
        except Exception as e:
            print(f"Erro ao buscar feedback: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Erro interno ao buscar feedback'}).encode())

    def do_POST(self):
        """Criar novo feedback"""
        try:
            init_db()
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)
            
            author = data.get('author', 'Geovana')
            message = data.get('message')
            
            if not message:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'A mensagem não pode ser vazia'}).encode())
                return
            
            feedback_id = str(uuid.uuid4())
            created_at = datetime.now().isoformat()
            
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO feedback (id, author, message, created_at) VALUES (%s, %s, %s, %s)",
                (feedback_id, author, message, created_at)
            )
            conn.commit()
            cur.close()
            conn.close()
            
            # Enviar notificação por e-mail
            send_email_notification(author, message)
            
            self.send_response(201)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            
            result = {
                'message': 'Feedback salvo com sucesso!',
                'id': feedback_id,
                'created_at': created_at
            }
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            print(f"Erro ao criar feedback: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Erro interno ao salvar feedback'}).encode())

    def do_PUT(self):
        """Atualizar feedback existente"""
        try:
            feedback_id = self._get_feedback_id()
            
            if not feedback_id:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'ID do feedback não fornecido'}).encode())
                return
            
            init_db()
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)
            
            message = data.get('message')
            
            if not message:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'A mensagem não pode ser vazia'}).encode())
                return
            
            conn = get_db_connection()
            cur = conn.cursor()
            updated_at = datetime.now().isoformat()
            
            cur.execute(
                "UPDATE feedback SET message = %s, updated_at = %s WHERE id = %s",
                (message, updated_at, feedback_id)
            )
            
            row_count = cur.rowcount
            conn.commit()
            cur.close()
            conn.close()
            
            if row_count == 0:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Feedback não encontrado'}).encode())
                return
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            
            result = {
                'message': 'Feedback atualizado com sucesso!',
                'updated_at': updated_at
            }
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            print(f"Erro ao atualizar feedback: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Erro interno ao atualizar feedback'}).encode())

    def do_DELETE(self):
        """Deletar feedback"""
        try:
            feedback_id = self._get_feedback_id()
            
            if not feedback_id:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'ID do feedback não fornecido'}).encode())
                return
            
            init_db()
            
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("DELETE FROM feedback WHERE id = %s", (feedback_id,))
            
            row_count = cur.rowcount
            conn.commit()
            cur.close()
            conn.close()
            
            if row_count == 0:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Feedback não encontrado'}).encode())
                return
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'message': 'Feedback deletado com sucesso!'}).encode())
            
        except Exception as e:
            print(f"Erro ao deletar feedback: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Erro interno ao deletar feedback'}).encode())

