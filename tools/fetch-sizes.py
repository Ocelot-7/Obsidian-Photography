#!/usr/bin/env python3
"""Relève la taille d'origine de chaque photo sur Cloudinary et l'écrit dans js/sizes.js.

La page admin.html s'en sert pour signaler les photos trop petites pour le plein écran.
À relancer après avoir ajouté ou renvoyé des photos :

    python3 tools/fetch-sizes.py
"""
import json
import os
import re
import subprocess
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CLOUD = "https://res.cloudinary.com/dhbmaw1bm/image/upload/fl_getinfo/"

source = open(os.path.join(ROOT, "js", "photos.js"), encoding="utf-8").read()
ids = sorted(set(re.findall(r'id:\s*"([^"]+)"', source)) | set(re.findall(r'^\s*"([^"]+)",?\s*$', source, re.M)))


def size(photo_id):
    try:
        out = subprocess.run(["curl", "-s", "-m", "25", CLOUD + urllib.parse.quote(photo_id)],
                             capture_output=True, text=True).stdout
        info = json.loads(out)["input"]
        return [info["width"], info["height"]]
    except (ValueError, KeyError):
        return None


with ThreadPoolExecutor(8) as pool:
    sizes = {i: s for i, s in zip(ids, pool.map(size, ids)) if s}

with open(os.path.join(ROOT, "js", "sizes.js"), "w", encoding="utf-8") as file:
    file.write("// Taille d'origine des photos sur Cloudinary : identifiant → [largeur, hauteur].\n")
    file.write("// Fichier généré par tools/fetch-sizes.py — ne pas modifier à la main.\n\n")
    lines = [f"  {json.dumps(i, ensure_ascii=False)}: [{w}, {h}]" for i, (w, h) in sorted(sizes.items())]
    file.write("const SIZES = {\n" + ",\n".join(lines) + "\n};\n")

print(f"{len(sizes)} tailles relevées sur {len(ids)} photos")
missing = [i for i in ids if i not in sizes]
if missing:
    print("Sans réponse :", ", ".join(missing))
