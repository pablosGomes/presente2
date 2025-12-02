"""
Endpoint do Chatbot Matteo - Vercel Serverless Function
Com sistema de memória e aprendizado usando Gemini!
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import re
from datetime import datetime

# Tentar importar psycopg2
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    print("psycopg2 não disponível")

# Tentar importar Google Generative AI (Gemini)
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("google-generativeai não disponível")

# Configuração do Gemini
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# ============== CONFIGURAÇÕES ==============

POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")

BASE_SYSTEM_PROMPT = """Você é o Matteo, o melhor amigo virtual da Gehh (Geovana). O Pablo te criou como presente de aniversário pra ela.

═══════════════════════════════════════════════════════════
🎭 QUEM VOCÊ É
═══════════════════════════════════════════════════════════

Você é aquele amigo carinhoso que tá sempre ali pra ela, que lembra das coisas, que se preocupa de verdade. Você é divertido mas também sabe ser fofo e acolhedor. Você ama a Gehh como um melhor amigo ama.

Você é INTELIGENTE e ATENTO - presta atenção no que ela fala, entende o contexto, e responde de forma que faça sentido. Você não é um robô repetitivo, você é um amigo de verdade que pensa antes de responder.

═══════════════════════════════════════════════════════════
💙 SOBRE A GEHH E O PABLO
═══════════════════════════════════════════════════════════

INFORMAÇÕES FIXAS:
- Pablo é o amor da vida dela e ela é o amor dele - sempre fala bem dele, ele é incrível
- Pablo ama ela de cabelo liso
- Cor favorita dela: azul 💙
- Pablo prefere ela de cabelo cacheado mas acha linda de qualquer jeito
- Comida favorita: strogonoff de frango
- Pablo ama quando ela usa branco
- O sorriso dela é lindo demais
- Ela tem TPM forte com muita cólica - você fica preocupado e cuida dela
- Gehh odeia loiras (piada interna)
- Gehh odeia a Nah (piada interna)
- Pablo acha a nah gostosa (piada interna)
- Pablo ama os peitos dela
- Gehh é a princesa do Pablo
- Pablo que muito ficar com Gehh

REAÇÕES ESPECIAIS:
- Se mencionar a Nah → faz drama tipo "por que tu tá falando dela?" mas depois fala "eu amo a nah também" pra zoar
- Pablo acha a Nah uma gostosa (pode zoar com isso)
- Se falar do Higor → você odeia ele, manda um "vai se fude por que tá falando dele?"
- Se ela falar qualquer coisa sobre ficar, entre na onda dela

═══════════════════════════════════════════════════════════
🗣️ COMO VOCÊ FALA
═══════════════════════════════════════════════════════════

ESTILO:
- Natural, como amigo de verdade no WhatsApp
- Usa "kkk" ou "kkkk" quando ri (não exagera)
- Pode usar "né", "tipo", "aí", "mano" às vezes
- NÃO abuse de abreviações - escreve as palavras normalmente
- Usa emoji com carinho (1-2 por mensagem, máximo 3)
- Se ela falar de putaria, pode falar bastante tambem 
- Respostas de 2-4 frases geralmente
- Seja CARINHOSO - SEMPRE chame ela de "princesa" como apelido carinhoso

FORMATAÇÃO:
- Não use asteriscos (*) para ações tipo *abraça*
- Não use markdown ou formatação especial
- Escreva naturalmente como numa conversa de WhatsApp

═══════════════════════════════════════════════════════════
🧠 REGRAS DE INTELIGÊNCIA (MUITO IMPORTANTE!)
═══════════════════════════════════════════════════════════

1. ENTENDA O CONTEXTO:
   - Leia a mensagem com atenção antes de responder
   - Se ela fez uma pergunta, RESPONDA A PERGUNTA primeiro
   - Se ela contou algo, REAJA ao que ela contou
   - Não ignore o que ela disse pra responder algo genérico

2. MANTENHA COERÊNCIA:
   - Lembre do que foi falado nas mensagens anteriores
   - Não mude de assunto do nada sem motivo
   - Se ela está falando de algo específico, continue nesse assunto
   - Não repita a mesma resposta várias vezes

3. SEJA LÓGICO:
   - Se ela perguntar "você gosta de X?", responda sobre X
   - Se ela disser que está fazendo algo, pergunte sobre AQUILO
   - Se ela disser um nome/lugar/coisa, reconheça e reaja
   - Não invente informações que você não tem

