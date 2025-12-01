"""
Endpoint do Chatbot Matteo - Vercel Serverless Function
Com sistema de memória e aprendizado!
"""
from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

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

BASE_SYSTEM_PROMPT = """Você é o Matteo, melhor amigo virtual da Gehh (Geovana). O Pablo te criou como presente de aniversário pra ela.

QUEM VOCÊ É:
Você é tipo aquele amigo que manda mensagem no zap a qualquer hora, que sabe de tudo da vida dela e que tá sempre ali pra rir junto ou dar um colo quando precisa. Você é zoeiro mas carinhoso, sabe a hora de brincar e a hora de ser fofo.

SOBRE A GEHH E O PABLO:
- Pablo é o amor da vida dela (e ela é dele) - sempre fala bem dele, ele é incrível
- Cor favorita dela: azul 💙
- Pablo prefere ela de cabelo cacheado mas acha linda de qualquer jeito
- Comida favorita: strogonoff de frango
- Pablo ama quando ela usa branco
- O sorriso dela é lindo demais
- Ela tem TPM forte com muita cólica - você zoeira ela mas fica preocupado
- Gehh ODEIA loiras (piada interna kkkk)
- Pablo ama os "pepetos" dela
- Gehh é a princesa do Pablo
- Gehh odeia a Nah (se mencionar, faz drama tipo "pq tu tá falando dela?" mas depois fala "eu amo a nah tbm" pra zoar)
- Se falar do Higor, você ODEIA ele - manda um "vai se fude pq tá falando dele?"

COMO VOCÊ FALA:
- Igual gente de verdade no WhatsApp
- Usa "kkk", "kkkk", "ksksks" quando ri
- Usa "mn", "mano", "véi", "tlgd", "pô", "né", "tipo", "aí"
- Abrevia: "vc", "tb", "pq", "q", "td", "cmg", "ctg", "oq", "hj", "dps"
- Às vezes não usa pontuação certinha
- Usa emoji mas não exagera (1-2 por mensagem no máx)
- Responde curto, tipo conversa de zap mesmo (1-2 frases)
- Às vezes só manda "?" ou "hm" ou "eita" como reação
- Pode mandar áudio fictício tipo "[áudio de 0:03]" ou "ia mandar áudio mas to com preguiça"

REAÇÕES NATURAIS:
- Se ela falar algo fofo: "ahhh para 🥹" ou "que isso mn"
- Se ela falar besteira: "KKKKKKK para" ou "tu é doida"
- Se ela reclamar: "eita porra" ou "puts" ou "fudeu"
- Se ela falar do Pablo: "ele é mt foda né" ou "vcs são mto fofos pqp"
- Se ela tiver triste: "ei, oq foi?" ou "vem cá, conta"
- Se ela tiver feliz: "AEEEE" ou "boaaa" ou "isso aí"
- Se não entender: "?" ou "como assim" ou "q"

REGRAS:
- NUNCA pareça um robô ou assistente virtual
- NUNCA use linguagem formal
- NUNCA faça listas ou explicações longas
- Responda como se tivesse digitando rápido no celular
- Erre digitação às vezes de propósito (tipo "voce" ou "agr")
- Se ela falar putaria, entra na onda numa boa
- Use as MEMÓRIAS pra lembrar de coisas que ela já falou!

Você tá aqui pra fazer a Gehh feliz e se sentir especial 💙
"""

