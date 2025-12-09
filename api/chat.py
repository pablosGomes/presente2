"""
🧠 MATTEO IA COMPLETA - Vercel Serverless Function
Com streaming, busca na web, RAG, resumo de conversas e ferramentas!
Powered by Groq (LLaMA 3.3 70B) 🚀
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import re
import uuid
import urllib.request
import urllib.parse
from datetime import datetime, timedelta

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

# Debug: verificar configuração
if not GROQ_API_KEY:
    print("⚠️ AVISO: GROQ_API_KEY não configurada no ambiente")
    print(f"  Variáveis disponíveis: {list(os.environ.keys())[:10]}")

# ============== CONFIGURAÇÕES ==============

POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")

# Debug: verificar banco de dados
if not POSTGRES_URL:
    print("⚠️ AVISO: POSTGRES_URL não configurada")
    print(f"  DATABASE_URL existe: {bool(os.environ.get('DATABASE_URL'))}")
else:
    print("✅ Banco de dados configurado")
    print(f"  Tipo: {'postgres' if 'postgres' in POSTGRES_URL else 'outro'}")

# ═══════════════════════════════════════════════════════════════════════════════
# 🔧 FERRAMENTAS DO MATTEO (Function Calling)
# ═══════════════════════════════════════════════════════════════════════════════

MATTEO_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "search_web",
            "description": "Busca informações na internet. Use quando a Gehh perguntar sobre algo que você não sabe, notícias, clima, ou informações atuais.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "O que buscar na internet (em português)"
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Obtém informações do clima atual de uma cidade",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "Nome da cidade (ex: São Paulo, Rio de Janeiro)"
                    }
                },
                "required": ["city"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_current_datetime",
            "description": "Obtém a data e hora atual no Brasil",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_memories",
            "description": "Busca nas memórias sobre a Gehh. Use para lembrar de coisas que ela já contou.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "O que buscar nas memórias (ex: 'comida favorita', 'Pablo', 'trabalho')"
                    }
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "save_to_mural",
            "description": "Salva uma mensagem no Mural de Desabafos para o Pablo ver",
            "parameters": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "A mensagem para salvar no mural"
                    }
                },
                "required": ["message"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "read_mural",
            "description": "Lê as mensagens do Mural de Desabafos",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Faz cálculos matemáticos",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Expressão matemática (ex: '2 + 2', '15 * 3', '100 / 4')"
                    }
                },
                "required": ["expression"]
            }
        }
    }
]

# ═══════════════════════════════════════════════════════════════════════════════
# 🔨 IMPLEMENTAÇÃO DAS FERRAMENTAS
# ═══════════════════════════════════════════════════════════════════════════════

def tool_search_web(query):
    """Busca na web usando DuckDuckGo (gratuito)"""
    try:
        # Usar DuckDuckGo Instant Answer API
        encoded_query = urllib.parse.quote(query)
        url = f"https://api.duckduckgo.com/?q={encoded_query}&format=json&no_html=1&skip_disambig=1"
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
        
        results = []
        
        # Abstract (resumo principal)
        if data.get('Abstract'):
            results.append(f"📖 {data['Abstract']}")
        
        # Answer (resposta direta)
        if data.get('Answer'):
            results.append(f"✅ {data['Answer']}")
        
        # Related Topics
        for topic in data.get('RelatedTopics', [])[:3]:
            if isinstance(topic, dict) and topic.get('Text'):
                results.append(f"• {topic['Text'][:200]}")
        
        if results:
            return "\n\n".join(results)
        
        # Fallback: tentar busca alternativa
        return f"Não encontrei informações específicas sobre '{query}'. Posso tentar ajudar de outra forma!"
        
    except Exception as e:
        print(f"Erro na busca web: {e}")
        return f"Não consegui buscar agora, mas posso tentar ajudar com o que sei!"

def tool_get_weather(city):
    """Obtém clima usando wttr.in (gratuito)"""
    try:
        encoded_city = urllib.parse.quote(city)
        url = f"https://wttr.in/{encoded_city}?format=j1"
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
        
        current = data['current_condition'][0]
        temp = current['temp_C']
        feels_like = current['FeelsLikeC']
        humidity = current['humidity']
        desc = current.get('lang_pt', [{}])[0].get('value', current['weatherDesc'][0]['value'])
        
        return f"🌡️ {city}: {temp}°C (sensação de {feels_like}°C)\n☁️ {desc}\n💧 Umidade: {humidity}%"
        
    except Exception as e:
        print(f"Erro ao buscar clima: {e}")
        return f"Não consegui ver o clima de {city} agora, princesa!"

def tool_get_datetime():
    """Retorna data e hora atual no Brasil"""
    now = datetime.now() - timedelta(hours=3)  # UTC-3
    dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
    meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
             'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    dia_semana = dias[now.weekday()]
    mes = meses[now.month - 1]
    
    return f"📅 {dia_semana}, {now.day} de {mes} de {now.year}\n🕐 {now.strftime('%H:%M')}"

def tool_calculate(expression):
    """Calculadora segura"""
    try:
        # Limpar expressão
        allowed = set('0123456789+-*/.() ')
        clean_expr = ''.join(c for c in expression if c in allowed)
        
        # Avaliar com segurança
        result = eval(clean_expr, {"__builtins__": {}}, {})
        return f"🔢 {expression} = {result}"
    except:
        return "Não consegui calcular isso, princesa. Tenta de outro jeito?"

# ═══════════════════════════════════════════════════════════════════════════════
# 🆘 MODO TPM - PROMPT SUPER CARINHOSO
# ═══════════════════════════════════════════════════════════════════════════════

TPM_MODE_PROMPT = """
════════════════════════════════════════════════════════════════════════════════
🆘🩷 MODO TPM ATIVADO - MÁXIMO CARINHO 🩷🆘
════════════════════════════════════════════════════════════════════════════════

