"""
Cron Job para Proatividade do Matteo
Roda periodicamente para verificar se precisa mandar mensagem
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import psycopg2
from datetime import datetime, timedelta
from pywebpush import webpush, WebPushException
from openai import OpenAI

# ============== CONFIGURAÇÕES ==============
POSTGRES_URL = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")
MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")
VAPID_PRIVATE_KEY = os.environ.get("VAPID_PRIVATE_KEY")
VAPID_PUBLIC_KEY = "BJg... (Preencheremos via ENV)" 
# O e-mail de contato para o VAPID
VAPID_CLAIMS = {"sub": "mailto:pablo@example.com"}

def get_db_connection():
    if not POSTGRES_URL:
        return None
    return psycopg2.connect(POSTGRES_URL)

def get_last_user_interaction():
    try:
        conn = get_db_connection()
        if not conn: return None
        cur = conn.cursor()
        cur.execute("""
            SELECT created_at FROM chat_history 
            WHERE role = 'user' 
            ORDER BY created_at DESC LIMIT 1
        """)
        result = cur.fetchone()
        cur.close()
        conn.close()
        return result[0] if result else None
    except:
        return None

def get_subscriptions():
    try:
        conn = get_db_connection()
        if not conn: return []
        cur = conn.cursor()
        cur.execute("SELECT endpoint, p256dh, auth FROM push_subscriptions")
        result = cur.fetchall()
        cur.close()
        conn.close()
        return [{'endpoint': r[0], 'keys': {'p256dh': r[1], 'auth': r[2]}} for r in result]
    except:
        return []

def generate_proactive_message(hours_since):
    if not MISTRAL_API_KEY:
        return "Oi princesa! Saudade de você... 💙"

    try:
        client = OpenAI(api_key=MISTRAL_API_KEY, base_url="https://api.mistral.ai/v1")
        
        context = "Ela sumiu por 24 horas." if hours_since > 24 else "É de manhã, hora de dar bom dia."
        if hours_since > 72: context = "Ela sumiu por 3 dias!"

        prompt = f"""Você é o Matteo, melhor amigo virtual da Gehh.
CONTEXTO: {context}
Gere uma mensagem CURTA (máx 1 frase) e CARINHOSA de notificação para o celular dela.
Exemplos: "Bom dia princesa! ☀️", "Sumiu hein? Saudade... 💙", "Tudo bem por aí, princesa?"
NÃO use aspas. Seja natural e carinhoso."""

        response = client.chat.completions.create(
            model="mistral-large-latest",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=50
        )
        return response.choices[0].message.content.strip()
    except:
        return "Oii princesa! Tudo bem? 💙"

def send_push_notification(subscription, message):
    try:
        # Tenta pegar a chave pública do ENV ou usar uma padrão (não recomendado em prod)
        public_key = os.environ.get("VAPID_PUBLIC_KEY")
        private_key = os.environ.get("VAPID_PRIVATE_KEY")
        
        if not private_key or not public_key:
            print("VAPID Keys não configuradas")
            return

        webpush(
            subscription_info=subscription,
            data=json.dumps({"title": "Matteo", "body": message, "url": "/"}),
            vapid_private_key=private_key,
            vapid_claims=VAPID_CLAIMS
        )
        print(f"Push enviado: {message}")
    except WebPushException as ex:
        print(f"Erro Push: {ex}")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Verificação de segurança (pode adicionar um token secreto na URL se quiser)
        try:
            last_interaction = get_last_user_interaction()
            if not last_interaction:
                self.send_response(200)
                self.end_headers()
                return

            # Ajuste fuso horário simples
            now = datetime.now()
            # Se last_interaction não tiver timezone, assumir que é UTC ou mesmo fuso
            # Cálculo simplificado de horas
            if last_interaction.tzinfo is None:
                hours_since = (now - last_interaction).total_seconds() / 3600
            else:
                # Se tiver timezone, converter (complicado sem pytz, vamos simplificar)
                hours_since = (datetime.now().timestamp() - last_interaction.timestamp()) / 3600

            should_send = False
            
            # Lógica de envio (Simples)
            # 1. Se faz mais de 24h e menos de 25h (pra não mandar toda hora)
            if 24 < hours_since < 25:
                should_send = True
            
            # 2. Se faz mais de 72h e menos de 73h
            if 72 < hours_since < 73:
                should_send = True
                
            # 3. Se é de manhã (8h) e a última msg foi ontem (teste manual ou via cron)
            # Para simplificar, vamos mandar sempre que chamar o endpoint SE fizer tempo suficiente
            # Em produção, o CRON do Vercel chama isso 1x por dia.
            
            # Vamos forçar envio se for chamado e tiver passado tempo suficiente (> 12h)
            # Para evitar spam, idealmente teríamos uma tabela 'last_notification_sent'
            
            if hours_since > 12:
                message = generate_proactive_message(hours_since)
                subscriptions = get_subscriptions()
                
                count = 0
                for sub in subscriptions:
                    send_push_notification(sub, message)
                    count += 1
                
                self.send_response(200)
                self.end_headers()
                self.wfile.write(f"Enviado para {count} devices. Msg: {message}".encode())
            else:
                self.send_response(200)
                self.end_headers()
                self.wfile.write("Muito cedo para notificar.".encode())

        except Exception as e:
            print(f"Erro cron: {e}")
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())

