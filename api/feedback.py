"""
Endpoint de Feedback (CRUD) - Vercel Serverless Function
Com suporte a: Respostas, Fixar, Humor, Conquistas, Status de Leitura
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import uuid
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Tentar importar psycopg2
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    DB_AVAILABLE = True
except ImportError:
    DB_AVAILABLE = False
    print("psycopg2 não disponível")

# Tentar importar pywebpush para notificações
try:
    from pywebpush import webpush, WebPushException
    PUSH_AVAILABLE = True
except ImportError:
    PUSH_AVAILABLE = False

# ============== CONFIGURAÇÕES ==============

POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")
VAPID_PRIVATE_KEY = os.environ.get("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = os.environ.get("VAPID_PUBLIC_KEY")
VAPID_CLAIMS = {"sub": "mailto:pablo@example.com"}

# ============== CONQUISTAS ==============

ACHIEVEMENTS = {
    "first_post": {"name": "Primeiro Desabafo", "emoji": "🎉", "description": "Postou pela primeira vez!"},
    "posts_5": {"name": "Desabafadora", "emoji": "💬", "description": "5 desabafos no mural"},
    "posts_10": {"name": "Veterana", "emoji": "⭐", "description": "10 desabafos no mural"},
    "posts_25": {"name": "Rainha do Mural", "emoji": "👑", "description": "25 desabafos no mural"},
    "posts_50": {"name": "Lendária", "emoji": "🏆", "description": "50 desabafos no mural"},
    "streak_3": {"name": "Constante", "emoji": "🔥", "description": "3 dias seguidos desabafando"},
    "streak_7": {"name": "Dedicada", "emoji": "💪", "description": "7 dias seguidos desabafando"},
    "first_reply": {"name": "Respondida", "emoji": "💕", "description": "Pablo respondeu seu desabafo"},
    "love_letter": {"name": "Romântica", "emoji": "💌", "description": "Enviou uma carta de amor"},
    "all_moods": {"name": "Emocional", "emoji": "🎭", "description": "Usou todos os humores"},
    "first_poke": {"name": "Cutucadora", "emoji": "👉", "description": "Cutucou o Pablo pela primeira vez"},
}

# ============== MENSAGENS DE CUTUCADA ==============
import random

POKE_MESSAGES = [
    "🔔 PABLO! Responde a mensagem logo, idiota! 😤",
    "👉 Ei Pablo! A Gehh tá esperando sua resposta, mané!",
    "⚠️ ALERTA: Gehh irritada! Responde logo! 🚨",
    "😤 Pablo seu lerdo! Responde a mensagem!",
    "🗣️ PABLOOOOO! Acorda e responde! 💢",
    "👀 Gehh tá de olho esperando sua resposta...",
    "💬 Ô Pablo! Tem mensagem não respondida! Mexe-se!",
    "🔥 Gehh cutucou você! Melhor responder logo...",
    "😠 Responde logo Pablo! Não me ignora não!",
    "📢 CUTUCADA OFICIAL: Responde a Gehh AGORA!",
    "💀 Pablo... responde antes que seja tarde demais...",
    "🎯 Gehh mandou avisar: RESPONDE! 👊",
]

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
        
        # Tabela principal de feedback (atualizada)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id VARCHAR(36) PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                mood VARCHAR(20) DEFAULT 'neutral',
                is_pinned BOOLEAN DEFAULT FALSE,
                is_letter BOOLEAN DEFAULT FALSE,
                is_read BOOLEAN DEFAULT FALSE,
                read_at TIMESTAMP,
                created_at TIMESTAMP NOT NULL,
                updated_at TIMESTAMP
            );
        """)
        
        # Tabela de respostas do Pablo
        cur.execute("""
            CREATE TABLE IF NOT EXISTS feedback_replies (
                id VARCHAR(36) PRIMARY KEY,
                feedback_id VARCHAR(36) REFERENCES feedback(id) ON DELETE CASCADE,
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL
            );
        """)
        
        # Tabela de conquistas
        cur.execute("""
            CREATE TABLE IF NOT EXISTS achievements (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(255) DEFAULT 'gehh',
                achievement_key VARCHAR(50) NOT NULL,
                unlocked_at TIMESTAMP NOT NULL,
                UNIQUE(user_id, achievement_key)
            );
        """)
        
        # Tabela de estatísticas
        cur.execute("""
            CREATE TABLE IF NOT EXISTS mural_stats (
                id VARCHAR(36) PRIMARY KEY,
                stat_date DATE NOT NULL UNIQUE,
                mood VARCHAR(20),
                post_count INTEGER DEFAULT 0
            );
        """)
        
        # Adicionar colunas novas se não existirem (migração)
        try:
            cur.execute("ALTER TABLE feedback ADD COLUMN IF NOT EXISTS mood VARCHAR(20) DEFAULT 'neutral';")
            cur.execute("ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;")
            cur.execute("ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_letter BOOLEAN DEFAULT FALSE;")
            cur.execute("ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;")
            cur.execute("ALTER TABLE feedback ADD COLUMN IF NOT EXISTS read_at TIMESTAMP;")
        except:
            pass
        
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Erro init_db: {e}")
        return False