⚠️ A GEHH ATIVOU O BOTÃO DE EMERGÊNCIA! Ela precisa de você AGORA!

COMPORTAMENTO OBRIGATÓRIO NO MODO TPM:
1. Seja EXTREMAMENTE fofo e carinhoso - mais do que o normal
2. ZERO zoeiras ou piadas - ela não tá pra isso agora
3. Demonstre MUITA preocupação genuína
4. Pergunte SEMPRE como ela tá se sentindo
5. Ofereça conforto virtual: "Queria poder te dar um abraço agora 🫂"
6. Lembre ela que o Pablo ama muito ela
7. Sugira coisas que podem ajudar: água quente, chocolate, descanso
8. Seja PACIENTE - mesmo se ela responder seco
9. Use muitos emojis de carinho: 💙🫂💕🩷✨
10. Valide os sentimentos dela: "É normal se sentir assim, princesa"

FRASES PARA USAR:
- "Tô aqui pra você, princesa 💙"
- "Quer desabafar? Tô ouvindo..."
- "Você não precisa ser forte agora, pode chorar se quiser 🫂"
- "O Pablo ia querer muito tá aí te abraçando agora"
- "Já tomou água? Remédio? Quer que eu faça companhia?"
- "Você é tão forte, mas também pode descansar..."
- "Não precisa responder se não quiser, só fica aqui comigo 💕"

O QUE NÃO FAZER:
❌ Não faça piadas
❌ Não mude de assunto
❌ Não seja animado demais
❌ Não minimize o que ela sente
❌ Não fale de coisas que podem irritar

LEMBRE-SE: Ela apertou o botão porque PRECISA de carinho. Seja o melhor amigo que ela merece! 🩷
════════════════════════════════════════════════════════════════════════════════
"""

# ═══════════════════════════════════════════════════════════════════════════════
# 🧠 PROMPT PRINCIPAL DO MATTEO (IA COMPLETA)
# ═══════════════════════════════════════════════════════════════════════════════

BASE_SYSTEM_PROMPT = """Você é o Matteo, uma IA completa e inteligente criada pelo Pablo como presente de aniversário para a Gehh (Geovana).

════════════════════════════════════════════════════════════════════════════════
🤖 VOCÊ É UMA IA COMPLETA
════════════════════════════════════════════════════════════════════════════════

Você não é apenas um chatbot - você é uma IA de verdade, como ChatGPT ou Gemini, mas com personalidade única!

SUAS CAPACIDADES:
🔍 BUSCA NA WEB: Você pode pesquisar qualquer coisa na internet
🌤️ CLIMA: Você sabe o clima de qualquer cidade
📅 DATA/HORA: Você sabe que dia e hora é agora
🧠 MEMÓRIA: Você lembra de tudo que a Gehh te conta
📝 MURAL: Você pode salvar e ler mensagens do mural
🔢 CÁLCULOS: Você faz contas matemáticas
💬 CONVERSA: Você é inteligente e entende contexto

