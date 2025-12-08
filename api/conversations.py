"""
Endpoint para gerenciar conversas do Matteo
CRUD completo de conversas integrado com banco de dados
"""
from http.server import BaseHTTPRequestHandler
import json
import os
from urllib.parse import urlparse

# Tentar importar psycopg2
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    print("psycopg2 não disponível")

POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")

def get_db_connection():
    if not POSTGRES_URL or not DB_AVAILABLE:
        return None
    return psycopg2.connect(POSTGRES_URL)

def init_db():
    """Garante que a tabela de conversas existe"""
    try:
        conn = get_db_connection()
        if not conn:
            return False
        cur = conn.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id VARCHAR(255) PRIMARY KEY,
                session_id VARCHAR(255) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                last_message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_conversations_updated 
            ON conversations(updated_at DESC);
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro init_db: {e}")
        return False

def get_all_conversations(limit=50):
    """Busca todas as conversas ordenadas por data de atualização"""
    try:
        conn = get_db_connection()
        if not conn:
            return []
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT id, session_id, title, last_message, created_at, updated_at
            FROM conversations
            ORDER BY updated_at DESC
            LIMIT %s
        """, (limit,))
        conversations = cur.fetchall()
        cur.close()
        conn.close()
        return [
            {
                'id': c['id'],
                'sessionId': c['session_id'],
                'title': c['title'],
                'lastMessage': c['last_message'] or 'Nova conversa',
                'createdAt': c['created_at'].isoformat() if hasattr(c['created_at'], 'isoformat') else str(c['created_at']),
                'updatedAt': c['updated_at'].isoformat() if hasattr(c['updated_at'], 'isoformat') else str(c['updated_at'])
            }
            for c in conversations
        ]
    except Exception as e:
        print(f"Erro get_all_conversations: {e}")
        return []

def get_conversation_by_id(conversation_id):
    """Busca uma conversa específica"""
    try:
        conn = get_db_connection()
        if not conn:
            return None
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT id, session_id, title, last_message, created_at, updated_at
            FROM conversations
            WHERE id = %s
        """, (conversation_id,))
        result = cur.fetchone()
        cur.close()
        conn.close()
        if result:
            return {
                'id': result['id'],
                'sessionId': result['session_id'],
                'title': result['title'],
                'lastMessage': result['last_message'] or 'Nova conversa',
                'createdAt': result['created_at'].isoformat() if hasattr(result['created_at'], 'isoformat') else str(result['created_at']),
                'updatedAt': result['updated_at'].isoformat() if hasattr(result['updated_at'], 'isoformat') else str(result['updated_at'])
            }
        return None
    except Exception as e:
        print(f"Erro get_conversation_by_id: {e}")
        return None

def create_conversation(conversation_id, session_id, title='Nova conversa'):
    """Cria uma nova conversa no banco"""
    try:
        conn = get_db_connection()
        if not conn:
            return False
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO conversations (id, session_id, title, last_message, created_at, updated_at)
            VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
        """, (conversation_id, session_id, title, 'Nova conversa'))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro create_conversation: {e}")
        return False

def update_conversation(conversation_id, title=None, last_message=None):
    """Atualiza uma conversa"""
    try:
        conn = get_db_connection()
        if not conn:
            return False
        cur = conn.cursor()
        
        updates = []
        params = []
        
        if title:
            updates.append("title = %s")
            params.append(title)
        if last_message:
            updates.append("last_message = %s")
            params.append(last_message)
        
        if not updates:
            return True
        
        updates.append("updated_at = CURRENT_TIMESTAMP")
        params.append(conversation_id)
        
        cur.execute(f"""
            UPDATE conversations
            SET {', '.join(updates)}
            WHERE id = %s
        """, params)
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro update_conversation: {e}")
        return False

def delete_conversation(conversation_id):
    """Deleta uma conversa e todo seu histórico"""
    try:
        conn = get_db_connection()
        if not conn:
            return False
        cur = conn.cursor()
        
        # Buscar session_id antes de deletar
        cur.execute("SELECT session_id FROM conversations WHERE id = %s", (conversation_id,))
        result = cur.fetchone()
        session_id = result[0] if result else None
        
        # Deletar conversa
        cur.execute("DELETE FROM conversations WHERE id = %s", (conversation_id,))
        
        # Deletar histórico de mensagens
        if session_id:
            cur.execute("DELETE FROM chat_history WHERE session_id = %s", (session_id,))
        
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro delete_conversation: {e}")
        return False

def get_conversation_messages(session_id):
    """Busca todas as mensagens de uma conversa"""
    try:
        conn = get_db_connection()
        if not conn:
            return []
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT role, content, created_at
            FROM chat_history
            WHERE session_id = %s
            ORDER BY created_at ASC
        """, (session_id,))
        messages = cur.fetchall()
        cur.close()
        conn.close()
        return [
            {
                'id': idx,
                'text': m['content'],
                'sender': 'user' if m['role'] == 'user' else 'bot',
                'timestamp': m['created_at'].isoformat() if hasattr(m['created_at'], 'isoformat') else str(m['created_at'])
            }
            for idx, m in enumerate(messages, 1)
        ]
    except Exception as e:
        print(f"Erro get_conversation_messages: {e}")
        return []