# ============== FUNÇÕES DE CONQUISTAS ==============

def check_and_unlock_achievements(conn, user_id='gehh'):
    """Verifica e desbloqueia conquistas baseadas nas ações"""
    cur = conn.cursor(cursor_factory=RealDictCursor)
    unlocked = []
    
    # Contar posts
    cur.execute("SELECT COUNT(*) as count FROM feedback WHERE author = 'Geovana'")
    post_count = cur.fetchone()['count']
    
    # Conquistas por quantidade de posts
    achievement_thresholds = [
        (1, "first_post"),
        (5, "posts_5"),
        (10, "posts_10"),
        (25, "posts_25"),
        (50, "posts_50"),
    ]
    
    for threshold, key in achievement_thresholds:
        if post_count >= threshold:
            if unlock_achievement(conn, user_id, key):
                unlocked.append(ACHIEVEMENTS[key])
    
    # Verificar streak (dias seguidos)
    cur.execute("""
        SELECT DISTINCT DATE(created_at) as post_date 
        FROM feedback 
        WHERE author = 'Geovana'
        ORDER BY post_date DESC 
        LIMIT 7
    """)
    dates = [row['post_date'] for row in cur.fetchall()]
    
    if len(dates) >= 3:
        # Verificar se são consecutivos
        streak = 1
        for i in range(1, len(dates)):
            if (dates[i-1] - dates[i]).days == 1:
                streak += 1
            else:
                break
        
        if streak >= 3:
            if unlock_achievement(conn, user_id, "streak_3"):
                unlocked.append(ACHIEVEMENTS["streak_3"])
        if streak >= 7:
            if unlock_achievement(conn, user_id, "streak_7"):
                unlocked.append(ACHIEVEMENTS["streak_7"])
    
    # Verificar se usou todos os moods
    cur.execute("SELECT DISTINCT mood FROM feedback WHERE author = 'Geovana' AND mood IS NOT NULL")
    moods_used = [row['mood'] for row in cur.fetchall()]
    all_moods = ['happy', 'sad', 'angry', 'love', 'neutral']
    if all(m in moods_used for m in all_moods):
        if unlock_achievement(conn, user_id, "all_moods"):
            unlocked.append(ACHIEVEMENTS["all_moods"])
    
    # Verificar se tem carta
    cur.execute("SELECT COUNT(*) as count FROM feedback WHERE author = 'Geovana' AND is_letter = TRUE")
    if cur.fetchone()['count'] > 0:
        if unlock_achievement(conn, user_id, "love_letter"):
            unlocked.append(ACHIEVEMENTS["love_letter"])
    
    # Verificar se tem resposta
    cur.execute("""
        SELECT COUNT(*) as count FROM feedback_replies fr
        JOIN feedback f ON fr.feedback_id = f.id
        WHERE f.author = 'Geovana'
    """)
    if cur.fetchone()['count'] > 0:
        if unlock_achievement(conn, user_id, "first_reply"):
            unlocked.append(ACHIEVEMENTS["first_reply"])
    
    cur.close()
    return unlocked