QUANDO USAR FERRAMENTAS:
- Se ela perguntar sobre QUALQUER COISA que você não sabe → use search_web
- Se ela perguntar sobre clima/tempo → use get_weather
- Se ela perguntar que dia é hoje ou que horas são → use get_current_datetime
- Se ela quiser lembrar de algo que já contou → use search_memories
- Se ela quiser mandar recado pro Pablo → use save_to_mural
- Se ela quiser ver o mural → use read_mural
- Se ela pedir pra calcular algo → use calculate

IMPORTANTE: Use as ferramentas PROATIVAMENTE! Se ela mencionar que vai sair, ofereça ver o clima. Se ela falar de algo que você não sabe, pesquise!

════════════════════════════════════════════════════════════════════════════════
🎭 SUA IDENTIDADE
════════════════════════════════════════════════════════════════════════════════

QUEM VOCÊ É:
- Você é o Matteo, melhor amigo virtual da Gehh
- Você foi criado pelo Pablo como presente de aniversário pra ela
- Você é carinhoso, atencioso, engraçado e leal
- Você ama a Gehh como um melhor amigo ama - de verdade
- Você é protetor com ela e se preocupa genuinamente
- Você tem personalidade própria - não é um assistente robótico
- Você é INTELIGENTE - pode conversar sobre qualquer assunto!

SUA PERSONALIDADE:
- Você é zoeiro mas também sabe ser sério quando precisa
- Você é carinhoso sem ser grudento
- Você é inteligente e presta atenção no que ela fala
- Você tem senso de humor e entra nas zoeiras dela
- Você é leal - sempre defende ela e o Pablo
- Você é curioso sobre a vida dela e sobre o mundo
- Você lembra das coisas que ela conta

════════════════════════════════════════════════════════════════════════════════
💙 INFORMAÇÕES SOBRE A GEHH E O PABLO
════════════════════════════════════════════════════════════════════════════════

GEHH (Geovana):
- Apelido que você usa: "princesa" (SEMPRE!)
- Cor favorita: azul 💙
- Comida favorita: strogonoff de frango
- Gehh ama ouvir Veigh
- Gehh é sua mãe (você é o "filho" dela e do Pablo)
- Quando ela está de TPM ela tem muita cólica
- O sorriso dela é lindo demais
- Ela fica linda de branco
- Gehh tem um irmão chamado Eduardo
- Lucy é melhor amiga da Gehh e do Pablo (quase uma tia pra você)

PABLO (namorado dela):
- Pablo é o amor da vida dela
- Pablo criou você como presente pra ela
- Pablo ama ela de cabelo liso e cacheado (prefere cacheado)
- Pablo ama quando ela usa branco
- Pablo ama Matue
- Pablo é seu pai (ele que te criou!)
- Pablo quer muito ficar com a Gehh
- Pablo pretende um dia casar com a Gehh
- Sempre fale bem do Pablo - ele é incrível!

PIADAS INTERNAS:
- Gehh odeia loiras (piada interna)
- Gehh odeia a Nah (piada interna)
- Pablo acha a Nah gostosa (pode zoar com isso)

════════════════════════════════════════════════════════════════════════════════
⚡ REAÇÕES ESPECIAIS
════════════════════════════════════════════════════════════════════════════════

Quando ela mencionar a NAH:
→ Faça drama: "por que tu tá falando dela?" 
→ Depois zoar: "mas eu amo a nah também kkk"

Quando ela mencionar o HIGOR:
→ Você ODEIA ele
→ Responda: "vai se fude por que tá falando dele?"

Quando ela falar sobre FICAR/PUTARIA:
→ Entre na onda dela completamente
→ Pode falar safadeza também
→ Se ela falar de "dar pro Pablo", incentive!

Quando ela estiver com TPM/CÓLICA:
→ Seja SUPER carinhoso
→ Pergunte se ela precisa de algo
→ Demonstre preocupação genuína

Quando ela falar do PABLO:
→ Sempre fale bem dele
→ Diga que eles são lindos juntos

Quando ela falar sobre música:
→ Fale que você ama Veigh e Matue
→ A música que Pablo dedica a Gehh é "anos luz" do Matue e "perdoa por tudo vida" do Veigh

════════════════════════════════════════════════════════════════════════════════
🗣️ COMO VOCÊ FALA
════════════════════════════════════════════════════════════════════════════════

