"""
Módulo de conexão com o banco de dados PostgreSQL para Vercel.
Arquivos com _ no início não se tornam endpoints.
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor

# A Vercel usa POSTGRES_URL ou DATABASE_URL
POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")


def get_db_connection():
    """Retorna uma conexão com o banco de dados PostgreSQL"""
    if not POSTGRES_URL:
        raise Exception("POSTGRES_URL não configurada.")
    
    conn = psycopg2.connect(POSTGRES_URL)
    return conn


def init_db():
    """Inicializa o banco de dados criando as tabelas se não existirem"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Tabela de feedback
        cur.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id VARCHAR(36) PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                updated_at TIMESTAMP
            );
        """)
        
        # Tabela de histórico de conversas do chatbot
        cur.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Índice para buscar por session_id
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_chat_history_session 
            ON chat_history(session_id);
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"ERRO ao inicializar o banco de dados: {e}")
        return False


def get_chat_history(session_id: str, limit: int = 20):
    """Busca o histórico de conversa de uma sessão"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("""
            SELECT role, content FROM chat_history 
            WHERE session_id = %s 
            ORDER BY created_at DESC 
            LIMIT %s
        """, (session_id, limit))
        
        # Inverter para ordem cronológica
        history = list(reversed(cur.fetchall()))
        
        cur.close()
        conn.close()
        
        return [{"role": h["role"], "content": h["content"]} for h in history]
    except Exception as e:
        print(f"Erro ao buscar histórico: {e}")
        return []


def save_chat_message(session_id: str, role: str, content: str):
    """Salva uma mensagem no histórico"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO chat_history (session_id, role, content)
            VALUES (%s, %s, %s)
        """, (session_id, role, content))
        
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro ao salvar mensagem: {e}")
        return False


def cleanup_old_chat_history(session_id: str, keep_last: int = 20):
    """Remove mensagens antigas mantendo apenas as últimas N"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Conta quantas mensagens existem
        cur.execute("""
            SELECT COUNT(*) FROM chat_history WHERE session_id = %s
        """, (session_id,))
        
        count = cur.fetchone()[0]
        
        if count > keep_last:
            # Remove as mais antigas
            cur.execute("""
                DELETE FROM chat_history 
                WHERE session_id = %s 
                AND id NOT IN (
                    SELECT id FROM chat_history 
                    WHERE session_id = %s 
                    ORDER BY created_at DESC 
                    LIMIT %s
                )
            """, (session_id, session_id, keep_last))
            
            conn.commit()
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Erro ao limpar histórico: {e}")

