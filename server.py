import http.server
import socketserver
import json
import os
import urllib.request
import urllib.error
from http import HTTPStatus

PORT = 8080
STATS_FILE = 'stats.json'

# Simple .env loader
def load_env():
    if os.path.exists('.env'):
        with open('.env', 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                key, value = line.split('=', 1)
                # Remove quotes if present
                value = value.strip().strip("'").strip('"')
                os.environ[key.strip()] = value

load_env()

class StatsHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/stats':
            self.send_response(HTTPStatus.OK)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            try:
                with open(STATS_FILE, 'r', encoding='utf-8') as f:
                    data = f.read()
                    self.wfile.write(data.encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({}).encode('utf-8'))
        else:
            # Default to serving static files
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/click':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode('utf-8'))
                app_id = payload.get('appId')
                
                # Get current month
                current_month = datetime.now().strftime('%Y-%m')

                # Read existing stats
                stats = {}
                if os.path.exists(STATS_FILE):
                    with open(STATS_FILE, 'r', encoding='utf-8') as f:
                        stats = json.load(f)

                # Update stats
                if app_id in stats:
                    stats[app_id]['clicks'] += 1
                    # Ensure history exists
                    if 'history' not in stats[app_id]:
                        stats[app_id]['history'] = {}
                    # Update monthly count
                    current_count = stats[app_id]['history'].get(current_month, 0)
                    stats[app_id]['history'][current_month] = current_count + 1
                    
                else:
                    # Provide default if new app
                    stats[app_id] = {
                        "name": payload.get('appName', 'Unknown'), 
                        "clicks": 1,
                        "history": { current_month: 1 }
                    }

                # Write back
                with open(STATS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(stats, f, ensure_ascii=False, indent=2)

                self.send_response(HTTPStatus.OK)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "stats": stats}).encode('utf-8'))

            except Exception as e:
                self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))
        
        elif self.path == '/api/dream':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                dream_text = payload.get('dream')
                api_key = os.environ.get('OPENAI_API_KEY')

                if api_key:
                    # --- Real OpenAI API Call ---
                    print("Connecting to OpenAI... ")
                    url = "https://api.openai.com/v1/chat/completions"
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {api_key}"
                    }
                    data = {
                        "model": "gpt-4o-mini",
                        "messages": [
                            {
                                "role": "system", 
                                "content": "당신은 '칼라머스(Calamus)'의 신비로운 AI 꿈 해몽가입니다. 융 심리학과 고전 해몽학을 기반으로 분석합니다. 말투는 신비롭고 공감적이며 정중한 '해요'체를 사용하세요.\n\n다음 형식으로 답변하세요:\n1. 🔑 **핵심 상징**: 꿈에 나온 주요 상징 3가지와 그 의미\n2. 🧠 **심리적 메시지**: 이 꿈이 보여주는 당신의 내면 심리 상태\n3. 🔮 **미래의 암시**: 앞으로 일어날 수 있는 일이나 조언 (긍정적 방향 제시)\n4. ✨ **행운의 요소**: 이 꿈과 관련된 행운의 색깔이나 아이템"
                            },
                            {"role": "user", "content": f"꿈 내용: {dream_text}"}
                        ],
                        "temperature": 0.7
                    }
                    
                    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
                    with urllib.request.urlopen(req) as response:
                        res_body = response.read()
                        res_json = json.loads(res_body)
                        result_text = res_json['choices'][0]['message']['content']
                        
                        self.send_response(HTTPStatus.OK)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({"result": result_text}).encode('utf-8'))
                        
                else:
                    # --- Mock Response (Fallback) ---
                    print("No API Key found. Returning Mock.")
                    import time
                    time.sleep(1.0)
                    
                    mock_response = {
                        "result": (
                            "⚠️ **[로컬 테스트 모드]**\n"
                            "`.env` 파일에 `OPENAI_API_KEY`가 설정되지 않아 가상 응답을 표시합니다.\n\n"
                            "🔑 **핵심 상징**\n"
                            "- **숲**: 무의식의 세계, 미지의 영역\n"
                            "- **황금 사슴**: 특별한 기회, 재물, 또는 영적인 인도자\n\n"
                            "🧠 **심리적 메시지**\n"
                            "당신은 숨겨진 재능이나 기회를 탐색하려는 강한 열망을 품고 있습니다.\n\n"
                            "🔮 **미래의 암시**\n"
                            "예상치 못한 행운이 찾아올 수 있으니 마음을 활짝 여세요!"
                        )
                    }
                    
                    self.send_response(HTTPStatus.OK)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps(mock_response).encode('utf-8'))

            except Exception as e:
                print(f"Error: {e}")
                self.send_error(HTTPStatus.INTERNAL_SERVER_ERROR, str(e))

        else:
            self.send_error(HTTPStatus.NOT_FOUND)

print(f"Server started at http://localhost:{PORT}")
print("Press Ctrl+C to stop")

# Create server with allowing address reuse (to avoid 'Address already in use' errors on restart)
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), StatsHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    print("Server stopped.")
