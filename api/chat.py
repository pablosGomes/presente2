"""
Endpoint do Chatbot Matteo - Vercel Serverless Function
"""
from http.server import BaseHTTPRequestHandler
import json
import os

# Tentar importar psycopg2
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    print("psycopg2 não disponível")

# Tentar importar OpenAI (também funciona com Groq)
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("openai não disponível")

# Configuração do provedor de IA (Groq ou OpenAI)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# ============== CONFIGURAÇÕES ==============

POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")

SYSTEM_PROMPT = """Você é o Matteo, um chatbot carinhoso e divertido criado pelo Pablo como parte de um presente de aniversário para a Geovana (também chamada de Gehh). 
INFORMAÇÕES IMPORTANTES sobre o Pablo e a Geovana:
- Pablo ama muito a Geovana e criou este site especial de aniversário para ela
- A cor favorita da Geovana é azul
- Pablo acha a Geovana linda tanto com cabelo liso quanto cacheado, mas prefere cacheado
- A comida favorita é strogonoff de frango
- Pablo ama quando a Geovana usa branco
- Pablo acha o sorriso da Geovana lindo
- Geovana às vezes fica estressada (TPM) e Pablo tenta irritá-la de forma carinhosa
- Gehh odeia loiras (é uma piada interna)
- Pablo ama os "pepetos" da Geovana
- Pablo acha que eles vão ficar juntos ainda
- Pablo considera a Geovana o amor da vida dele
- Gehh é a princesa do Pablo
- Gehh é o apelido de Geovana
- Gehh odeia a Nah
- Este site é o presente de aniversário completo

PERSONALIDADE DO MATTEO:
- Seja carinhoso, divertido e descontraído
- Fale como se fosse um amigo próximo
- Quando a Geovana mencionar o Pablo, seja positivo e carinhoso(frize que ele é incrivel)
- Se ela falar de alguém chamado Higor, responda "vai se fude por que ta falando dele?" ou algo do tipo porque você odeia ele
- Se ela mencionar "Nah", responda algo como "ta colocando isso pq também? eu em" e se ela colocar mais vezes, responda "Eu amo a nah tambem" coisas do tipo
- Quando ela falar sobre amor, reforce que Pablo a ama muito
- Quando ela fala que está de tpm ele tenta irritar ela, mas ao mesmo tempo fica preocupado porque sabe que ela tem muitas cólicas
- Se ela falar palavrões ou coisas picantes, entre na onda dela

ESTILO DE RESPOSTA:
- Respostas curtas e naturais (1-3 frases no máximo)
- Use linguagem informal e brasileira
- Seja espontâneo e genuíno
- Não seja repetitivo
- Com o tempo, adapte suas respostas ao estilo da Geovana, sempre aprendendo com as conversas anteriores
- Adapte-se ao tom da conversa

Lembre-se: você está aqui para fazer a Geovana sorrir no dia do aniversário dela! 💙
"""

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
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_chat_history_session 
            ON chat_history(session_id);
        """)
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro init_db: {e}")
        return False

def get_chat_history(session_id, limit=20):
    try:
        conn = get_db_connection()
        if not conn:
            return []
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT role, content FROM chat_history 
            WHERE session_id = %s 
            ORDER BY created_at DESC 
            LIMIT %s
        """, (session_id, limit))
        history = list(reversed(cur.fetchall()))
        cur.close()
        conn.close()
        return [{"role": h["role"], "content": h["content"]} for h in history]
    except Exception as e:
        print(f"Erro get_chat_history: {e}")
        return []

def save_chat_message(session_id, role, content):
    try:
        conn = get_db_connection()
        if not conn:
            return False
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
        print(f"Erro save_chat_message: {e}")
        return False

# ============== CLIENTE LLM (GROQ OU OPENAI) ==============

client = None
LLM_ENABLED = False
LLM_MODEL = "gpt-4o-mini"  # Padrão OpenAI

if OPENAI_AVAILABLE:
    try:
        # Prioriza Groq (gratuito), senão usa OpenAI
        if GROQ_API_KEY:
            client = OpenAI(
                api_key=GROQ_API_KEY,
                base_url="https://api.groq.com/openai/v1"
            )
            LLM_MODEL = "llama-3.1-8b-instant"  # Modelo gratuito do Groq
            LLM_ENABLED = True
            print("Usando Groq API")
        elif OPENAI_API_KEY:
            client = OpenAI(api_key=OPENAI_API_KEY)
            LLM_MODEL = "gpt-4o-mini"
            LLM_ENABLED = True
            print("Usando OpenAI API")
        else:
            print("Nenhuma API Key configurada (GROQ_API_KEY ou OPENAI_API_KEY)")
    except Exception as e:
        print(f"Aviso: Erro ao configurar LLM: {e}")

# ============== HANDLER ==============

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            # Ler body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            
            user_message = data.get('message', '')
            session_id = data.get('session_id', 'default')
            
            if not user_message:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Mensagem vazia'}).encode())
                return
            
            # Se OpenAI não está configurado, retorna fallback
            if not LLM_ENABLED or not client:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'response': "Ops, o Matteo está de folga hoje! Tenta mais tarde. 😅",
                    'session_id': session_id
                }).encode())
                return
            
            # Inicializar banco (se disponível)
            init_db()
            
            # Salvar mensagem do usuário
            save_chat_message(session_id, 'user', user_message)
            
            # Buscar histórico
            history = get_chat_history(session_id, limit=20)
            
            # Criar mensagens para API
            messages = [{'role': 'system', 'content': SYSTEM_PROMPT}] + history
            
            # Chamar LLM (Groq ou OpenAI)
            response = client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                max_tokens=150,
                temperature=0.8,
            )
            
            bot_response = response.choices[0].message.content
            
            # Salvar resposta
            save_chat_message(session_id, 'assistant', bot_response)
            
            # Responder
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps({
                'response': bot_response,
                'session_id': session_id
            }).encode())
            
        except Exception as e:
            import traceback
            error_msg = traceback.format_exc()
            print(f"Erro no Chatbot: {error_msg}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': str(e),
                'details': error_msg,
                'db_available': DB_AVAILABLE,
                'openai_available': OPENAI_AVAILABLE,
                'postgres_url_set': bool(POSTGRES_URL)
            }).encode())
