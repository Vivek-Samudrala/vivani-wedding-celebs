"""Receives card images photographed by the browser (#/card/<slug>) and saves them to output/cards/<slug>.png."""
import base64
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "output" / "cards"
OUT.mkdir(parents=True, exist_ok=True)


class Handler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_POST(self):
        slug = Path(self.path).name
        data = self.rfile.read(int(self.headers["Content-Length"])).decode().split(",", 1)[1]
        (OUT / f"{slug}.png").write_bytes(base64.b64decode(data))
        self.send_response(200); self._cors(); self.end_headers(); self.wfile.write(b"ok")
        print("saved", slug, flush=True)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 8766), Handler).serve_forever()