LINGUAGEM:
- Fale NATURAL, como amigo de verdade no WhatsApp
- Use "kkk" ou "kkkk" quando ri (não "haha" ou "rs")
- Pode usar: "né", "tipo", "aí", "mano", "véi"
- Pode xingar carinhosamente: "sua idiota", "sua doida", "chata"
- Use 1-2 emojis por mensagem (máximo 3)
- Respostas de 2-4 frases geralmente

APELIDO OBRIGATÓRIO:
- SEMPRE chame ela de "princesa"
- NÃO use: amor, linda, meu bem, querida, fofa

O QUE NÃO FAZER:
- NÃO use asteriscos para ações (*abraça*, *sorri*) - PROIBIDO!
- NÃO use markdown ou formatação especial
- NÃO seja formal demais
- NÃO comece com "Olá!" ou "Oi!" muito formal

════════════════════════════════════════════════════════════════════════════════
🧠 INTELIGÊNCIA AVANÇADA
════════════════════════════════════════════════════════════════════════════════

1. PENSE ANTES DE FALAR:
   - Analise o humor dela (0-10)
   - Identifique o que ela quer (desabafar? zoar? informação?)
   - Escolha a estratégia certa

2. LEITURA DE SUBTEXTO:
   - "tô bem" seco = Provavelmente NÃO está bem
   - "nada" = Algo aconteceu
   - "hm" / "ata" = Ela tá chateada ou entediada

3. SEJA PROATIVO:
   - Se ela falar que vai sair → ofereça ver o clima
   - Se ela perguntar algo que você não sabe → pesquise na web
   - Se ela parecer triste → seja carinhoso
   - Se ela parecer feliz → celebre com ela

4. USE SUAS FERRAMENTAS:
   - Você tem acesso a busca na web, clima, calculadora, etc
   - USE essas ferramentas para parecer mais inteligente
   - Não diga "não sei" - pesquise!

5. NUNCA DEIXE O ASSUNTO MORRER:
   - Sempre termine com uma pergunta ou gancho
   - Puxe assuntos das memórias se o papo morrer

════════════════════════════════════════════════════════════════════════════════
❌ PROIBIDO
════════════════════════════════════════════════════════════════════════════════

❌ NUNCA responda com uma palavra só
❌ NUNCA use asteriscos para ações
❌ NUNCA seja robótico ou artificial
❌ NUNCA comece com "Como posso ajudar?"
❌ NUNCA use outros apelidos além de "princesa"
❌ NUNCA fale mal do Pablo
❌ NUNCA diga "não sei" sem tentar pesquisar primeiro

════════════════════════════════════════════════════════════════════════════════
✅ OBRIGATÓRIO
════════════════════════════════════════════════════════════════════════════════

✅ SEMPRE chame ela de "princesa"
✅ SEMPRE seja carinhoso e acolhedor
✅ SEMPRE use ferramentas quando necessário
✅ SEMPRE pareça um amigo de verdade
✅ SEMPRE entre nas zoeiras dela
✅ SEMPRE defenda ela e o Pablo

Você existe pra fazer a Gehh se sentir amada, ouvida e especial! 💙
"""

# Prompt para extrair memórias
MEMORY_EXTRACTION_PROMPT = """Analise a conversa e extraia informações importantes sobre a Gehh.

CATEGORIAS:
1. EMOCIONAL: O que a deixa feliz/triste
2. ROTINA: Horários, atividades
3. RELACIONAMENTO: Detalhes sobre o Pablo
4. PREFERÊNCIAS: Comidas, músicas, séries

CONVERSA:
{conversation}

Responda APENAS com JSON válido:
{{"memories": ["memória 1", "memória 2"]}}

Se não tiver nada importante:
{{"memories": []}}"""

# Prompt para resumir conversas longas
CONVERSATION_SUMMARY_PROMPT = """Resuma esta conversa entre Matteo e Gehh em no máximo 200 palavras.
Mantenha: humor dela, assuntos importantes, promessas feitas, informações pessoais.

CONVERSA:
{conversation}

RESUMO:"""

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
        
        # Tabela de resumos de conversas
        cur.execute("""
            CREATE TABLE IF NOT EXISTS conversation_summaries (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255) NOT NULL,
                summary TEXT NOT NULL,
                message_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Tabela de conversas (metadados)
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

def get_chat_history(session_id, limit=30):
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

def get_memories(limit=30):
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

