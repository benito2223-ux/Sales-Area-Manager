# SPK Sales Area Manager — Dossier Projet

**Application** : SPK Sales Area Manager  
**Client** : CeramTec  
**URL de démo** : https://spk-SAM.surge.sh  
**Repo GitHub** : https://github.com/benito2223-ux/Sales-Area-Manager  
**Dernière mise à jour** : Avril 2026

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
