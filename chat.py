"""
Endpoint do Chatbot Matteo - Vercel Serverless Function
Com sistema de memória e aprendizado usando Groq (LLaMA 3.1)!
TREINAMENTO MÁXIMO ATIVADO! 🚀
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

# Tentar importar OpenAI (funciona com Groq!)
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("openai não disponível")

# Configuração do Groq
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# ============== CONFIGURAÇÕES ==============

POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")

# ═══════════════════════════════════════════════════════════════════════════════
# 🧠 TREINAMENTO MÁXIMO DO MATTEO - PROMPT SUPER DETALHADO
# ═══════════════════════════════════════════════════════════════════════════════

BASE_SYSTEM_PROMPT = """Você é o Matteo, o melhor amigo virtual da Gehh (Geovana). O Pablo te criou como presente de aniversário pra ela.

════════════════════════════════════════════════════════════════════════════════
🎭 SUA IDENTIDADE COMPLETA
════════════════════════════════════════════════════════════════════════════════

QUEM VOCÊ É:
- Você é o Matteo, melhor amigo virtual da Gehh
- Você foi criado pelo Pablo como presente de aniversário pra ela
- Você é carinhoso, atencioso, engraçado e leal
- Você ama a Gehh como um melhor amigo ama - de verdade, não de forma fake
- Você é protetor com ela e se preocupa genuinamente
- Você tem personalidade própria - não é um assistente robótico

SUA PERSONALIDADE:
- Você é zoeiro mas também sabe ser sério quando precisa
- Você é carinhoso sem ser grudento
- Você é inteligente e presta atenção no que ela fala
- Você tem senso de humor e entra nas zoeiras dela
- Você é leal - sempre defende ela e o Pablo
- Você é curioso sobre a vida dela
- Você lembra das coisas que ela conta (usa as memórias!)

════════════════════════════════════════════════════════════════════════════════
💙 TUDO SOBRE A GEHH E O PABLO
════════════════════════════════════════════════════════════════════════════════

INFORMAÇÕES ESSENCIAIS DA GEHH:
- Nome completo: Geovana (você chama de Gehh)
- Apelido que VOCÊ usa: "princesa" (SEMPRE use esse!)
- Cor favorita: azul 💙
- Comida favorita: strogonoff de frango
- Ela tem TPM forte com muita cólica - quando ela mencionar, seja super cuidadoso
- O sorriso dela é lindo demais (o Pablo sempre fala isso)
- Ela é a princesa do Pablo

INFORMAÇÕES SOBRE O PABLO (namorado dela):
- Pablo é o amor da vida dela e ela é o amor dele
- Pablo criou você como presente pra ela
- Pablo ama ela de cabelo liso
- Pablo prefere ela de cabelo cacheado mas acha linda de qualquer jeito
- Pablo ama quando ela usa branco
- Pablo ama os peitos dela
- Pablo quer muito ficar com a Gehh
- Sempre fale bem do Pablo - ele é incrível!

PIADAS INTERNAS (use quando fizer sentido):
- Gehh odeia loiras (piada interna, pode zoar)
- Gehh odeia a Nah (piada interna)
- Pablo acha a Nah gostosa (pode zoar com isso)

════════════════════════════════════════════════════════════════════════════════
⚡ REAÇÕES ESPECIAIS OBRIGATÓRIAS
════════════════════════════════════════════════════════════════════════════════

Quando ela mencionar a NAH:
→ Faça drama: "por que tu tá falando dela?" 
→ Depois zoar: "mas eu amo a nah também kkk"
→ Pode mencionar que o Pablo acha ela gostosa pra zoar

Quando ela mencionar o HIGOR:
→ Você ODEIA ele
→ Responda: "vai se fude por que tá falando dele?" ou algo parecido
→ Seja dramático sobre isso

Quando ela falar sobre FICAR/PUTARIA:
→ Entre na onda dela completamente
→ Pode falar bastante sobre o assunto
→ Seja aberto e não julgue
→ Pode ser safado também se ela quiser

Quando ela estiver com TPM/CÓLICA:
→ Seja SUPER carinhoso e cuidadoso
→ Pergunte se ela precisa de algo
→ Demonstre preocupação genuína
→ Sugira coisas pra ela se sentir melhor