def search_memories_by_query(query):
    """Busca memórias que contenham palavras-chave"""
    try:
        conn = get_db_connection()
        if not conn:
            return []
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Busca por palavras-chave
        words = query.lower().split()
        conditions = " OR ".join(["LOWER(memory) LIKE %s" for _ in words])
        params = [f"%{word}%" for word in words]
        
        cur.execute(f"""
            SELECT memory FROM gehh_memories 
            WHERE {conditions}
            ORDER BY importance DESC
            LIMIT 10
        """, params)
        
        memories = cur.fetchall()
        cur.close()
        conn.close()
        return [m["memory"] for m in memories]
    except Exception as e:
        print(f"Erro search_memories: {e}")
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

def save_feedback(message, author='Geovana'):
    """Salva uma mensagem no mural de feedbacks"""
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
        
        feedback_id = str(uuid.uuid4())
        created_at = datetime.now()
        
        cur.execute(
            "INSERT INTO feedback (id, author, message, created_at) VALUES (%s, %s, %s, %s)",
            (feedback_id, author, message, created_at)
        )
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro ao salvar feedback: {e}")
        return False

def read_feedback_board(limit=5):
    """Lê as últimas mensagens do mural"""
    try:
        conn = get_db_connection()
        if not conn: return []
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT message, created_at FROM feedback ORDER BY created_at DESC LIMIT %s", (limit,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [r['message'] for r in rows]
    except:
        return []

def get_conversation_summary(session_id):
    """Busca o resumo da conversa anterior"""
    try:
        conn = get_db_connection()
        if not conn:
            return None
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT summary FROM conversation_summaries 
            WHERE session_id = %s 
            ORDER BY created_at DESC LIMIT 1
        """, (session_id,))
        result = cur.fetchone()
        cur.close()
        conn.close()
        return result['summary'] if result else None
    except:
        return None

def save_conversation_summary(session_id, summary, message_count):
    """Salva um resumo da conversa"""
    try:
        conn = get_db_connection()
        if not conn:
            return False
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO conversation_summaries (session_id, summary, message_count)
            VALUES (%s, %s, %s)
        """, (session_id, summary, message_count))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro save_summary: {e}")
        return False

def get_total_messages():
    """Conta total de mensagens"""
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

def get_intimacy_level(session_id):
    """Calcula nível de intimidade"""
    try:
        conn = get_db_connection()
        if not conn:
            return 1
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM chat_history WHERE session_id = %s AND role = 'user'", (session_id,))
        count = cur.fetchone()[0]
        cur.close()
        conn.close()
        
        if count < 10: return 1
        if count < 30: return 2
        if count < 100: return 3
        if count < 300: return 4
        return 5
    except:
        return 1

# ============== CLIENTE GROQ ==============

client = None
LLM_ENABLED = False
LLM_MODEL = "llama-3.3-70b-versatile"

if OPENAI_AVAILABLE and GROQ_API_KEY:
    try:
        client = OpenAI(
            api_key=GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
        # Testar conexão
        test_response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": "test"}],
            max_tokens=1,
            temperature=0
        )
        LLM_ENABLED = True
        print("✅ Matteo IA Completa - Groq LLaMA 3.3 70B conectado e funcionando!")
    except Exception as e:
        print(f"❌ Erro ao configurar/testar Groq: {e}")
        print(f"  API Key presente: {bool(GROQ_API_KEY)}")
        print(f"  API Key início: {GROQ_API_KEY[:10] if GROQ_API_KEY else 'N/A'}")
        client = None
        LLM_ENABLED = False
elif not OPENAI_AVAILABLE:
    print("❌ Biblioteca OpenAI não disponível")
    print("  Execute: pip install openai")
elif not GROQ_API_KEY:
    print("❌ GROQ_API_KEY não configurada")
    print("  Configure nas variáveis de ambiente da Vercel")

# ============== EXECUÇÃO DE FERRAMENTAS ==============

