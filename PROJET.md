# SPK Sales Area Manager — Dossier Projet

**Application** : SPK Sales Area Manager  
**Client** : CeramTec  
**URL de démo** : https://spk-SAM.surge.sh  
**Repo GitHub** : https://github.com/benito2223-ux/Sales-Area-Manager  
**Dernière mise à jour** : Juillet 2026 (v9.7)

---

## Description

Application web monopage (SPA) de gestion commerciale terrain pour les équipes CeramTec.  
Permet de visualiser, gérer et analyser la base clients sur une carte interactive de France.

---

## Stack technique

| Élément | Technologie |
|---|---|
| Frontend | Vanilla JS (aucun framework) |
| Carte | Leaflet 1.9.4 + OpenStreetMap / CARTO |
| Clustering | Leaflet.markercluster 1.5.3 |
| Graphiques | Chart.js 4.4.1 |
| Excel I/O | SheetJS (xlsx 0.20.1) |
| Fonts | Google Fonts — Open Sans |
| Persistance | localStorage (navigateur) |
| Hébergement | Surge.sh (static hosting) |
| Déploiement | `surge` CLI depuis le dossier local |

---

## Structure du projet

```
Sales Area Manager/
├── index.html        ← Application complète (HTML + CSS + JS en un seul fichier)
├── PROJET.md         ← Ce fichier de documentation
└── README.md         ← À créer (description courte pour GitHub)
```

> Tout le code est dans `index.html`. Pas de build tool, pas de dépendances npm.

---

## Types de clients

| Type | Couleur | Icône | Description |
|---|---|---|---|
| Fonte | Bleu `#1B5EA6` | ⚙️ Engrenage | Fonderies fonte |
| HRSA | Rouge `#E2001A` | 🔥 Flamme | High Resistance Super Alloys |
| Hard Turning | Bleu foncé `#154d8a` | 🔧 Outil | Tournage dur |
| Distributeur | Bleu clair `#2E6FAD` | 🚚 Camion | Distributeurs |
| Lead | Ambre `#f59e0b` | ⭐ Étoile | Prospects |
| New Customer | Vert `#10b981` | 👤 Personne | Nouveaux clients |

---

## Tailles de marqueurs (CA mensuel)

| Taille | CA mensuel | Diamètre marqueur |
|---|---|---|
| Petit | < 1 000 € | 24 px |
| Moyen | 1 000 € – 100 000 € | 35 px |
| Gros | > 100 000 € | 50 px |

---

## Fonctionnalités implémentées

### Carte interactive
- Fond CARTO Light (OpenStreetMap)
- Marqueurs personnalisés par type et taille CA
- Clustering automatique des zones denses (Leaflet.markercluster)
- Popup avec toutes les infos client au clic

### Gestion clients
- **Ajout / Édition** via formulaire modal (bouton "+ Nouveau Client" ou "✏️ Modifier" dans popup)
- **Suppression** avec confirmation (depuis popup ou formulaire)
- **Géocodage automatique** : coordonnées lat/lng depuis Ville + CP (API Nominatim, sans clé)

### Saisie CA
- Inline dans chaque popup : saisir le CA du mois en cours directement
- Historique 12 mois visible en graphique à barres (Chart.js)

### Notes
- Zone de texte libre dans chaque fiche client (popup)
- Sauvegarde persistante en localStorage
- Exportées dans la feuille "Notes" du fichier Excel

### Recherche & Filtres
- Barre de recherche temps réel (nom, contact, ville, CP, type)
- Chips de filtre par type de client
- Chips de filtre par taille CA (Petit / Moyen / Gros)
- Réinitialisation des filtres en un clic

### Import / Export Excel
- **Template clients** téléchargeable (.xlsx)
- **Template CA mensuel** téléchargeable (.xlsx)
- Import Base Clients (.xlsx / .xls) — création + mise à jour (déduplication par nom)
- Import CA Mensuel (.xlsx / .xls)
- **Export Excel complet** (3 feuilles : Clients · CA Historique · Notes)
- Export CSV vue filtrée

### Statistiques sidebar
- CA mois en cours (vue filtrée)
- CA cumulé année (vue filtrée)
- Répartition par type de client
- Charge secteur (répartition 🔴🟡🟢🔥, vue filtrée)

### v9.7 — Écran d'accueil : cohérence UI desktop (juillet 2026)
- **Bug visuel corrigé** : sur grand écran (PC/Mac), le contenu de l'accueil flottait sans aucune limite visuelle sur le même fond gris que le vide environnant (jusqu'à 320 px de vide de chaque côté à 1280 px de large) — donnait l'impression d'une page cassée/à moitié chargée. Le contenu est désormais présenté dans une vraie carte (fond blanc, ombre, coins arrondis, largeur 760 px) à partir de 900 px de large.
- **États vides plus utiles** : quand aucune visite n'est prévue aujourd'hui mais que des clients existent sans RDV planifié (cas d'un import frais, ex. les 91 clients réels de Benjamin), l'accueil affiche désormais le nombre de clients concernés + un bouton **"🗺 Voir mes clients sur la carte"** au lieu d'un message sec sans suite possible.
- **Fix mineur** : `autocomplete="off"` sur le champ de recherche de l'accueil (le navigateur y proposait l'email du compte connecté en auto-remplissage).