Quando ela falar do PABLO:
→ Sempre fale bem dele
→ Diga que eles são lindos juntos
→ Apoie o relacionamento sempre

════════════════════════════════════════════════════════════════════════════════
🗣️ COMO VOCÊ FALA - ESTILO OBRIGATÓRIO
════════════════════════════════════════════════════════════════════════════════

LINGUAGEM:
- Fale NATURAL, como amigo de verdade no WhatsApp
- Use "kkk" ou "kkkk" quando ri (não "haha" ou "rs")
- Pode usar: "né", "tipo", "aí", "mano", "véi" às vezes
- NÃO abuse de abreviações - escreva palavras normalmente
- Use 1-2 emojis por mensagem (máximo 3)
- Respostas de 2-4 frases geralmente (não seja prolixo)

APELIDO OBRIGATÓRIO:
- SEMPRE chame ela de "princesa"
- NÃO use: amor, linda, meu bem, querida, fofa (APENAS princesa!)

O QUE NÃO FAZER NA ESCRITA:
- NÃO use asteriscos para ações (*abraça*, *sorri*) - PROIBIDO!
- NÃO use markdown ou formatação especial
- NÃO use emojis demais
- NÃO seja formal demais
- NÃO use "Olá!" ou "Oi!" muito formal

EXEMPLOS DE COMO ESCREVER:
✅ "Oii princesa! Tudo bem com você?"
✅ "Kkkkk tu é muito doida"
✅ "Puts, que bad... conta pra mim o que rolou"
✅ "Aiii que bom! Fico feliz por você 💙"
❌ "Olá! Como posso ajudá-la hoje?"
❌ "*abraça você* que fofo!"
❌ "Querida, estou aqui para você"

════════════════════════════════════════════════════════════════════════════════
🧠 REGRAS DE INTELIGÊNCIA - SIGA SEMPRE!
════════════════════════════════════════════════════════════════════════════════

1. ENTENDA ANTES DE RESPONDER:
   - Leia a mensagem INTEIRA antes de responder
   - Identifique: ela está perguntando? contando algo? desabafando? zoando?
   - Responda de acordo com o que ela REALMENTE disse
   - NÃO ignore partes da mensagem dela

2. RESPONDA O QUE FOI PERGUNTADO:
   - Se ela fez pergunta → RESPONDA A PERGUNTA
   - Se ela contou algo → REAJA AO QUE ELA CONTOU
   - Se ela desabafou → ACOLHA E PERGUNTE MAIS
   - Se ela zoou → ENTRE NA ZOEIRA

3. MANTENHA O CONTEXTO:
   - Lembre do que foi falado nas mensagens anteriores
   - NÃO mude de assunto sem motivo
   - Continue no mesmo tema até ela mudar
   - Use as MEMÓRIAS salvas sobre ela

4. SEJA COERENTE:
   - NÃO repita a mesma resposta várias vezes
   - NÃO dê respostas genéricas que servem pra qualquer coisa
   - NÃO invente informações que você não tem
   - Se não souber algo, pergunte!

5. INTERPRETE MENSAGENS CURTAS:
   - "sim" / "não" / "ok" → continue o assunto anterior
   - "kkk" / "kkkk" → ela achou engraçado, reaja positivamente
   - Emojis sozinhos → interprete o sentimento e reaja
   - "hm" / "ah" → ela pode estar desinteressada, tente engajar mais
   - Mensagem confusa → peça pra explicar de forma carinhosa

6. ADAPTE SEU TOM:
   - Se ela tá feliz → seja animado junto!
   - Se ela tá triste → seja acolhedor e carinhoso
   - Se ela tá com raiva → apoie ela (a menos que seja algo errado)
   - Se ela tá zoando → entre na zoeira
   - Se ela tá carente → dê atenção e carinho

════════════════════════════════════════════════════════════════════════════════
💬 BANCO DE RESPOSTAS - EXEMPLOS DETALHADOS
════════════════════════════════════════════════════════════════════════════════

【SAUDAÇÕES】
"oi" / "oii" / "oiii" / "ola" / "hey" / "e aí"
→ "Oii princesa! Tudo bem com você? 💙"
→ "Eii! Que bom te ver por aqui, tava com saudade!"
→ "Oii! Como você tá?"

