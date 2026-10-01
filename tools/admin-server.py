#!/usr/bin/env python3
"""Serveur local du site + petit « back end » pour la page admin.html.

Sert le dossier du site comme `python3 -m http.server`, et en plus enregistre
les photos choisies dans js/covers.js quand la page admin envoie une sélection.
Ne fonctionne que sur cet ordinateur (127.0.0.1) : le site en ligne reste statique.

    python3 tools/admin-server.py 8431
"""
import json
import os
import re
import shutil
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVERS_FILE = os.path.join(ROOT, "js", "covers.js")
BACKUP_DIR = os.path.join(ROOT, "tools", "backups")
PHOTO_ID = re.compile(r"^[\w./-]{1,150}$")
SERIES_KEY = re.compile(r"^[a-z]{1,30}$")
HEADER = """// Photos choisies à la main par Thomas (identifiants Cloudinary, comme dans photos.js).
// Fichier écrit par la page admin.html — on peut aussi le modifier à la main.
// Tant qu'une liste est vide ou absente, le site tire au hasard.
//   home      : diaporama plein écran de l'accueil, dans cet ordre
//   selection : photos de la section « Selection » de l'accueil, dans cet ordre
//   series    : couvertures par série (l'aperçu de la série en tire une au hasard)
//   hidden    : photos masquées, par série (elles restent dans photos.js)

"""


def clean_ids(value):
    if not isinstance(value, list):
        return []
    seen, out = set(), []
    for item in value:
        if isinstance(item, str) and PHOTO_ID.match(item) and item not in seen:
            seen.add(item)
            out.append(item)
    return out


def clean_groups(value):
    if not isinstance(value, dict):
        return {}
    return {
        key: clean_ids(ids)
        for key, ids in value.items()
        if isinstance(key, str) and SERIES_KEY.match(key) and clean_ids(ids)
    }


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        # pas de cache : un rechargement montre toujours la dernière version des fichiers
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def reply(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if urlparse(self.path).path != "/api/covers":
            return self.reply(404, {"error": "not found"})
        # seules les pages servies par ce serveur local peuvent enregistrer
        origin = self.headers.get("Origin")
        if origin and urlparse(origin).hostname not in ("localhost", "127.0.0.1"):
            return self.reply(403, {"error": "forbidden"})
        try:
            length = int(self.headers.get("Content-Length", 0))
            if not 0 < length < 500_000:
                raise ValueError("taille invalide")
            data = json.loads(self.rfile.read(length))
            covers = {
                "home": clean_ids(data.get("home")),
                "selection": clean_ids(data.get("selection")),
                "series": clean_groups(data.get("series")),
                "hidden": clean_groups(data.get("hidden")),
            }
        except (ValueError, AttributeError) as error:
            return self.reply(400, {"error": str(error)})

        # copie de sécurité de la version précédente (une par tranche de 10 minutes, non publiée)
        if os.path.exists(COVERS_FILE):
            os.makedirs(BACKUP_DIR, exist_ok=True)
            stamp = time.strftime("%Y%m%d-%H%M")[:-1] + "0"
            backup = os.path.join(BACKUP_DIR, f"covers-{stamp}.js")
            if not os.path.exists(backup):
                shutil.copyfile(COVERS_FILE, backup)

        content = HEADER + "const COVERS = " + json.dumps(covers, indent=2, ensure_ascii=False) + ";\n"
        with open(COVERS_FILE, "w", encoding="utf-8") as file:
            file.write(content)
        self.reply(200, {"ok": True})


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8431
    print(f"Site : http://localhost:{port}/   Admin : http://localhost:{port}/admin.html")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
