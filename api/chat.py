"""
Endpoint do Chatbot Matteo - Vercel Serverless Function
"""
from http.server import BaseHTTPRequestHandler
import json
import os

from openai import OpenAI
from _db import init_db, get_chat_history, save_chat_message, cleanup_old_chat_history
from _prompts import SYSTEM_PROMPT


# Inicializa cliente OpenAI
try:
    client = OpenAI()
    LLM_ENABLED = True
except Exception as e:
    print(f"Aviso: OpenAI API Key não configurada: {e}")
    LLM_ENABLED = False


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle chat messages"""
        # CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        
        if not LLM_ENABLED:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {'response': "Ops, o Matteo está de folga hoje! Tenta mais tarde. 😅"}
            self.wfile.write(json.dumps(response).encode())
            return

        try:
            # Inicializar banco de dados
            init_db()
            
            # Ler body da requisição
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)
            
            user_message = data.get('message', '')
            session_id = data.get('session_id', 'default')
            
            if not user_message:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Mensagem vazia'}).encode())
                return
            
            # Salvar mensagem do usuário no banco
            save_chat_message(session_id, 'user', user_message)
            
            # Buscar histórico da conversa
            history = get_chat_history(session_id, limit=20)
            
            # Criar mensagens para a API
            messages = [{'role': 'system', 'content': SYSTEM_PROMPT}] + history
            
            # Chamar a API da OpenAI
            response = client.chat.completions.create(
                model='gpt-4o-mini',
                messages=messages,
                max_tokens=150,
                temperature=0.8,
            )
            
            bot_response = response.choices[0].message.content
            
            # Salvar resposta do bot no banco
            save_chat_message(session_id, 'assistant', bot_response)
            
            # Limpar histórico antigo (manter últimas 20)
            cleanup_old_chat_history(session_id, keep_last=20)
            
            # Enviar resposta
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            
            result = {
                'response': bot_response,
                'session_id': session_id
            }
            self.wfile.write(json.dumps(result).encode())
            
        except Exception as e:
            print(f"Erro no Chatbot: {str(e)}")
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Erro ao processar mensagem'}).encode())