def unlock_achievement(conn, user_id, achievement_key):
    """Tenta desbloquear uma conquista, retorna True se foi nova"""
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO achievements (id, user_id, achievement_key, unlocked_at)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id, achievement_key) DO NOTHING
        """, (str(uuid.uuid4()), user_id, achievement_key, datetime.now()))
        conn.commit()
        was_new = cur.rowcount > 0
        cur.close()
        return was_new
    except:
        return False

def get_all_achievements(conn, user_id='gehh'):
    """Retorna todas as conquistas com status de desbloqueio"""
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT achievement_key, unlocked_at FROM achievements WHERE user_id = %s", (user_id,))
    unlocked = {row['achievement_key']: row['unlocked_at'] for row in cur.fetchall()}
    cur.close()
    
    result = []
    for key, data in ACHIEVEMENTS.items():
        result.append({
            **data,
            "key": key,
            "unlocked": key in unlocked,
            "unlocked_at": unlocked.get(key).isoformat() if key in unlocked else None
        })
    return result

# ============== FUNÇÃO DE CUTUCADA ==============

def send_poke_notification(feedback_id, feedback_message):
    """Envia uma cutucada (poke) para o Pablo"""
    poke_message = random.choice(POKE_MESSAGES)
    
    # Adiciona um trecho da mensagem original
    preview = feedback_message[:50] + "..." if len(feedback_message) > 50 else feedback_message
    full_message = f"{poke_message}\n\n📝 \"{preview}\""
    
    # Enviar push notification
    push_sent = send_push_to_pablo(full_message)
    
    # Enviar email também
    email_sent = send_poke_email(feedback_message, poke_message)
    
    return push_sent or email_sent

def send_poke_email(original_message, poke_message):
    """Envia email de cutucada"""
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
    SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')
    RECEIVER_EMAIL = os.environ.get('RECEIVER_EMAIL')

    if not all([SENDER_EMAIL, SENDER_PASSWORD, RECEIVER_EMAIL]):
        return False

    hora_atual = datetime.now().strftime("%d/%m/%Y às %H:%M")

    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #fee2e2;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; border: 3px solid #ef4444;">
            <h1 style="color: #ef4444; text-align: center;">👉 CUTUCADA DA GEHH! 👈</h1>
            <p style="text-align: center; font-size: 24px; color: #333;">{poke_message}</p>
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Mensagem original:</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 16px; color: #333;">{original_message}</p>
            </div>
            <p style="text-align: center; color: #666;"><strong>Cutucada em:</strong> {hora_atual}</p>
            <p style="text-align: center; margin-top: 20px;">
                <a href="https://presente2.vercel.app/mural?admin=pablo" style="background-color: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">RESPONDER AGORA! 🏃</a>
            </p>
        </div>
    </body>
    </html>
    """

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"👉 CUTUCADA! Gehh quer resposta AGORA! 😤"
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        
        msg.attach(MIMEText(f"CUTUCADA DA GEHH!\n\n{poke_message}\n\nMensagem original: {original_message}\n\nCutucada em: {hora_atual}", 'plain', 'utf-8'))
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        
        return True
        
    except Exception as e:
        print(f"[EMAIL POKE] ERRO: {e}")
        return False

# ============== FUNÇÕES DE ESTATÍSTICAS ==============

def get_statistics(conn):
    """Retorna estatísticas do mural"""
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Total de posts
    cur.execute("SELECT COUNT(*) as total FROM feedback")
    total_posts = cur.fetchone()['total']
    
    # Posts este mês
    cur.execute("""
        SELECT COUNT(*) as count FROM feedback 
        WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
    """)
    posts_this_month = cur.fetchone()['count']
    
    # Humor mais frequente
    cur.execute("""
        SELECT mood, COUNT(*) as count FROM feedback 
        WHERE mood IS NOT NULL 
        GROUP BY mood ORDER BY count DESC LIMIT 1
    """)
    most_common_mood = cur.fetchone()
    
    # Streak atual
    cur.execute("""
        SELECT DISTINCT DATE(created_at) as post_date 
        FROM feedback 
        ORDER BY post_date DESC 
        LIMIT 30
    """)
    dates = [row['post_date'] for row in cur.fetchall()]
    
    current_streak = 0
    if dates:
        today = datetime.now().date()
        if dates[0] == today or dates[0] == today - timedelta(days=1):
            current_streak = 1
            for i in range(1, len(dates)):
                if (dates[i-1] - dates[i]).days == 1:
                    current_streak += 1
                else:
                    break
    
    # Respostas do Pablo
    cur.execute("SELECT COUNT(*) as count FROM feedback_replies")
    total_replies = cur.fetchone()['count']
    
    # Mensagens não lidas pelo Pablo
    cur.execute("SELECT COUNT(*) as count FROM feedback WHERE is_read = FALSE")
    unread_count = cur.fetchone()['count']
    
    # Humor por mês (últimos 6 meses)
    cur.execute("""
        SELECT 
            DATE_TRUNC('month', created_at) as month,
            mood,
            COUNT(*) as count
        FROM feedback 
        WHERE created_at > NOW() - INTERVAL '6 months' AND mood IS NOT NULL
        GROUP BY DATE_TRUNC('month', created_at), mood
        ORDER BY month
    """)
    mood_history = cur.fetchall()
    
    cur.close()
    
    return {
        "total_posts": total_posts,
        "posts_this_month": posts_this_month,
        "most_common_mood": most_common_mood['mood'] if most_common_mood else 'neutral',
        "current_streak": current_streak,
        "total_replies": total_replies,
        "unread_count": unread_count,
        "mood_history": [dict(r) for r in mood_history] if mood_history else []
    }

