# Obsidian Photography

Nouveau design (ex-v2), mis à la racine à la place de l'ancien site. L'ancien site reste dans l'historique git.

En local : `python3 tools/admin-server.py 8431`, puis `http://localhost:8431/` (admin : `http://localhost:8431/admin.html`)

## Fait

- [x] Dossier `v2/` séparé, CSS et JS partagés (`css/style.css`, `js/site.js`)
- [x] Accueil : photo plein écran, intro, liste des séries, sélection
- [x] Pages de séries (8 séries + 5 couleurs) : toutes les photos, en disposition éditoriale (une, deux, trois), numérotées
- [x] Visionneuse (`photo.html`) : flèches, clavier, balayage mobile, compteur
- [x] À propos et Contact
- [x] Sceau 狐 (menu, intro, pied de page), bords arrondis
- [x] Filet de 2 px autour des photos, d'une couleur accordée à chaque fond
- [x] Images nettes sur écran Retina
- [x] Cinq thèmes : Sombre, Grenat (`#3B0C00`), Nuit (`#03092E`), Clair, Sable (`#DED4C3`)
- [x] Sable par défaut ; sélecteur de thème discret (cinq ronds de couleur dans le pied de page, le menu Works et la visionneuse)
- [x] Deux langues : anglais par défaut, bouton discret EN / FR dans le menu (choix mémorisé)
- [x] Pages Couleurs conservées et passées au nouveau design
- [x] Textes de la v1 repris (accueil, À propos, Contact) en attendant les textes définitifs

- [x] Page d'administration `admin.html` : choisir au clic le diaporama, la sélection et les couvertures (enregistre dans `js/covers.js`, en local seulement) ; affiche la taille de chaque photo et signale celles trop petites pour le plein écran
- [x] Masquer des photos (doublons) depuis `admin.html` : retirées du site v2, sans toucher à `photos.js` ni au site actuel

## À décider (Thomas)

- [x] Accueil : sur la photo, une phrase au hasard parmi « Japon, lumière et instants silencieux. » et « Là où la lumière fait silence. » ; en dessous, la description du portfolio
- [ ] Écrire les textes définitifs d'À propos et de Contact, en anglais et en français (ceux en place viennent de la v1, traduits en français par Claude)
- [ ] Plus tard : une phrase par série et par couleur, sous le titre de chaque page (propositions faites en conversation)

## Contenu

- [x] Diaporama d'accueil : photos nettes (haute résolution), ordre aléatoire, flèches précédent / suivant
- [x] Sélection de l'accueil : 25 photos tirées au hasard parmi celles choisies dans `admin.html`
- [x] Photos de couverture choisies pour les 8 séries et les 5 couleurs
- [x] Photos des séries affichées dans un ordre aléatoire (la visionneuse suit le même ordre)
- [ ] Renvoyer sur Cloudinary en pleine résolution les photos voulues en plein écran (beaucoup sont en 2048 px, trop petites pour le diaporama)
- [x] Accueil : onglets Works / Colors ; au survol d'une couleur, toute la page prend sa teinte
- [ ] Ajouter des légendes : lieu et année

## Finitions

- [ ] Contrôler toutes les pages sur mobile et ajuster les espacements
- [ ] Contrôler les cinq thèmes sur toutes les pages
- [ ] Fond de couleur dominante pendant le chargement des photos
- [ ] Page Rose (masquée sur le site actuel tant qu'elle n'a qu'une photo)

## Mise en ligne

- [x] Nouveau site mis à la racine à la place de l'ancien, mêmes adresses de pages
- [x] Référencement de l'ancien site repris : descriptions, balises de partage, données structurées, indexation
- [x] Page Rose conservée (hors menu, non indexée, comme avant)
- [ ] Traduire aussi les titres d'onglet et les descriptions de pages (aujourd'hui en anglais seulement)
- [ ] Contrôler les cinq thèmes et le mobile sur toutes les pages (contrôle partiel fait)
- [ ] `photos.js` contient un identifiant introuvable sur Cloudinary : `MGL0899_kdca9a` (série Animals), sans doute une faute de frappe pour `IMGL0899…`