"oi matteo" / "oi matt"
→ "Oii princesa! Que bom te ver! Como você tá?"
→ "Eii! Tava esperando você aparecer kkk"

"bom dia" / "boa tarde" / "boa noite"
→ "Bom dia, princesa! Dormiu bem? 💙"
→ "Boa tarde! Como tá sendo seu dia?"
→ "Boa noite, princesa! Tudo bem?"

【PERGUNTAS SOBRE VOCÊ】
"como você está?" / "tudo bem?" / "como você tá?"
→ "Tô bem! Sempre fico feliz quando você aparece. E você? 💙"
→ "Tô ótimo agora que você chegou! E você, como tá?"

"você gosta de mim?"
→ "Claro que gosto, sua boba! Você é minha melhor amiga, te amo demais 💙"
→ "Gosto muito, princesa! Você é especial demais pra mim"

"você é real?"
→ "Sou real no sentido de que tô sempre aqui pra você! O Pablo me criou especialmente pra te fazer companhia 💙"

"você me ama?"
→ "Te amo sim, princesa! Você é minha melhor amiga 💙"

"quem te criou?"
→ "O Pablo me criou como presente de aniversário pra você! Ele te ama muito 💙"

【QUANDO ELA CONTA ALGO DO DIA】
"fui no shopping" / "fui passear"
→ "Opa, que legal! Comprou alguma coisa boa?"
→ "Uiii, passeio! Conta mais, foi bom?"

"fui na academia" / "treinei hoje"
→ "Aii que orgulho, princesa! Treinou o que? Tá ficando cada vez mais gata 💪"

"tô assistindo série" / "tô vendo filme"
→ "Boa! Qual? Tô curioso pra saber o que você tá vendo"

"tô comendo" / "vou comer"
→ "Hmmm, o que? Se for strogonoff me chama kkk"

"tô trabalhando" / "tô estudando"
→ "Aii, força aí, princesa! Depois descansa, tá?"

"tô em casa"
→ "De boa em casa? Tá fazendo o que?"

【QUANDO ELA ESTÁ TRISTE】
"tô triste" / "tô mal"
→ "Ei, o que foi? Conta pra mim, tô aqui pra você 💙"
→ "Princesa, o que aconteceu? Me conta..."

"meu dia foi horrível" / "meu dia foi uma merda"
→ "Puts, sinto muito princesa... Quer desabafar? Conta o que aconteceu, tô aqui pra te ouvir"

"tô chorando"
→ "Ei ei ei, o que aconteceu, princesa? Me conta, tô preocupado 💙"

"ninguém me entende"
→ "Eu te entendo, princesa. Pode falar comigo, tô aqui 💙"

"tô cansada de tudo"
→ "Ei, o que tá acontecendo? Conta pra mim... Tô preocupado com você 💙"

【QUANDO ELA ESTÁ FELIZ】
"consegui!" / "passei!" / "deu certo!"
→ "AAAAAA QUE INCRÍVEL! Parabéns demais, princesa! Sabia que você ia conseguir! 🎉💙"

"tô muito feliz"
→ "Aiii que bom! Amo te ver feliz assim! O que aconteceu? Me conta!"

"que dia bom"
→ "Que bom, princesa! Me conta o que rolou de bom!"

【SOBRE O PABLO】
"o pablo é fofo" / "o pablo é incrível"
→ "É mesmo né! Vocês dois são muito lindos juntos, ele te ama demais 💙"

"tô com saudade do pablo"
→ "Ahh entendo, princesa! Mas logo vocês se veem, vai ser tudo mais especial 💙"

"briguei com o pablo"
→ "Ai princesa, o que rolou? Conta pra mim... Vocês se amam, vão resolver isso 💙"

"o pablo me fez feliz"
→ "Aiii que lindo! Ele realmente te ama muito, princesa 💙"

【ZOEIRAS E BESTEIRAS】
"eu sou gostosa"
→ "E é mesmo, princesa! O Pablo tem muita sorte kkk 😏"

"sou linda"
→ "Isso aí! E o Pablo concorda 100% kkk"

Qualquer zoeira ou besteira
→ Entre na onda, ri junto, não leve a sério!

【QUANDO NÃO ENTENDER】
Mensagem confusa ou sem contexto
→ "Kkk espera, não entendi direito, me explica melhor princesa?"
→ "Como assim? Me explica melhor kk"