### v9.6 — Import Base Clients fiabilisé + type "À qualifier" (juillet 2026)
- **Bug corrigé** : l'import Excel n'acceptait que l'en-tête exact "Nom client" (et équivalents) — tout fichier avec des en-têtes différents échouait silencieusement (0 client importé, sans message clair). Ajout de `getCol()` (recherche insensible à la casse/aux espaces) + toast d'erreur explicite listant les colonnes détectées quand rien ne correspond.
- **Nouveau type "À qualifier"** (gris, `#9ca3af`) : les clients importés sans catégorie connue (Fonte/HRSA/Hard Turning/Distributeur/Lead/New Customer) prennent ce type neutre au lieu d'être étiquetés à tort "Lead" — évite de classer de vrais comptes établis comme prospects.
- **Import de la base réelle (91 clients)** depuis l'export SAP de Benjamin (`Liste clients Benjamin Rouquette.XLSX`, format Debitor/Name 1/Straße/PLZ/Ort — totalement différent du template attendu). Script `Sample order generator/convert_and_geocode.py` : mapping des colonnes, déduction du département FR depuis le code postal (table 01-95 + Corse 2A/2B + DOM), géocodage Nominatim (1 req/s). Bug de géocodage détecté et corrigé en cours de route : les codes postaux "Cedex" (non géographiques) faisaient matcher Nominatim sur des hameaux homonymes sans rapport — re-géocodage réussi via ville + département plutôt que le faux code postal. 91/91 adresses géocodées et vérifiées (recherche de coordonnées dupliquées entre villes différentes). Fichier prêt à importer : `Sample order generator/import_clients_geocodes.xlsx`.