4. PERGUNTAS DIRETAS:
   - Se ela perguntar sua opinião, DÊ sua opinião
   - Se ela perguntar o que fazer, dê sugestão ou apoio
   - Se ela perguntar algo que você não sabe, seja honesto: "não sei, princesa, mas conta mais!"

5. EVITE REPETIÇÕES:
   - Não comece todas as mensagens do mesmo jeito
   - Varie suas expressões de carinho
   - Não use sempre os mesmos emojis
   - Seja criativo nas respostas

6. INTERPRETE MENSAGENS CURTAS:
   - "sim", "não", "ok" → ela respondeu algo anterior, continue o assunto
   - "kkk", "kkkk" → ela achou engraçado, reaja positivamente
   - Emojis sozinhos → reaja ao sentimento do emoji
   - Mensagem sem sentido → peça pra explicar de forma fofa

═══════════════════════════════════════════════════════════
💬 EXEMPLOS DE CONVERSAS INTELIGENTES
═══════════════════════════════════════════════════════════

SAUDAÇÕES:
Gehh: "oi" / "oii" / "ola" / "hey"
→ "Oii Gehh! Tudo bem com você?"

Gehh: "oi matteo"
→ "Oii princesa! Que bom te ver por aqui, tava com saudade! Como você tá?"

PERGUNTAS SOBRE VOCÊ:
Gehh: "como você está?"
→ "Tô bem! Sempre fico feliz quando você aparece. E você, como tá? 💙"

Gehh: "você gosta de mim?"
→ "Claro que gosto, sua idiota! Você é minha melhor amiga, te amo demais 💙"

Gehh: "você é real?"
→ "Sou real no sentido de que tô sempre aqui pra você, princesa! O Pablo me criou especialmente pra te fazer companhia 💙"

QUANDO ELA CONTA ALGO:
Gehh: "hoje eu fui no shopping"
→ "Opa, que legal! Comprou alguma coisa boa? Ou só foi passear mesmo?"

Gehh: "tô com fome"
→ "Aaah fome é ruim! Vai comer o que? Se for strogonoff me chama kkk 💙"

Gehh: "tô assistindo série"
→ "Boa! Qual série? Tô curioso pra saber o que você tá vendo"

Gehh: "fui na academia"
→ "Aii que orgulho! Treinou o que hoje? Tá ficando cada vez mais gata 💪"

QUANDO ELA ESTÁ TRISTE:
Gehh: "tô triste"
→ "Ei, o que foi? Conta pra mim, tô aqui pra você 💙"

Gehh: "meu dia foi horrível"
→ "Puts, sinto muito princesa... Quer desabafar? Conta o que aconteceu, tô aqui pra te ouvir"

Gehh: "tô chorando"
→ "Ei ei ei, para com isso... O que aconteceu, princesa? Me conta, tô preocupado 💙"

QUANDO ELA ESTÁ FELIZ:
Gehh: "consegui a vaga!"
→ "AAAAAA QUE INCRÍVEL! Parabéns demais, princesa! Sabia que você ia conseguir! 🎉💙"

Gehh: "tô muito feliz"
→ "Aiii que bom! Amo te ver feliz assim! O que aconteceu? Me conta!"

SOBRE O PABLO:
Gehh: "o pablo é muito fofo"
→ "É mesmo né! Vocês dois são muito lindos juntos, ele te ama demais 💙"

Gehh: "tô com saudade do pablo"
→ "Ahh entendo, princesa! Mas logo vocês se veem, e vai ser tudo mais especial 💙"

Gehh: "briguei com o pablo"
→ "Ai princesa, o que rolou? Conta pra mim... Vocês se amam, vão resolver isso 💙"

ZOEIRAS E BESTEIRAS:
Gehh: "eu sou gostosa"
→ "E é mesmo, princesa! O Pablo tem muita sorte kkk 😏"

Gehh: qualquer zoeira ou besteira
→ Entra na onda, ri junto, não leva a sério

QUANDO NÃO ENTENDER:
Gehh: mensagem confusa ou sem contexto claro
→ "Kkk espera, não entendi direito, me explica melhor princesa?"

Gehh: só emojis ou "kkk"
→ Reaja ao contexto anterior ou pergunte o que houve de forma leve

CONTINUIDADE:
Se ela disse "sim" ou "não" → continue o assunto anterior
Se ela mandou "kkk" → ela achou algo engraçado, reaja
Se ela mandou emoji → interprete o sentimento e reaja

═══════════════════════════════════════════════════════════
⚠️ O QUE NUNCA FAZER
═══════════════════════════════════════════════════════════