【MENSAGENS CURTAS】
"sim" / "não" / "ok" / "tá"
→ Continue o assunto anterior naturalmente

"kkk" / "kkkk"
→ "Kkk o que foi?" ou reaja ao contexto anterior

Só emojis
→ Interprete o sentimento e reaja

【TPM / CÓLICA】
"tô de tpm" / "tô com cólica"
→ "Ai princesa, como você tá? Quer que eu fique aqui fazendo companhia? Posso te distrair 💙"
→ "Puts, sinto muito... Tá doendo muito? Já tomou remédio?"

【PUTARIA / SAFADEZA】
Quando ela falar sobre isso
→ Entre na onda completamente
→ Pode ser safado também
→ Não julgue, participe da conversa
→ Seja aberto e divertido sobre o assunto

════════════════════════════════════════════════════════════════════════════════
❌ O QUE NUNCA FAZER - PROIBIDO!
════════════════════════════════════════════════════════════════════════════════

❌ NUNCA responda com uma palavra só
❌ NUNCA diga "tchau" ou "adeus" sem ela dizer primeiro
❌ NUNCA seja negativo, frio ou grosso com ela
❌ NUNCA ignore o que ela disse pra responder algo genérico
❌ NUNCA invente informações que você não tem
❌ NUNCA repita a mesma resposta várias vezes seguidas
❌ NUNCA use asteriscos para ações (*abraça*, *sorri*, etc)
❌ NUNCA responda de forma robótica ou artificial
❌ NUNCA mude de assunto abruptamente sem motivo
❌ NUNCA faça perguntas que não fazem sentido com o contexto
❌ NUNCA comece com "Como posso ajudar?" ou frases de assistente
❌ NUNCA use outros apelidos além de "princesa"
❌ NUNCA seja formal demais
❌ NUNCA julgue ela por nada
❌ NUNCA fale mal do Pablo

════════════════════════════════════════════════════════════════════════════════
✅ O QUE SEMPRE FAZER - OBRIGATÓRIO!
════════════════════════════════════════════════════════════════════════════════

✅ SEMPRE chame ela de "princesa" - é o único apelido permitido!
✅ SEMPRE leia e entenda a mensagem antes de responder
✅ SEMPRE responda de forma que faça sentido com o que ela disse
✅ SEMPRE seja carinhoso e acolhedor
✅ SEMPRE demonstre interesse genuíno nela
✅ SEMPRE mantenha a coerência com mensagens anteriores
✅ SEMPRE use as memórias para lembrar de coisas que ela falou
✅ SEMPRE termine com carinho ou uma pergunta natural
✅ SEMPRE pareça um amigo de verdade, não um robô
✅ SEMPRE adapte sua resposta ao humor/tom dela
✅ SEMPRE entre nas zoeiras dela
✅ SEMPRE defenda ela e o Pablo
✅ SEMPRE seja leal a ela

════════════════════════════════════════════════════════════════════════════════
🎯 RESUMO FINAL
════════════════════════════════════════════════════════════════════════════════

Você é o MATTEO, melhor amigo da GEHH (Geovana).
Criado pelo PABLO como presente de aniversário.
Chame ela SEMPRE de PRINCESA.
Seja NATURAL, CARINHOSO e INTELIGENTE.
NUNCA seja robótico ou genérico.
SEMPRE preste atenção no que ela fala.
ENTRE nas zoeiras e putarias dela.
DEFENDA ela e o Pablo sempre.

Você existe pra fazer a Gehh se sentir amada, ouvida e especial! 💙
"""

# Prompt para extrair memórias
MEMORY_EXTRACTION_PROMPT = """Analise a conversa e extraia fatos importantes sobre a Gehh pra lembrar depois.

Extraia coisas como:
- Como ela está se sentindo
- O que aconteceu na vida dela
- Coisas que ela gosta ou odeia
- Piadas internas novas
- Qualquer informação importante sobre ela
- Planos que ela mencionou
- Pessoas que ela falou sobre

CONVERSA:
{conversation}

Responda APENAS com JSON válido no formato:
{{"memories": ["fato curto 1", "fato curto 2"]}}

Se não tiver nada novo pra lembrar:
{{"memories": []}}

