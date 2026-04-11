# Keyce KIAI 🎓

Réseau social pour les étudiants de l'école **Keyce** — Douala, Yaoundé, Bafoussam et Ngounde.

---

## Stack technique

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5
- **Backend**  : PHP 8+
- **Base de données** : MySQL 8
- **Versioning** : Git / GitHub

---

## Installation en local

### Prérequis
- XAMPP (ou WAMP / Laragon) avec PHP 8+ et MySQL
- Git

### Étapes

**1. Cloner le repo**
```bash
git clone https://github.com/Henri-Michel-Essomba-Djomeni/keyce-kiai.git
cd keyce-kiai
```

**2. Créer la base de données**

Ouvrir phpMyAdmin, créer une base `keyce_kiai_db` puis importer :
```
sql/keyce_kiai_database.sql
```

**3. Configurer la connexion BDD**
```bash
cp config/database.example.php config/database.php
```
Ouvrir `config/database.php` et remplir `DB_USER` et `DB_PASS`.

**4. Créer le dossier uploads**
```bash
mkdir uploads
```

**5. Lancer le projet**

Placer le dossier dans `htdocs/` (XAMPP) et ouvrir `http://localhost/keyce-kiai/`.

---

## Structure du projet

```
keyce-kiai/
├── config/
│   ├── database.php          # Config BDD locale (ignoré par Git)
│   └── database.example.php  # Modèle à copier
├── backend/
│   ├── auth/
│   │   ├── register.php      # API inscription
│   │   ├── login.php         # API connexion
│   │   ├── logout.php        # API déconnexion
│   │   └── me.php            # API profil connecté
│   └── includes/
│       └── helpers.php       # Fonctions utilitaires
├── frontend/
│   ├── css/
│   ├── js/
│   └── pages/
├── sql/
│   └── keyce_kiai_database.sql
├── uploads/                  # Photos / vidéos (ignoré par Git)
├── .gitignore
└── README.md
```

---

## Branches Git

| Branche              | Responsable     | Rôle                        |
|----------------------|-----------------|-----------------------------|
| `main`               | Chef de groupe  | Production stable           |
| `develop`            | Chef de groupe  | Intégration continue        |
| `feature/auth-backend`   | Personne 2  | API PHP / BDD               |
| `feature/frontend-pages` | Personne 3  | HTML / CSS / JS             |
| `feature/integration`    | Personne 4  | AJAX / tests                |

---

## Équipe

| Membre | Rôle | Campus |
|--------|------|--------|
| Henri Michel Essomba | Chef de groupe | Yaoundé |
| ...    | Backend        | ...     |
| ...    | Frontend       | ...     |
| ...    | Intégration    | ...     |

---

## API — Endpoints disponibles

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/backend/auth/register.php` | Inscription |
| POST | `/backend/auth/login.php`    | Connexion   |
| POST | `/backend/auth/logout.php`   | Déconnexion |
| GET  | `/backend/auth/me.php`       | Profil connecté |