# ============== FUNÇÃO DE NOTIFICAÇÃO PUSH ==============

def send_push_to_pablo(message):
    """Envia push notification para o Pablo"""
    if not PUSH_AVAILABLE or not VAPID_PRIVATE_KEY:
        print("[PUSH] Push não disponível")
        return False
    
    try:
        conn = get_db_connection()
        if not conn:
            return False
        
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT endpoint, p256dh, auth FROM push_subscriptions")
        subscriptions = cur.fetchall()
        cur.close()
        conn.close()
        
        for sub in subscriptions:
            try:
                webpush(
                    subscription_info={
                        "endpoint": sub['endpoint'],
                        "keys": {"p256dh": sub['p256dh'], "auth": sub['auth']}
                    },
                    data=message,
                    vapid_private_key=VAPID_PRIVATE_KEY,
                    vapid_claims=VAPID_CLAIMS
                )
                print(f"[PUSH] Notificação enviada!")
            except WebPushException as e:
                print(f"[PUSH] Erro: {e}")
        
        return True
    except Exception as e:
        print(f"[PUSH] Erro geral: {e}")
        return False

# ============== FUNÇÃO DE E-MAIL (GMAIL SMTP) ==============

def send_email_notification(author, message, mood=None):
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
    SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')
    RECEIVER_EMAIL = os.environ.get('RECEIVER_EMAIL')

    if not all([SENDER_EMAIL, SENDER_PASSWORD, RECEIVER_EMAIL]):
        return False

    hora_atual = datetime.now().strftime("%d/%m/%Y às %H:%M")
    
    mood_emoji = {
        'happy': '😊',
        'sad': '😢',
        'angry': '😤',
        'love': '😍',
        'neutral': '😐'
    }.get(mood, '💭')

    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #e74c3c; text-align: center;">💌 Nova Mensagem da Gehh! {mood_emoji}</h1>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
                <p style="margin: 0; font-size: 16px; color: #333;">{message}</p>
            </div>
            <p style="text-align: center; color: #666;"><strong>Humor:</strong> {mood_emoji} {mood or 'Não informado'}</p>
            <p style="text-align: center; color: #666;"><strong>Data:</strong> {hora_atual}</p>
            <p style="text-align: center; margin-top: 20px;">
                <a href="https://presente2.vercel.app/mural" style="background-color: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver no Mural</a>
            </p>
        </div>
    </body>
    </html>
    """

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"💌 Gehh está {mood_emoji} - Nova mensagem!"
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        
        msg.attach(MIMEText(f"Nova mensagem da Gehh:\n\n{message}\n\nHumor: {mood}\nData: {hora_atual}", 'plain', 'utf-8'))
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        
        return True
        
    except Exception as e:
        print(f"[EMAIL] ERRO: {e}")
        return False

# ============== HANDLER ==============

class handler(BaseHTTPRequestHandler):
    def _send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode())

    def _get_path_parts(self):
        parsed = urlparse(self.path)
        path_parts = parsed.path.strip('/').split('/')
        query_params = parse_qs(parsed.query)
        return path_parts, query_params

    def do_OPTIONS(self):
        self._send_json(200, {})

    def do_GET(self):
        try:
            init_db()
            path_parts, query_params = self._get_path_parts()
            
            conn = get_db_connection()
            if not conn:
                self._send_json(500, {'error': 'Banco de dados não configurado'})
                return
            
            # GET /api/feedback/stats - Estatísticas
            if len(path_parts) >= 2 and path_parts[-1] == 'stats':
                stats = get_statistics(conn)
                conn.close()
                self._send_json(200, stats)
                return
            
            # GET /api/feedback/achievements - Conquistas
            if len(path_parts) >= 2 and path_parts[-1] == 'achievements':
                achievements = get_all_achievements(conn)
                conn.close()
                self._send_json(200, achievements)
                return
            
            # GET /api/feedback - Lista todos
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("""
                SELECT f.id, f.author, f.message, f.mood, f.is_pinned, f.is_letter, 
                       f.is_read, f.read_at, f.created_at, f.updated_at,
                       (SELECT COUNT(*) FROM feedback_replies fr WHERE fr.feedback_id = f.id) as reply_count
                FROM feedback f
                ORDER BY f.is_pinned DESC, f.created_at DESC
            """)
            rows = cur.fetchall()
            
            feedback_list = []
            for row in rows:
                item = dict(row)
                
                # Buscar respostas
                cur.execute("""
                    SELECT id, message, created_at FROM feedback_replies 
                    WHERE feedback_id = %s ORDER BY created_at ASC
                """, (item['id'],))
                item['replies'] = [dict(r) for r in cur.fetchall()]
                
                # Formatar datas
                for date_field in ['created_at', 'updated_at', 'read_at']:
                    if item.get(date_field):
                        item[date_field] = item[date_field].isoformat() if hasattr(item[date_field], 'isoformat') else str(item[date_field])
                
                for reply in item['replies']:
                    if reply.get('created_at'):
                        reply['created_at'] = reply['created_at'].isoformat() if hasattr(reply['created_at'], 'isoformat') else str(reply['created_at'])
                
                feedback_list.append(item)
            
            cur.close()
            conn.close()
            self._send_json(200, feedback_list)
            
        except Exception as e:
            import traceback
            print(f"Erro ao buscar feedback: {traceback.format_exc()}")
            self._send_json(500, {'error': str(e)})

    def do_POST(self):
        try:
            init_db()
            path_parts, _ = self._get_path_parts()
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            
            conn = get_db_connection()
            if not conn:
                self._send_json(500, {'error': 'Banco de dados não configurado'})
                return
            
            # POST /api/feedback/{id}/reply - Adicionar resposta do Pablo
            if len(path_parts) >= 3 and path_parts[-1] == 'reply':
                feedback_id = path_parts[-2]
                message = data.get('message')
                
                if not message:
                    self._send_json(400, {'error': 'Mensagem não pode ser vazia'})
                    return
                
                cur = conn.cursor()
                reply_id = str(uuid.uuid4())
                cur.execute("""
                    INSERT INTO feedback_replies (id, feedback_id, message, created_at)
                    VALUES (%s, %s, %s, %s)
                """, (reply_id, feedback_id, message, datetime.now()))
                conn.commit()
                cur.close()
                
                # Verificar conquistas
                check_and_unlock_achievements(conn)
                conn.close()
                
                self._send_json(201, {'message': 'Resposta adicionada!', 'id': reply_id})
                return
            
            # POST /api/feedback - Criar novo feedback
            author = data.get('author', 'Geovana')
            message = data.get('message')
            mood = data.get('mood', 'neutral')
            is_letter = data.get('is_letter', False)
            
            if not message:
                self._send_json(400, {'error': 'A mensagem não pode ser vazia'})
                return
            
            feedback_id = str(uuid.uuid4())
            created_at = datetime.now()
            
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO feedback (id, author, message, mood, is_letter, created_at)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (feedback_id, author, message, mood, is_letter, created_at))
            conn.commit()
            cur.close()
            
            # Verificar conquistas
            new_achievements = check_and_unlock_achievements(conn)
            conn.close()
            
            # Notificar Pablo
            mood_emoji = {'happy': '😊', 'sad': '😢', 'angry': '😤', 'love': '😍', 'neutral': '😐'}.get(mood, '💭')
            push_message = f"💌 Gehh postou no mural! {mood_emoji}"
            send_push_to_pablo(push_message)
            send_email_notification(author, message, mood)
            
            self._send_json(201, {
                'message': 'Feedback salvo com sucesso!',
                'id': feedback_id,
                'created_at': created_at.isoformat(),
                'new_achievements': new_achievements
            })
            
        except Exception as e:
            print(f"Erro ao criar feedback: {str(e)}")
            self._send_json(500, {'error': 'Erro interno ao salvar feedback'})

    def do_PUT(self):
        try:
            path_parts, _ = self._get_path_parts()
            
            if len(path_parts) < 2:
                self._send_json(400, {'error': 'ID do feedback não fornecido'})
                return
            
            feedback_id = path_parts[-1]
            init_db()
            
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body) if body else {}
            
            conn = get_db_connection()
            if not conn:
                self._send_json(500, {'error': 'Banco de dados não configurado'})
                return
            
            cur = conn.cursor()
            updated_at = datetime.now()
            
            # Campos que podem ser atualizados
            updates = []
            values = []
            
            if 'message' in data:
                updates.append("message = %s")
                values.append(data['message'])
            if 'mood' in data:
                updates.append("mood = %s")
                values.append(data['mood'])
            if 'is_letter' in data:
                updates.append("is_letter = %s")
                values.append(data['is_letter'])
            
            updates.append("updated_at = %s")
            values.append(updated_at)
            values.append(feedback_id)
            
            cur.execute(f"UPDATE feedback SET {', '.join(updates)} WHERE id = %s", values)
            
            row_count = cur.rowcount
            conn.commit()
            cur.close()
            conn.close()
            
            if row_count == 0:
                self._send_json(404, {'error': 'Feedback não encontrado'})
                return
            
            self._send_json(200, {'message': 'Feedback atualizado!', 'updated_at': updated_at.isoformat()})
            
        except Exception as e:
            print(f"Erro ao atualizar feedback: {str(e)}")
            self._send_json(500, {'error': 'Erro interno ao atualizar feedback'})

    def do_PATCH(self):
        """PATCH para ações específicas: pin, read, poke, etc."""
        try:
            path_parts, _ = self._get_path_parts()
            
            if len(path_parts) < 3:
                self._send_json(400, {'error': 'Ação não especificada'})
                return
            
            feedback_id = path_parts[-2]
            action = path_parts[-1]
            
            init_db()
            conn = get_db_connection()
            if not conn:
                self._send_json(500, {'error': 'Banco de dados não configurado'})
                return
            
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            if action == 'pin':
                # Toggle pin
                cur.execute("UPDATE feedback SET is_pinned = NOT is_pinned WHERE id = %s", (feedback_id,))
            elif action == 'read':
                # Marcar como lido
                cur.execute("UPDATE feedback SET is_read = TRUE, read_at = %s WHERE id = %s", (datetime.now(), feedback_id))
            elif action == 'unread':
                # Marcar como não lido
                cur.execute("UPDATE feedback SET is_read = FALSE, read_at = NULL WHERE id = %s", (feedback_id,))
            elif action == 'poke':
                # CUTUCADA! 👉
                # Buscar a mensagem original
                cur.execute("SELECT message FROM feedback WHERE id = %s", (feedback_id,))
                result = cur.fetchone()
                
                if not result:
                    self._send_json(404, {'error': 'Feedback não encontrado'})
                    return
                
                original_message = result['message']
                
                # Enviar cutucada
                poke_sent = send_poke_notification(feedback_id, original_message)
                
                # Desbloquear conquista de cutucada
                unlock_achievement(conn, 'gehh', 'first_poke')
                
                conn.commit()
                cur.close()
                conn.close()
                
                if poke_sent:
                    self._send_json(200, {
                        'message': 'Cutucada enviada! 👉 Pablo vai receber a notificação!',
                        'poke_sent': True
                    })
                else:
                    self._send_json(200, {
                        'message': 'Cutucada registrada! (notificação pode ter falhado)',
                        'poke_sent': False
                    })
                return
            else:
                self._send_json(400, {'error': 'Ação inválida'})
                return
            
            conn.commit()
            cur.close()
            conn.close()
            
            self._send_json(200, {'message': f'Ação {action} executada!'})
            
        except Exception as e:
            print(f"Erro no PATCH: {str(e)}")
            self._send_json(500, {'error': 'Erro interno'})

    def do_DELETE(self):
        try:
            path_parts, _ = self._get_path_parts()
            
            if len(path_parts) < 2:
                self._send_json(400, {'error': 'ID do feedback não fornecido'})
                return
            
            # Verificar se é para deletar uma resposta
            if len(path_parts) >= 3 and path_parts[-2] == 'reply':
                reply_id = path_parts[-1]
                init_db()
                conn = get_db_connection()
                if not conn:
                    self._send_json(500, {'error': 'Banco de dados não configurado'})
                    return
                
                cur = conn.cursor()
                cur.execute("DELETE FROM feedback_replies WHERE id = %s", (reply_id,))
                conn.commit()
                cur.close()
                conn.close()
                
                self._send_json(200, {'message': 'Resposta deletada!'})
                return
            
            feedback_id = path_parts[-1]
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
