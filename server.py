import os
import sys
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler

DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), "dist"))

class RangeHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0].split('#')[0]
        if path == '/' or not path:
            filepath = os.path.join(DIRECTORY, 'index.html')
        else:
            relpath = path.lstrip('/')
            filepath = os.path.join(DIRECTORY, relpath)

        if not os.path.exists(filepath) or os.path.isdir(filepath):
            fallback = os.path.join(DIRECTORY, 'index.html')
            if os.path.exists(fallback) and '.' not in os.path.basename(path):
                filepath = fallback
            elif os.path.isdir(filepath) and os.path.exists(os.path.join(filepath, 'index.html')):
                filepath = os.path.join(filepath, 'index.html')
            else:
                self.send_error(404, "File not found")
                return

        if not os.path.exists(filepath):
            self.send_error(404, "File not found")
            return

        file_size = os.path.getsize(filepath)
        content_type, _ = mimetypes.guess_type(filepath)
        if not content_type:
            if filepath.endswith('.js') or filepath.endswith('.mjs'):
                content_type = 'application/javascript'
            elif filepath.endswith('.css'):
                content_type = 'text/css'
            elif filepath.endswith('.mp3'):
                content_type = 'audio/mpeg'
            elif filepath.endswith('.svg'):
                content_type = 'image/svg+xml'
            else:
                content_type = 'application/octet-stream'

        range_header = self.headers.get('Range', None)
        if range_header and range_header.startswith('bytes='):
            range_match = range_header[6:].split('-')
            start_str = range_match[0]
            end_str = range_match[1] if len(range_match) > 1 else ''

            start = int(start_str) if start_str else 0
            end = int(end_str) if end_str else file_size - 1

            if start >= file_size or end >= file_size or start > end:
                self.send_response(416, "Requested Range Not Satisfiable")
                self.send_header('Content-Range', f'bytes */{file_size}')
                self.end_headers()
                return

            length = end - start + 1
            self.send_response(206, "Partial Content")
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
            self.send_header('Content-Length', str(length))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            with open(filepath, 'rb') as f:
                f.seek(start)
                bytes_to_send = length
                while bytes_to_send > 0:
                    chunk_size = min(bytes_to_send, 64 * 1024)
                    data = f.read(chunk_size)
                    if not data:
                        break
                    try:
                        self.wfile.write(data)
                    except (ConnectionResetError, BrokenPipeError):
                        break
                    bytes_to_send -= len(data)
        else:
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(file_size))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            with open(filepath, 'rb') as f:
                while True:
                    data = f.read(64 * 1024)
                    if not data:
                        break
                    try:
                        self.wfile.write(data)
                    except (ConnectionResetError, BrokenPipeError):
                        break

    def log_message(self, format, *args):
        pass

def run():
    server = HTTPServer(('127.0.0.1', 5173), RangeHTTPRequestHandler)
    print("Serving on http://localhost:5173 with Byte-Range support...")
    server.serve_forever()

if __name__ == '__main__':
    run()
