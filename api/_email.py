"""
Módulo de envio de e-mail para notificações.
"""
import os
import smtplib
from email.mime.text import MIMEText


def send_email_notification(author: str, message: str):
    """Envia notificação por e-mail quando há um novo feedback"""
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL')
    SENDER_PASSWORD = os.environ.get('SENDER_PASSWORD')
    RECEIVER_EMAIL = os.environ.get('RECEIVER_EMAIL')
    SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))

    if not all([SENDER_EMAIL, SENDER_PASSWORD, RECEIVER_EMAIL]):
        print("AVISO: Credenciais de e-mail não configuradas. E-mail não enviado.")
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
        print("E-mail de notificação enviado com sucesso!")
        return True
    except Exception as e:
        print(f"ERRO ao enviar e-mail: {e}")
        return False