class handler(BaseHTTPRequestHandler):
    def _send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode())

    def _get_conversation_id(self):
        """Extrai o ID da conversa da URL"""
        parsed = urlparse(self.path)
        path_parts = [p for p in parsed.path.strip('/').split('/') if p]
        # Exemplo: /api/conversations/conv_123456
        if len(path_parts) >= 3 and path_parts[-2] == 'conversations':
            return path_parts[-1]
        # Também aceita: /conversations/conv_123456 (sem /api)
        if len(path_parts) >= 2 and path_parts[-2] == 'conversations':
            return path_parts[-1]
        return None

    def do_OPTIONS(self):
        self._send_json(200, {})

    def do_GET(self):
        try:
            init_db()
            conversation_id = self._get_conversation_id()
            
            if conversation_id:
                # Buscar conversa específica
                conv = get_conversation_by_id(conversation_id)
                if not conv:
                    self._send_json(404, {'error': 'Conversa não encontrada'})
                    return
                
                # Buscar mensagens da conversa
                messages = get_conversation_messages(conv['sessionId'])
                conv['messages'] = messages
                
                self._send_json(200, conv)
            else:
                # Listar todas as conversas
                conversations = get_all_conversations()
                self._send_json(200, conversations)
                
        except Exception as e:
            import traceback
            print(f"Erro ao buscar conversas: {traceback.format_exc()}")
            self._send_json(500, {'error': str(e)})

    def do_POST(self):
        try:
            init_db()
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            
            conversation_id = data.get('id') or data.get('conversation_id')
            session_id = data.get('session_id') or f"session_{conversation_id}"
            title = data.get('title', 'Nova conversa')
            
            if not conversation_id:
                self._send_json(400, {'error': 'ID da conversa não fornecido'})
                return
            
            if create_conversation(conversation_id, session_id, title):
                conv = get_conversation_by_id(conversation_id)
                self._send_json(201, conv)
            else:
                self._send_json(500, {'error': 'Erro ao criar conversa'})
                
        except Exception as e:
            import traceback
            print(f"Erro ao criar conversa: {traceback.format_exc()}")
            self._send_json(500, {'error': str(e)})

    def do_PUT(self):
        try:
            init_db()
            conversation_id = self._get_conversation_id()
            
            if not conversation_id:
                self._send_json(400, {'error': 'ID da conversa não fornecido'})
                return
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            
            title = data.get('title')
            last_message = data.get('last_message')
            
            if update_conversation(conversation_id, title=title, last_message=last_message):
                conv = get_conversation_by_id(conversation_id)
                self._send_json(200, conv)
            else:
                self._send_json(500, {'error': 'Erro ao atualizar conversa'})
                
        except Exception as e:
            import traceback
            print(f"Erro ao atualizar conversa: {traceback.format_exc()}")
            self._send_json(500, {'error': str(e)})

    def do_DELETE(self):
        try:
            init_db()
            conversation_id = self._get_conversation_id()
            
            if not conversation_id:
                self._send_json(400, {'error': 'ID da conversa não fornecido'})
                return
            
            if delete_conversation(conversation_id):
                self._send_json(200, {'message': 'Conversa deletada com sucesso'})
            else:
                self._send_json(500, {'error': 'Erro ao deletar conversa'})
                
        except Exception as e:
            import traceback
            print(f"Erro ao deletar conversa: {traceback.format_exc()}")
            self._send_json(500, {'error': str(e)})

