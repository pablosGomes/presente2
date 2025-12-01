"""
Endpoint de Feedback (CRUD) - Vercel Serverless Function
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import uuid
from datetime import datetime
from urllib.parse import urlparse
import smtplib
from email.mime.text import MIMEText

# Tentar importar psycopg2
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    print("psycopg2 não disponível")

# ============== CONFIGURAÇÕES ==============

POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")

# ============== FUNÇÕES DO BANCO ==============

def get_db_connection():
    if not POSTGRES_URL or not DB_AVAILABLE:
        return None
    return psycopg2.connect(POSTGRES_URL)

def init_db():
    try:
        conn = get_db_connection()
        if not conn:
            return False
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id VARCHAR(36) PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                updated_at TIMESTAMP
            );
        """)
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro init_db: {e}")
        return False

# ============== FUNÇÃO DE E-MAIL ==============

def send_email_notification(author, message):
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
    SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')
    RECEIVER_EMAIL = os.environ.get('RECEIVER_EMAIL')
    SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))

    if not all([SENDER_EMAIL, SENDER_PASSWORD, RECEIVER_EMAIL]):
        return False

    msg = MIMEText(f"Nova mensagem no Mural de Desabafos:\n\nAutor: {author}\n\nMensagem:\n{message}")
    msg['Subject'] = "🚨 Novo Desabafo da Geovana no Site de Aniversário! 🚨"
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECEIVER_EMAIL

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        return True
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        return False

# ============== HANDLER ==============

class handler(BaseHTTPRequestHandler):
    def _send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode())

    def _get_feedback_id(self):
        parsed = urlparse(self.path)
        path_parts = parsed.path.strip('/').split('/')
        if len(path_parts) >= 2 and path_parts[-1] != 'feedback':
            return path_parts[-1]
        return None

    def do_OPTIONS(self):
        self._send_json(200, {})

    def do_GET(self):
        try:
            init_db()
            conn = get_db_connection()
            if not conn:
                self._send_json(500, {'error': 'Banco de dados não configurado'})
                return
                
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT id, author, message, created_at, updated_at FROM feedback ORDER BY created_at DESC")
            rows = cur.fetchall()
            
            feedback_list = []
            for row in rows:
                item = dict(row)
                if item.get('created_at'):
                    item['created_at'] = item['created_at'].isoformat() if hasattr(item['created_at'], 'isoformat') else str(item['created_at'])
                if item.get('updated_at'):
                    item['updated_at'] = item['updated_at'].isoformat() if hasattr(item['updated_at'], 'isoformat') else str(item['updated_at'])
                feedback_list.append(item)
            
            cur.close()
            conn.close()
            self._send_json(200, feedback_list)
            
        except Exception as e:
            import traceback
            print(f"Erro ao buscar feedback: {traceback.format_exc()}")
            self._send_json(500, {
                'error': str(e),
                'db_available': DB_AVAILABLE,
                'postgres_url_set': bool(POSTGRES_URL)
            })

    def do_POST(self):
        try:
            init_db()
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            
            author = data.get('author', 'Geovana')
            message = data.get('message')
            
            if not message:
                self._send_json(400, {'error': 'A mensagem não pode ser vazia'})
                return
            
            conn = get_db_connection()
            if not conn:
                self._send_json(500, {'error': 'Banco de dados não configurado'})
                return
            
            feedback_id = str(uuid.uuid4())
            created_at = datetime.now().isoformat()
            
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO feedback (id, author, message, created_at) VALUES (%s, %s, %s, %s)",
                (feedback_id, author, message, created_at)
            )
            conn.commit()
            cur.close()
            conn.close()
            
            send_email_notification(author, message)
            
            self._send_json(201, {
                'message': 'Feedback salvo com sucesso!',
                'id': feedback_id,
                'created_at': created_at
            })
            
        except Exception as e:
            print(f"Erro ao criar feedback: {str(e)}")
            self._send_json(500, {'error': 'Erro interno ao salvar feedback'})

    def do_PUT(self):
        try:
            feedback_id = self._get_feedback_id()
            if not feedback_id:
                self._send_json(400, {'error': 'ID do feedback não fornecido'})
                return
            
            init_db()
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            
            message = data.get('message')
            if not message:
                self._send_json(400, {'error': 'A mensagem não pode ser vazia'})
                return
            
            conn = get_db_connection()
            if not conn:
                self._send_json(500, {'error': 'Banco de dados não configurado'})
                return
            
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
                self._send_json(404, {'error': 'Feedback não encontrado'})
                return
            
            self._send_json(200, {
                'message': 'Feedback atualizado com sucesso!',
                'updated_at': updated_at
            })
            
        except Exception as e:
            print(f"Erro ao atualizar feedback: {str(e)}")
            self._send_json(500, {'error': 'Erro interno ao atualizar feedback'})

    def do_DELETE(self):
        try:
            feedback_id = self._get_feedback_id()
            if not feedback_id:
                self._send_json(400, {'error': 'ID do feedback não fornecido'})
                return
            
            init_db()
            
            conn = get_db_connection()
            if not conn:
                self._send_json(500, {'error': 'Banco de dados não configurado'})
                return
            
            cur = conn.cursor()
            cur.execute("DELETE FROM feedback WHERE id = %s", (feedback_id,))
            
            row_count = cur.rowcount
            conn.commit()
            cur.close()
            conn.close()
            
            if row_count == 0:
                self._send_json(404, {'error': 'Feedback não encontrado'})
                return
            
            self._send_json(200, {'message': 'Feedback deletado com sucesso!'})
            
        except Exception as e:
            print(f"Erro ao deletar feedback: {str(e)}")
            self._send_json(500, {'error': 'Erro interno ao deletar feedback'})