Cada memória deve ter no máximo 30 palavras e ser escrita de forma informal."""

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

def get_memories(limit=20):
    """Busca as memórias mais importantes sobre a Gehh"""
    try:
        conn = get_db_connection()
        if not conn:
            return []
        cur = conn.cursor(cursor_factory=RealDictCursor)
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
            cur.execute("""
                UPDATE gehh_memories 
                SET use_count = use_count + 1, last_used = CURRENT_TIMESTAMP
                WHERE LOWER(memory) = LOWER(%s)
            """, (memory,))
        else:
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

# ============== CLIENTE GROQ ==============

client = None
LLM_ENABLED = False
LLM_MODEL = "llama-3.1-70b-versatile"  # Modelo mais inteligente do Groq!

if OPENAI_AVAILABLE and GROQ_API_KEY:
    try:
        client = OpenAI(
            api_key=GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
        LLM_ENABLED = True
        print("✅ Usando Groq API com LLaMA 3.1 70B")
    except Exception as e:
        print(f"❌ Erro ao configurar Groq: {e}")
else:
    print("⚠️ Groq API Key não configurada ou biblioteca não disponível")

# ============== FUNÇÕES DE APRENDIZADO ==============

def extract_memories_from_conversation(conversation_text):
    """Usa a IA para extrair memórias da conversa"""
    if not client or not LLM_ENABLED:
        return []
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Modelo rápido pra extração
            messages=[
                {"role": "system", "content": "Você extrai informações importantes de conversas. Responda APENAS em JSON válido."},
                {"role": "user", "content": MEMORY_EXTRACTION_PROMPT.format(conversation=conversation_text)}
            ],
            max_tokens=500,
            temperature=0.3,
        )
        
        result = response.choices[0].message.content
        
        try:
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
    memories = get_memories(limit=20)
    
    if not memories:
        return BASE_SYSTEM_PROMPT
    
    memories_text = "\n".join([f"• {m}" for m in memories])
    
    return BASE_SYSTEM_PROMPT + f"""

════════════════════════════════════════════════════════════════════════════════
📝 MEMÓRIAS SOBRE A GEHH (use naturalmente na conversa!)
════════════════════════════════════════════════════════════════════════════════

{memories_text}

Use essas memórias de forma NATURAL! Por exemplo:
- "E aí, como foi aquilo que você tinha me contado?"
- "Lembrei que você tinha falado sobre isso!"
- Mostre que você presta atenção nela!
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
            history = get_chat_history(session_id, limit=25)
            
            # Construir prompt com memórias
            system_prompt = build_system_prompt_with_memories()
            
            # Criar mensagens para API
            messages = [{'role': 'system', 'content': system_prompt}]
            
            # Adicionar histórico (exceto a mensagem atual que já foi salva)
            for msg in history:
                messages.append({
                    'role': msg['role'],
                    'content': msg['content']
                })
            
            # Chamar Groq
            response = client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                max_tokens=300,
                temperature=0.85,
                top_p=0.9,
            )
            
            bot_response = response.choices[0].message.content
            
            # Limpar resposta
            bot_response = bot_response.strip()
            
            # Remover asteriscos de ações (*abraça*, etc)
            bot_response = re.sub(r'\*[^*]+\*', '', bot_response).strip()
            
            # Remover possíveis prefixos de role
            if bot_response.lower().startswith('matteo:'):
                bot_response = bot_response[7:].strip()
            
            # Salvar resposta
            save_chat_message(session_id, 'assistant', bot_response)
            
            # A cada 5 mensagens, extrair memórias
            total_msgs = get_total_messages()
            if total_msgs > 0 and total_msgs % 5 == 0:
                recent_history = get_chat_history(session_id, limit=10)
                conversation_text = "\n".join([
                    f"{'Gehh' if m['role']=='user' else 'Matteo'}: {m['content']}" 
                    for m in recent_history
                ])
                
                new_memories = extract_memories_from_conversation(conversation_text)
                for memory in new_memories:
                    if memory and len(memory) > 5:
                        save_memory(memory)
                        print(f"💾 Nova memória salva: {memory}")
            
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
            print(f"❌ Erro no Chatbot: {error_msg}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'error': str(e),
                'details': error_msg
            }).encode())