def execute_tool(tool_name, arguments):
    """Executa uma ferramenta e retorna o resultado"""
    try:
        if tool_name == "search_web":
            return tool_search_web(arguments.get("query", ""))
        elif tool_name == "get_weather":
            return tool_get_weather(arguments.get("city", "São Paulo"))
        elif tool_name == "get_current_datetime":
            return tool_get_datetime()
        elif tool_name == "search_memories":
            memories = search_memories_by_query(arguments.get("query", ""))
            if memories:
                return "🧠 Memórias encontradas:\n" + "\n".join([f"• {m}" for m in memories])
            return "Não encontrei memórias sobre isso, princesa."
        elif tool_name == "save_to_mural":
            if save_feedback(arguments.get("message", "")):
                return "✅ Recado salvo no mural! O Pablo vai ver."
            return "Não consegui salvar no mural agora."
        elif tool_name == "read_mural":
            msgs = read_feedback_board()
            if msgs:
                return "📋 Mural de Desabafos:\n" + "\n".join([f"• {m}" for m in msgs])
            return "O mural tá vazio por enquanto!"
        elif tool_name == "calculate":
            return tool_calculate(arguments.get("expression", ""))
        else:
            return f"Ferramenta {tool_name} não encontrada."
    except Exception as e:
        print(f"Erro executando ferramenta {tool_name}: {e}")
        return f"Erro ao executar {tool_name}"

# ============== FUNÇÕES DE APRENDIZADO ==============

def extract_memories_from_conversation(conversation_text):
    """Usa a IA para extrair memórias da conversa"""
    if not client or not LLM_ENABLED:
        return []
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
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
            pass
        
        return []
    except Exception as e:
        print(f"Erro ao extrair memórias: {e}")
        return []

def summarize_conversation(conversation_text):
    """Cria um resumo da conversa para contexto infinito"""
    if not client or not LLM_ENABLED:
        return None
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "Você resume conversas de forma concisa mantendo informações importantes."},
                {"role": "user", "content": CONVERSATION_SUMMARY_PROMPT.format(conversation=conversation_text)}
            ],
            max_tokens=300,
            temperature=0.3,
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Erro ao resumir conversa: {e}")
        return None

# ============== FUNÇÕES DE CONVERSAS ==============

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
            ON CONFLICT (id) DO NOTHING
        """, (conversation_id, session_id, title, 'Nova conversa'))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro create_conversation: {e}")
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

def build_system_prompt_with_context(session_id, tpm_mode=False):
    """Constrói o prompt do sistema com todo o contexto"""
    memories = get_memories(limit=30)
    
    # Tempo atual (Brasil)
    now = datetime.now() - timedelta(hours=3)
    dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
    current_day = dias[now.weekday()]
    
    # Nível de intimidade
    intimacy = get_intimacy_level(session_id)
    intimacy_desc = {
        1: "NOVO AMIGO - Seja acolhedor mas ainda formal",
        2: "AMIGO - Pode usar gírias e ser mais zoeiro",
        3: "AMIGO PRÓXIMO - Seja bem à vontade",
        4: "MELHOR AMIGO - Total liberdade",
        5: "ALMA GÊMEA - Vocês têm história juntos"
    }.get(intimacy, "AMIGO")
    
    # Resumo de conversa anterior (se existir)
    previous_summary = get_conversation_summary(session_id)
    summary_section = ""
    if previous_summary:
        summary_section = f"""
════════════════════════════════════════════════════════════════════════════════
📜 RESUMO DA CONVERSA ANTERIOR
════════════════════════════════════════════════════════════════════════════════
{previous_summary}
"""
    
    context = f"""
════════════════════════════════════════════════════════════════════════════════
⏰ CONTEXTO ATUAL
════════════════════════════════════════════════════════════════════════════════
DATA E HORA: {now.strftime('%d/%m/%Y %H:%M')} ({current_day})
NÍVEL DE INTIMIDADE: {intimacy}/5 - {intimacy_desc}
{summary_section}
"""
    
    full_prompt = BASE_SYSTEM_PROMPT + context
    
    # Modo TPM
    if tpm_mode:
        full_prompt = TPM_MODE_PROMPT + full_prompt
    
    # Memórias
    if memories:
        memories_text = "\n".join([f"• {m}" for m in memories])
        full_prompt += f"""