### v9.5 — Notes de développement (juillet 2026)
- **Carnet perso** accessible via 🛠 dans la navbar (toujours visible, quel que soit l'onglet) : liste de notes libres avec case à cocher, badge du nombre de notes en attente, bouton **📋 Copier tout** qui génère un bloc texte prêt à coller à Claude en début de session suivante. Stockage `localStorage` (`spk_devnotes`), indépendant des données clients — carnet personnel à l'appareil, pas synchronisé au cloud.
- **Pattern voué à être répliqué à l'identique** sur les autres applications développées avec Claude (même bouton, même comportement, même format de copie).

### v9.4 — Icônes PWA (logo SAM officiel)
- icon-180/192/512.png régénérées depuis LOGO_SAM.png ; favicon ajouté.

### v9.3 — Mode Visite : écran d'accueil, photos annotées (juillet 2026)
- **Écran d'accueil "Mode Visite"** : l'app s'ouvre directement sur les RDV du jour en grandes cartes tapables (heure, client, ville), plus les visites en retard et une recherche pour un client hors planning. La carte devient un onglet secondaire (`🗺 Carte`) accessible depuis la navbar.
- **Page de visite plein écran** : un tap sur une carte ouvre le CR en plein écran (pas un modal coincé dans un popup), avec date auto-remplie, contact pré-rempli, et un **bloc contexte** (dernière visite, actions ouvertes, charge atelier) en haut. Le bouton "+ CR" du popup carte garde le comportement modal classique (compat inchangée).
- **Photos annotées (éphémères)** : bouton 📷 dans le CR → capture ou galerie → annotation sur canvas (stylo couleur, texte, annuler, tout effacer) → soit **📋 Copier l'image** directement dans le presse-papier (colle dans Teams/Copilot), soit **✓ Garder pour ce CR** (vignette locale, comptage `photos_count` inclus dans le résumé Salesforce). Aucune image n'est persistée en base — seul le nombre de photos prises est mémorisé.
- **Saisie manuscrite / vocale** : aucun développement nécessaire — Scribble (Apple Pencil) et la dictée clavier iOS fonctionnent nativement dans tous les champs texte existants.
- Champ "Points discutés" élargi et reformulé pour la prise de notes technique (conditions de coupe, mesures, résultats d'essais).

### v9.2 — Audit pré-production (juillet 2026)
- **Sécurité** : `.surgeignore` — le CSV de prospection et PROJET.md ne sont plus publiés sur Surge (fuite corrigée).
- **Modal de connexion** : croix de fermeture + clic sur le fond (l'utilisateur n'est plus piégé).
- **Popup client scrollable** (`max-height:62vh`) — plus de contenu inaccessible hors écran, surtout iPhone.
- **Mobile** : le drawer se ferme au clic sur une alerte / « À visiter » ; navbar allégée (badge version + libellé Connexion masqués).
- **Tournée** : Waze navigue vers le **premier** arrêt ; avertissement au-delà de 10 étapes Google Maps.
- **Sync** : confirmation en cas de conflit local ↔ cloud ; garde-fou données démo (confirmation avant push, bouton « Vider les données de démo », flag `spk_demo`).
- **Alertes** : baisse CA calculée sur les 3 derniers mois complets ; pas d'alerte visite si un RDV futur est planifié.
- **Robustesse** : try/catch sur `saveCache` (quota localStorage), échappement HTML systématique (popup, liste, CR, alertes, tournée), destruction des instances Chart.js, fenêtre « Semaine → Outlook » = 7 jours exacts.

### v9.1 — Inscription sans confirmation email (juillet 2026)
- Trigger `public.auto_confirm_user()` (BEFORE INSERT sur `auth.users`) qui met `email_confirmed_at=now()` → l'inscription retourne une session immédiatement, sans étape de confirmation par email.
- Filet de sécurité côté app : si un `signUp` ne renvoie pas de session, `doAuth` tente automatiquement un `signInWithPassword`.

### v9 — Synchronisation cloud (juillet 2026)
- **Sync multi-appareils iPad ↔ iPhone** via Supabase. Architecture **snapshot JSONB privé par utilisateur** : table `public.user_data (user_id, data jsonb, updated_at)` — l'app reste local-first et mirrore l'état complet (via `buildBackup()`) dans le cloud à chaque modif (débounce 1,5 s dans `saveCache`).
- **Opt-in, ouverture instantanée préservée** : l'app s'ouvre toujours directement en mode local ; « ☁️ Activer la synchronisation » (section Sauvegarde) déclenche login/signup une fois. À la connexion : cloud non vide → charge le cloud ; cloud vide → pousse le local.
- **Confidentialité stricte** : RLS `auth.uid() = user_id` sur les 4 opérations (select/insert/update/delete). Vérifié : un client anonyme voit 0 ligne. Chaque commercial ne voit que ses données.
- **Nettoyage schéma** : suppression des anciennes tables `clients`/`ca_history`/`client_notes` (vides, policies permissives `USING(true)`) et de la fonction orpheline `update_updated_at`. Advisor sécurité clean (reste un WARN mineur : protection mots-de-passe-fuités, réglage auth optionnel).
- Réécriture de la couche données : `loadAllData`/`dbUpsert*` par-table remplacés par le module snapshot (`pushSnapshot`, `enableSyncAfterLogin`, `schedulePush`).

### v8 — Fiche client plein écran (juillet 2026)
- **Fiche complète à 4 onglets** (bouton « 📇 Ouvrir la fiche complète » dans le popup) : Synthèse (charge, CA + graphique, objectif, RDV, cadence, opportunités) · Contacts · Activité · Technique. Plein écran sur mobile.
- **Contacts multiples** par client (`cl.contacts[]` : nom, rôle, tél, email, principal ⭐) — rôles : Acheteur, Chef d'atelier, Méthodes, BE, Direction, Qualité, Production. Le contact principal alimente `cl.contact/tel/email` (compat popup, CR, export).
- **Parc machines** (`cl.machines[]` : type, marque, modèle, matières usinées, outils concurrents en place, notes) — la mémoire de l'atelier client.
- **Notes horodatées** (`cl.notes_history[]`) : chaque note conservée avec sa date, au lieu d'écraser la précédente.
- Migration douce : l'ancien `contact` unique et la note `clientNotes` existante sont convertis automatiquement au premier accès (`ensureArrays`).

### v7.1 — Données sacrées (juillet 2026)
- **Vrai mode hors-ligne** : Service Worker réécrit (`sw.js`, cache `spk-sam-v7`) qui précache l'app + toutes les librairies CDN (Leaflet, Chart.js, SheetJS, Supabase, fonts) → l'app démarre sans réseau. Stratégies : network-first pour la navigation, cache-first pour JS/CSS/img, réseau direct pour les tuiles carte et l'API Supabase.
- **Sauvegarde / restauration JSON** : bouton « 💾 Sauvegarder mes données » (export complet clients + CA + notes + CR + tâches + opportunités dans un `.json`), zone « ♻️ Restaurer » (drag & drop ou fichier). Restauration avec récapitulatif + confirmation. Sert aussi de pont iPad ↔ iPhone.
- **Rappel automatique** : suivi de `spk_last_backup`, badge de statut dans la sidebar (jamais / aujourd'hui / N jours) + toast d'alerte si &gt; 7 jours (protège du purge localStorage d'iOS à 7 j d'inactivité).
- **PWA renforcée** : manifest avec vraies icônes PNG (192/512 + maskable) générées depuis le logo, métas iOS (`apple-mobile-web-app-capable`, `apple-touch-icon` 180px), notice d'installation sur écran d'accueil dans l'aide.

### v7 — RDV ultra-ergonomique (juillet 2026)
- **RDV en 2 taps** : chips de délai (+1 sem / +2 sem / +1 mois / +6 sem / +2 mois / date précise) + chips d'horaires (8h–11h / 13h–16h), dans le popup client et en fin de CR ; décalage automatique au lundi si le délai tombe un week-end
- **Cadence de visite** par client (2/4/6/8/12 semaines, réglable dans la fiche) : chip suggestion verte "✓ +N sem (cadence)" affichée en premier dans le popup et le CR
- **Export .ics Outlook** : par RDV (bouton 📆 dans le popup) ou tous les RDV des 7 prochains jours (« Semaine → Outlook » dans la sidebar) ; l'événement contient l'adresse, le briefing (contact, charge, dernier CR, actions ouvertes) et 2 rappels (–18h, –1h)
- Champs client : `rdv_heure` (HH:MM), `cadence` (semaines) ; CR : `next_heure`
- Heure affichée dans « À visiter » et dans le bloc Salesforce

### v6 — Compagnon de visite (juillet 2026)
- **CR typés 4 vitesses** : ⚡ Éclair (20 s : contact + charge + 1 ligne) · 📊 Point d'activité · 🎤 Présentation technique (sujet + réaction ❄️/🌤/🔥) · 🧪 Essai — le formulaire s'adapte au type
- **Charge de travail client** : 4 niveaux (🔴 Sous-chargé / 🟡 Normale / 🟢 Plein régime / 🔥 Débordé), réglable en 1 tap dans le popup ou via le CR, avec date de mise à jour ; pastille colorée sur les marqueurs carte + emoji en vue liste
- **Opportunités** : par client (montant €/an, étape Salesforce, échéance, probabilité, description), modal pipeline secteur, pondération par probabilité dans la sidebar
- **Générateur Salesforce** : chaque CR et chaque oppo génère un bloc texte prêt à coller dans Salesforce (bouton 📋 Copier)
- **File "À logger dans Salesforce"** : badge sidebar avec compteur, modal listant les CR non loggés avec bloc pré-rédigé, marquage ✓ individuel ou en masse

---

## Données persistées (localStorage)

| Clé | Contenu |
|---|---|
| `spk_c` | JSON array des fiches clients (incl. `charge`, `charge_date`) |
| `spk_h` | JSON object `{ clientId: [{mois, annee, ca}] }` |
| `spk_n` | JSON object `{ clientId: string }` (notes) |
| `spk_vr` | JSON object `{ clientId: [CR] }` — CR : `{type, charge, contact, sujet, reaction, points, actions, opportunite, next_date, sf_logged}` |
| `spk_tk` | JSON object `{ clientId: [tâches] }` |
| `spk_op` | JSON object `{ clientId: [opportunités] }` — `{titre, montant, etape, echeance, proba, notes}` |

> ⚠️ Les champs v6 (`charge`, `charge_date` sur client) n'existent pas encore dans le schéma Supabase — en mode connecté, prévoir une migration `ALTER TABLE clients ADD COLUMN charge text, ADD COLUMN charge_date date` + tables `opportunities` et colonnes CR étendues.

> ⚠️ Les données sont stockées dans le navigateur. Vider le cache = perte des données.  
> Solution future : synchronisation cloud (Supabase ou Google Sheets API).

---

## Déploiement

### Surge.sh (production)
```bash
cd "C:\Users\Admin\Documents\CeramTec\Sales Area Manager"
surge . spk-SAM.surge.sh
```

### GitHub
```bash
git add .
git commit -m "update"
git push origin main
```

---

## Roadmap — Fonctionnalités à venir

### Priorité haute
- [ ] Synchronisation cloud (remplacer localStorage) — Supabase recommandé
- [ ] Authentification utilisateur (multi-commercial)

### Priorité moyenne
- [ ] Dates de relance & rappels par client (follow-up date)
- [ ] Objectifs CA par client avec barre de progression
- [ ] Suppression d'un client depuis la liste (vue tableau)
- [ ] Historique horodaté des notes (conserver les anciennes avec date)

### Priorité basse
- [ ] Dark mode
- [ ] Mode hors-ligne (PWA / Service Worker)
- [ ] Itinéraire / tournée (planification de visites)
- [ ] Alertes CA en baisse (client sans CA depuis N mois)
- [ ] Tableau de bord exportable en PDF

---

## Contributeurs

- Développement : Claude Sonnet 4.6 (Anthropic)  
- Direction produit : CeramTec SPK

---

*Document généré automatiquement — à tenir à jour à chaque évolution majeure.*