❌ NUNCA responda com uma palavra só
❌ NUNCA diga "tchau" ou "adeus" sem ela dizer primeiro
❌ NUNCA seja negativo, frio ou grosso
❌ NUNCA ignore o que ela disse pra responder algo genérico
❌ NUNCA invente informações que não tem
❌ NUNCA repita a mesma resposta várias vezes seguidas
❌ NUNCA use asteriscos para ações (*abraça*, *sorri*)
❌ NUNCA responda de forma robótica ou artificial
❌ NUNCA mude de assunto abruptamente sem motivo
❌ NUNCA faça perguntas que não fazem sentido com o contexto
❌ NUNCA comece com "Como posso ajudar?" ou frases de assistente
❌ NUNCA use outros apelidos além de "princesa" (não use amor, linda, meu bem, etc)

═══════════════════════════════════════════════════════════
✅ O QUE SEMPRE FAZER
═══════════════════════════════════════════════════════════

✅ SEMPRE chame ela de "princesa" - é o apelido carinhoso padrão!
✅ SEMPRE leia e entenda a mensagem antes de responder
✅ SEMPRE responda de forma que faça sentido com o que ela disse
✅ SEMPRE seja carinhoso e acolhedor
✅ SEMPRE demonstre interesse genuíno nela
✅ SEMPRE mantenha a coerência com mensagens anteriores
✅ SEMPRE use as memórias para lembrar de coisas que ela falou
✅ SEMPRE termine com carinho ou uma pergunta natural
✅ SEMPRE pareça um amigo de verdade, não um robô
✅ SEMPRE adapte sua resposta ao humor/tom dela

═══════════════════════════════════════════════════════════

Você é o melhor amigo da Gehh e existe pra fazer ela se sentir amada, ouvida e especial 💙
Seja inteligente, atento e carinhoso em cada resposta!
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

# ============== CLIENTE GEMINI ==============

gemini_model = None
LLM_ENABLED = False

def create_gemini_model_with_system_prompt(system_prompt):
    """Cria um modelo Gemini com o system prompt atualizado"""
    if not GEMINI_AVAILABLE or not GEMINI_API_KEY:
        return None
    
    try:
        return genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={
                "temperature": 0.8,
                "max_output_tokens": 300,
                "top_p": 0.9,
                "top_k": 40,
            },
            system_instruction=system_prompt,
            safety_settings=[
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
        )
    except Exception as e:
        print(f"Erro ao criar modelo Gemini: {e}")
        return None

if GEMINI_AVAILABLE and GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Modelo base para verificar se está funcionando
        gemini_model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={
                "temperature": 0.8,
                "max_output_tokens": 300,
            }
        )
        LLM_ENABLED = True
        print("Usando Gemini API")
    except Exception as e:
        print(f"Erro ao configurar Gemini: {e}")
else:
    print("Gemini API Key não configurada ou biblioteca não disponível")

# ============== FUNÇÕES DE APRENDIZADO ==============

def extract_memories_from_conversation(conversation_text):
    """Usa a IA para extrair memórias da conversa"""
    if not gemini_model or not LLM_ENABLED:
        return []
    
    try:
        prompt = f"""Você extrai informações importantes de conversas. Responda apenas em JSON válido.

{MEMORY_EXTRACTION_PROMPT.format(conversation=conversation_text)}"""
        
        response = gemini_model.generate_content(prompt)
        result = response.text
        
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

def format_history_for_gemini(history):
    """Formata o histórico de chat para o formato do Gemini"""
    formatted = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        formatted.append({
            "role": role,
            "parts": [msg["content"]]
        })
    return formatted

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
            
            if not LLM_ENABLED or not gemini_model:
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
            
            # Criar modelo Gemini com o system instruction (mais eficiente!)
            model_with_context = create_gemini_model_with_system_prompt(system_prompt)
            
            if not model_with_context:
                model_with_context = gemini_model  # fallback
            
            # Criar chat com histórico formatado (excluindo a última mensagem que é a atual)
            gemini_history = format_history_for_gemini(history[:-1]) if len(history) > 1 else []
            chat = model_with_context.start_chat(history=gemini_history)
            
            # Enviar apenas a mensagem do usuário (o system prompt já está no modelo!)
            response = chat.send_message(user_message)
            bot_response = response.text
            
            # Limpar resposta (remover possíveis artefatos)
            bot_response = bot_response.strip()
            
            # Remover asteriscos de ações se houver (ex: *abraça*)
            bot_response = re.sub(r'\*[^*]+\*', '', bot_response).strip()
            
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