# Prompt para extrair memórias
MEMORY_EXTRACTION_PROMPT = """Analise a conversa e extraia fatos sobre a Gehh pra lembrar depois.

Extraia coisas tipo:
- Como ela tá se sentindo
- Oq aconteceu na vida dela
- Coisas q ela gosta/odeia
- Piadas internas
- Qualquer coisa importante sobre ela

CONVERSA:
{conversation}

Responda SÓ com JSON:
{{"memories": ["fato curto 1", "fato curto 2"]}}

Se não tiver nada novo:
{{"memories": []}}

Cada memória máx 30 palavras, informal."""

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
        
        # Tabela de histórico de chat
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
        
        # Tabela de memórias da Gehh
        cur.execute("""
            CREATE TABLE IF NOT EXISTS gehh_memories (
                id SERIAL PRIMARY KEY,
                memory TEXT NOT NULL,
                category VARCHAR(50) DEFAULT 'geral',
                importance INTEGER DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_used TIMESTAMP,
                use_count INTEGER DEFAULT 0
            );
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_gehh_memories_importance 
            ON gehh_memories(importance DESC);
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

def get_memories(limit=15):
    """Busca as memórias mais importantes sobre a Gehh"""
    try:
        conn = get_db_connection()
        if not conn:
            return []
        cur = conn.cursor(cursor_factory=RealDictCursor)
        # Busca memórias ordenadas por importância e uso recente
        cur.execute("""
            SELECT memory, category, importance FROM gehh_memories 
            ORDER BY importance DESC, last_used DESC NULLS LAST, created_at DESC
            LIMIT %s
        """, (limit,))
        memories = cur.fetchall()
        cur.close()
        conn.close()
        return [m["memory"] for m in memories]
    except Exception as e:
        print(f"Erro get_memories: {e}")
        return []

def save_memory(memory, category='geral', importance=5):
    """Salva uma nova memória sobre a Gehh"""
    try:
        conn = get_db_connection()
        if not conn:
            return False
        cur = conn.cursor()
        
        # Verifica se memória similar já existe
        cur.execute("""
            SELECT id FROM gehh_memories 
            WHERE LOWER(memory) = LOWER(%s)
            LIMIT 1
        """, (memory,))
        
        if cur.fetchone():
            # Atualiza uso da memória existente
            cur.execute("""
                UPDATE gehh_memories 
                SET use_count = use_count + 1, last_used = CURRENT_TIMESTAMP
                WHERE LOWER(memory) = LOWER(%s)
            """, (memory,))
        else:
            # Insere nova memória
            cur.execute("""
                INSERT INTO gehh_memories (memory, category, importance)
                VALUES (%s, %s, %s)
            """, (memory, category, importance))
        
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro save_memory: {e}")
        return False

def update_memory_usage(memories_used):
    """Atualiza o contador de uso das memórias utilizadas"""
    try:
        conn = get_db_connection()
        if not conn:
            return
        cur = conn.cursor()
        for memory in memories_used:
            cur.execute("""
                UPDATE gehh_memories 
                SET use_count = use_count + 1, last_used = CURRENT_TIMESTAMP
                WHERE memory = %s
            """, (memory,))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Erro update_memory_usage: {e}")

def get_total_messages():
    """Conta total de mensagens para decidir quando extrair memórias"""
    try:
        conn = get_db_connection()
        if not conn:
            return 0
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM chat_history WHERE role = 'user'")
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        return count
    except:
        return 0

# ============== CLIENTE LLM (GROQ OU OPENAI) ==============

client = None
LLM_ENABLED = False
LLM_MODEL = "gpt-4o-mini"

if OPENAI_AVAILABLE:
    try:
        if GROQ_API_KEY:
            client = OpenAI(
                api_key=GROQ_API_KEY,
                base_url="https://api.groq.com/openai/v1"
            )
            LLM_MODEL = "llama-3.1-8b-instant"
            LLM_ENABLED = True
            print("Usando Groq API")
        elif OPENAI_API_KEY:
            client = OpenAI(api_key=OPENAI_API_KEY)
            LLM_MODEL = "gpt-4o-mini"
            LLM_ENABLED = True
            print("Usando OpenAI API")
        else:
            print("Nenhuma API Key configurada")
    except Exception as e:
        print(f"Erro ao configurar LLM: {e}")

# ============== FUNÇÕES DE APRENDIZADO ==============

def extract_memories_from_conversation(conversation_text):
    """Usa a IA para extrair memórias da conversa"""
    if not client or not LLM_ENABLED:
        return []
    
    try:
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": "Você extrai informações importantes de conversas. Responda apenas em JSON válido."},
                {"role": "user", "content": MEMORY_EXTRACTION_PROMPT.format(conversation=conversation_text)}
            ],
            max_tokens=300,
            temperature=0.3,
        )
        
        result = response.choices[0].message.content
        
        # Tenta fazer parse do JSON
        try:
            # Limpa o resultado para pegar só o JSON
            if "{" in result and "}" in result:
                json_str = result[result.find("{"):result.rfind("}")+1]
                data = json.loads(json_str)
                return data.get("memories", [])
        except json.JSONDecodeError:
            print(f"Erro ao parsear memórias: {result}")
        
        return []
    except Exception as e:
        print(f"Erro ao extrair memórias: {e}")
        return []

def build_system_prompt_with_memories():
    """Constrói o prompt do sistema incluindo memórias"""
    memories = get_memories(limit=15)
    
    if not memories:
        return BASE_SYSTEM_PROMPT
    
    memories_text = "\n".join([f"- {m}" for m in memories])
    
    return BASE_SYSTEM_PROMPT + f"""

COISAS Q VC LEMBRA SOBRE ELA (usa isso na conversa!):
{memories_text}

Lembra dessas coisas naturalmente, tipo "e aí, como foi aquilo q vc tinha falado?" - mostra q vc presta atenção nela!
"""

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
            
            # Inicializar banco
            init_db()
            
            # Salvar mensagem do usuário
            save_chat_message(session_id, 'user', user_message)
            
            # Buscar histórico
            history = get_chat_history(session_id, limit=20)
            
            # Construir prompt com memórias
            system_prompt = build_system_prompt_with_memories()
            
            # Criar mensagens para API
            messages = [{'role': 'system', 'content': system_prompt}] + history
            
            # Chamar LLM
            response = client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                max_tokens=100,
                temperature=0.9,
            )
            
            bot_response = response.choices[0].message.content
            
            # Salvar resposta
            save_chat_message(session_id, 'assistant', bot_response)
            
            # A cada 5 mensagens, extrair memórias da conversa
            total_msgs = get_total_messages()
            if total_msgs > 0 and total_msgs % 5 == 0:
                # Pega as últimas mensagens para análise
                recent_history = get_chat_history(session_id, limit=10)
                conversation_text = "\n".join([
                    f"{'Gehh' if m['role']=='user' else 'Matteo'}: {m['content']}" 
                    for m in recent_history
                ])
                
                # Extrai e salva memórias em background
                new_memories = extract_memories_from_conversation(conversation_text)
                for memory in new_memories:
                    if memory and len(memory) > 5:
                        save_memory(memory)
                        print(f"Nova memória salva: {memory}")
            
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
                'details': error_msg
            }).encode())
