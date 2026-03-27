TOUVRE - GUIDE D'UTILISATION
============================

Ce fichier explique comment fonctionne le projet, comment le lancer en local,
et quelles informations sont necessaires pour configurer la messagerie Gmail.


1) Vue d'ensemble
-----------------
- front/ : application React (Vite + Tailwind)
- server/ : API Express + Prisma (SQLite par defaut)
- prisma/ : schema Prisma et migrations

Flux principal:
- Le front appelle l'API pour les inscriptions.
- L'admin se connecte via /api/auth/login (JWT).
- Les inscriptions sont listees/modifiees/supprimees via l'API.
- Health checks:
  - /api/health
  - /api/health/db (verifie la base + latence)


2) Prerequis
------------
- Node.js 20+
- npm


3) Variables d'environnement (.env)
-----------------------------------
Exemple (deja present a la racine):

DATABASE_URL="file:./dev.db"
JWT_SECRET=change_me_too
PORT=3001

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.adresse@gmail.com
SMTP_PASS=votre_mot_de_passe_application
MAIL_FROM="Touvre <votre.adresse@gmail.com>"

Notes:
- Le code actuel n'envoie pas encore d'emails. Ces variables serviront pour
  l'envoi des newsletters quand la partie email sera branchee.


4) Installation
---------------
Racine:
  npm ci

Front:
  cd front
  npm ci


5) Base de donnees (Prisma / SQLite)
------------------------------------
Generer le client Prisma:
  npm run prisma:generate

Initialiser la base (migration):
  npm run prisma:migrate

Ouvrir Prisma Studio:
  npm run prisma:studio


6) Creer un admin
-----------------
  npm run admin:create -- <email> <password>

Exemple:
  npm run admin:create -- admin@touvre.fr MonMotDePasse


7) Lancer en local
------------------
Back (API):
  npm run dev
  -> http://localhost:3001

Front:
  cd front
  npm run dev
  -> http://localhost:5173


8) Health checks
----------------
Simple:
  GET /api/health

DB (deep):
  GET /api/health/db

Reponse attendue:
  { "ok": true, "db": true, "latencyMs": 12, "time": "..." }


9) Messagerie (Gmail SMTP) - infos necessaires
----------------------------------------------
Pour parametrer l'envoi email via Gmail, j'ai besoin de:

- Adresse Gmail a utiliser (ex: contact@touvre.fr)
- Mot de passe d'application Gmail (pas le mot de passe normal)
- Nom d'expediteur souhaite (ex: "Touvre" -> MAIL_FROM)

Comment obtenir le mot de passe d'application Gmail:
1. Activer la double authentification (2FA) sur le compte Google.
2. Aller dans Google Account > Security > App passwords.
3. Creer un mot de passe d'application (type "Mail").
4. Utiliser ce mot de passe dans SMTP_PASS.

Variables a renseigner:
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=ADRESSE_GMAIL
  SMTP_PASS=MOT_DE_PASSE_D_APPLICATION
  MAIL_FROM="Nom <ADRESSE_GMAIL>"


10) Monitoring (rappel)
-----------------------
Configurer un service externe (UptimeRobot, Better Uptime, etc.)
pour surveiller:
- https://votre-domaine.tld/ (front)
- https://votre-domaine.tld/api/health/db (API + DB)