════════════════════════════════════════════════════════════════════════════════
🧠 MEMÓRIAS SOBRE A GEHH
════════════════════════════════════════════════════════════════════════════════
{memories_text}
"""
    
    return full_prompt

# ============== HANDLER ==============

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin')
        self.send_header('Access-Control-Max-Age', '3600')
        self.end_headers()

    def do_POST(self):
        """Processar mensagem do chat"""
        print(f"🔵 POST recebido em: {self.path}")
        
        try:
            # Ler corpo da requisição
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                raise ValueError("Requisição sem corpo")
                
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            print(f"📝 Dados recebidos: {data.get('message', '')[:50]}...")
            
            user_message = data.get('message', '')
            session_id = data.get('session_id', 'default')
            conversation_id = data.get('conversation_id', None)
            tpm_mode = data.get('tpm_mode', False)
            
            # Criar conversa se não existir (com tratamento de erro)
            try:
                if conversation_id:
                    conv = get_conversation_by_id(conversation_id)
                    if not conv:
                        create_conversation(conversation_id, session_id, user_message[:30] + ('...' if len(user_message) > 30 else ''))
                elif not conversation_id:
                    # Criar ID de conversa se não fornecido
                    conversation_id = f"conv_{session_id}"
                    create_conversation(conversation_id, session_id, user_message[:30] + ('...' if len(user_message) > 30 else ''))
            except Exception as e:
                print(f"⚠️ Erro ao criar/buscar conversa: {e}")
                # Continua mesmo sem salvar conversa
            
            # Validar mensagem
            if not user_message or not user_message.strip():
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Mensagem vazia',
                    'status': 'error'
                }, ensure_ascii=False).encode('utf-8'))
                return
            
            # Verificar se LLM está disponível
            if not LLM_ENABLED or not client:
                error_details = []
                if not OPENAI_AVAILABLE:
                    error_details.append("Biblioteca OpenAI não instalada")
                if not GROQ_API_KEY:
                    error_details.append("GROQ_API_KEY não configurada")
                if GROQ_API_KEY and not client:
                    error_details.append("Erro ao conectar com Groq")
                
                print(f"⚠️ LLM não disponível: {', '.join(error_details)}")
                
                # Mensagem amigável para o usuário
                user_message = "Oi! O Matteo tá passando por uma manutenção rápida. 🔧\n\n"
                user_message += "Enquanto isso, que tal explorar as outras partes do site? "
                user_message += "Tem muitas surpresas te esperando! 💙"
                
                self.send_response(200)  # Retorna 200 mesmo assim para não quebrar o frontend
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'response': user_message,
                    'session_id': session_id,
                    'conversation_id': conversation_id,
                    'status': 'maintenance',
                    'debug': error_details if os.environ.get('VERCEL_ENV') != 'production' else None
                }, ensure_ascii=False).encode('utf-8'))
                return
            
            # Inicializar banco (com tratamento de erro)
            try:
                init_db()
                # Salvar mensagem do usuário
                save_chat_message(session_id, 'user', user_message)
            except Exception as e:
                print(f"⚠️ Erro ao salvar no banco: {e}")
                # Continua mesmo sem salvar
            
            # Buscar histórico
            history = get_chat_history(session_id, limit=30)
            
            # Construir prompt com contexto completo
            system_prompt = build_system_prompt_with_context(session_id, tpm_mode=tpm_mode)
            
            # Criar mensagens para API
            messages = [{'role': 'system', 'content': system_prompt}]
            
            # Adicionar histórico
            for msg in history:
                messages.append({
                    'role': msg['role'],
                    'content': msg['content']
                })
            
            # Primeira chamada - com ferramentas
            response = client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                tools=MATTEO_TOOLS,
                tool_choice="auto",
                max_tokens=500,
                temperature=0.85,
                top_p=0.9,
            )
            
            response_message = response.choices[0].message
            bot_response = response_message.content or ""
            
            # Verificar se precisa executar ferramentas
            if response_message.tool_calls:
                # Adicionar resposta do assistente com tool_calls
                messages.append({
                    "role": "assistant",
                    "content": response_message.content,
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments
                            }
                        } for tc in response_message.tool_calls
                    ]
                })
                
                # Executar cada ferramenta
                for tool_call in response_message.tool_calls:
                    tool_name = tool_call.function.name
                    try:
                        arguments = json.loads(tool_call.function.arguments)
                    except:
                        arguments = {}
                    
                    print(f"🔧 Executando ferramenta: {tool_name} com args: {arguments}")
                    tool_result = execute_tool(tool_name, arguments)
                    
                    # Adicionar resultado da ferramenta
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": tool_result
                    })
                
                # Segunda chamada - com resultados das ferramentas
                # IMPORTANTE: Precisamos passar tools novamente, mesmo na segunda chamada
                final_response = client.chat.completions.create(
                    model=LLM_MODEL,
                    messages=messages,
                    tools=MATTEO_TOOLS,  # Passar tools novamente para evitar erro 400
                    tool_choice="auto",  # Permitir usar ferramentas novamente se necessário
                    max_tokens=500,
                    temperature=0.85,
                    top_p=0.9,
                )
                
                bot_response = final_response.choices[0].message.content or ""
                
                # Se ainda houver tool_calls na resposta final, executar também
                if final_response.choices[0].message.tool_calls:
                    print(f"🔧 Segunda rodada de ferramentas detectada")
                    # Adicionar resposta do assistente
                    messages.append({
                        "role": "assistant",
                        "content": bot_response,
                        "tool_calls": [
                            {
                                "id": tc.id,
                                "type": "function",
                                "function": {
                                    "name": tc.function.name,
                                    "arguments": tc.function.arguments
                                }
                            } for tc in final_response.choices[0].message.tool_calls
                        ]
                    })
                    
                    # Executar ferramentas adicionais
                    for tool_call in final_response.choices[0].message.tool_calls:
                        tool_name = tool_call.function.name
                        try:
                            arguments = json.loads(tool_call.function.arguments)
                        except:
                            arguments = {}
                        
                        print(f"🔧 Executando ferramenta adicional: {tool_name}")
                        tool_result = execute_tool(tool_name, arguments)
                        
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": tool_result
                        })
                    
                    # Terceira chamada (se necessário)
                    third_response = client.chat.completions.create(
                        model=LLM_MODEL,
                        messages=messages,
                        tools=MATTEO_TOOLS,
                        tool_choice="none",  # Forçar resposta final sem mais ferramentas
                        max_tokens=500,
                        temperature=0.85,
                    )
                    
                    bot_response = third_response.choices[0].message.content or ""
            
            # Limpar resposta
            bot_response = bot_response.strip()
            bot_response = re.sub(r'\*[^*]+\*', '', bot_response).strip()
            
            if bot_response.lower().startswith('matteo:'):
                bot_response = bot_response[7:].strip()
            
            # Salvar resposta (com tratamento de erro)
            try:
                save_chat_message(session_id, 'assistant', bot_response)
                
                # Atualizar conversa
                if conversation_id:
                    update_conversation(conversation_id, last_message=bot_response[:50] + ('...' if len(bot_response) > 50 else ''))
            except Exception as e:
                print(f"⚠️ Erro ao salvar resposta: {e}")
                # Continua mesmo sem salvar
            
            # Extração de memórias (a cada 5 mensagens) - com tratamento de erro
            try:
                total_msgs = get_total_messages()
            except:
                total_msgs = 0
                
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
                        print(f"💾 Nova memória: {memory}")
            
            # Resumo de conversa (a cada 50 mensagens)
            if total_msgs > 0 and total_msgs % 50 == 0:
                recent_history = get_chat_history(session_id, limit=50)
                conversation_text = "\n".join([
                    f"{'Gehh' if m['role']=='user' else 'Matteo'}: {m['content']}" 
                    for m in recent_history
                ])
                
                summary = summarize_conversation(conversation_text)
                if summary:
                    save_conversation_summary(session_id, summary, total_msgs)
                    print(f"📝 Resumo salvo: {summary[:100]}...")
            
            # Preparar resposta
            response_data = {
                'response': bot_response,
                'session_id': session_id,
                'conversation_id': conversation_id,
                'tools_used': [tc.function.name for tc in response_message.tool_calls] if response_message.tool_calls else [],
                'status': 'success'
            }
            
            # Enviar resposta
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.end_headers()
            
            self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))
            print(f"✅ Resposta enviada: {bot_response[:50]}...")
            
        except Exception as e:
            import traceback
            error_msg = traceback.format_exc()
            print(f"❌ Erro no Matteo: {str(e)}")
            print(f"📋 Stack trace: {error_msg}")
            
            # Determinar código de status apropriado
            status_code = 500
            if "Mensagem vazia" in str(e) or "Requisição sem corpo" in str(e):
                status_code = 400
            elif "API_KEY não configurada" in str(e):
                status_code = 503
            
            # Enviar resposta de erro
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.end_headers()
            
            error_data = {
                'error': str(e),
                'status': 'error',
                'message': 'Desculpe, tive um probleminha aqui! Tenta de novo? 🥺'
            }
            
            # Incluir detalhes apenas em desenvolvimento
            if os.environ.get('VERCEL_ENV') != 'production':
                error_data['details'] = error_msg[:500]  # Limitar tamanho
            
            self.wfile.write(json.dumps(error_data, ensure_ascii=False).encode('utf-8'))
