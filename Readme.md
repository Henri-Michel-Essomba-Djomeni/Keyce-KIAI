# 🚀 KEYCE KIAI - Plateforme d'Enregistrement de Membres

Bienvenue sur **Keyce KIAI** - une plateforme simple et efficace pour enregistrer les membres du groupe!

---

## 📋 SOMMAIRE

- [Démarrage Rapide](#-démarrage-rapide)
- [Architecture](#-architecture)
- [Installation Détaillée](#-installation-détaillée)
- [Utilisation](#-utilisation)
- [Dépannage](#-dépannage)
- [Fichiers du Projet](#-fichiers-du-projet)

---

## 🏃 Démarrage Rapide

Si tu as WAMP d'installé et que tu veux commencer **maintenant**:

1. **Copie les fichiers dans WAMP:**
   - Double-cliquez sur: `copy_to_wamp.bat` ⚙️
   - (OU copie manuellement le dossier vers `C:\wamp64\www\`)

2. **Démarre WAMP:**
   - Cliquez sur l'icône WAMP
   - Attendez que Apache et MySQL soient verts ✓

3. **Importe la base de données:**
   - Va à: `http://localhost/phpmyadmin`
   - Clique sur "Importer"
   - Choisis: `db/membres_du_groupe.sql`
   - Clique sur "Exécuter"

4. **Accès à l'application:**
   - Va à: `http://localhost/Keyce-KIAI/`
   - Enregistre des membres!

**Pour des instructions détaillées** → Lis le fichier [`QUICK_START.md`](QUICK_START.md) 📖

---

## 🏗️ Architecture

### Structure Technique

```
┌─────────────────────────────────────┐
│   NAVIGATEUR (Client)               │
│   - index.html                      │
│   - assets/js/app.js (JavaScript)   │
└─────────────────┬───────────────────┘
                  │ (HTTP JSON)
                  ↓
┌─────────────────────────────────────┐
│   SERVEUR PHP (WAMP)                │
│   - insert_membre.php (API)         │
│   - config.php (Connexion BD)       │
└─────────────────┬───────────────────┘
                  │ (SQL)
                  ↓
┌─────────────────────────────────────┐
│   BASE DE DONNÉES (MySQL)           │
│   - Base: KeyceKIAI                 │
│   - Table: membres_du_groupe        │
└─────────────────────────────────────┘
```

### Flux de Données

1. **Utilisateur** remplit le formulaire
2. **JavaScript** valide les données
3. **Fetch API** envoie les données vers `insert_membre.php`
4. **PHP** valide et nettoie les données
5. **MySQL** enregistre dans la base de données
6. **Réponse JSON** confirme le succès

---

## 💾 Installation Détaillée

### Prérequis

- ✓ WAMP installé (Apache + PHP + MySQL)
  - [Télécharger WAMP](https://www.wampserver.com/)
- ✓ Connexion internet pour les Google Fonts
- ✓ Navigateur moderne (Chrome, Firefox, Edge)

### Étapes d'Installation

#### 1. Placer les fichiers dans WAMP

**Automatique (Recommandé):**
```bash
Double-cliquez sur: copy_to_wamp.bat
```

**Manuel:**
1. Ouvrir `C:\wamp64\www\`
2. Copier le dossier `Keyce-KIAI` dedans
3. Résultat: `C:\wamp64\www\Keyce-KIAI\`

#### 2. Démarrer WAMP

1. Cliquez sur l'icône WAMP (bureau ou Start Menu)
2. Attendez que les services deviennent verts:
   - Apache: ✓ Vert
   - MySQL: ✓ Vert
   - PHP: ✓ (généralement actif)

#### 3. Créer la Base de Données

1. Ouvrez: `http://localhost/phpmyadmin`
2. Cliquez sur onglet **"Importer"** (en haut)
3. Cliquez sur **"Choisir un fichier"**
4. Naviguez vers: `C:\wamp64\www\Keyce-KIAI\db\`
5. Sélectionnez: `membres_du_groupe.sql`
6. Cliquez sur **"Exécuter"** (en bas)
7. Attendez le message: ✓ "Importation réussie!"

#### 4. Vérifier la Connexion

1. Ouvrez: `http://localhost/Keyce-KIAI/test_connexion.php`
2. Vérifiez que vous voyez:
   - ✓ "Connexion à la base de données réussie!"
   - ✓ "Table 'membres_du_groupe' existe!"

#### 5. Utiliser l'Application

1. Allez à: `http://localhost/Keyce-KIAI/`
2. Remplissez le formulaire
3. Cliquez sur "Enregistrer"
4. ✓ Message: "Membre enregistré avec succès!"

---

## 🎯 Utilisation

### Enregistrer un Membre

1. **Remplissez les champs:**
   - **Nom:** Le nom de famille
   - **Prénom:** Le prénom
   - **Téléphone:** Numéro valide (8-15 chiffres)

2. **Validations appliquées:**
   - Tous les champs sont obligatoires
   - Le téléphone doit contenir que des chiffres (+ optionnel)
   - Longueur: 8-15 caractères

3. **Cliquez "Enregistrer"**
   - ✓ Si succès: "Membre enregistré avec succès!"
   - ❌ Si erreur: Message d'erreur explicatif

### Vérifier les Enregistrements

1. Allez à: `http://localhost/phpmyadmin`
2. Sélectionnez base: `KeyceKIAI`
3. Cliquez sur table: `membres_du_groupe`
4. Onglet **"Parcourir"** → Vous verrez tous les membres

---

## 🆘 Dépannage

### Problème: "Impossible de contacter le serveur"

**Causes possibles:**

| Cause | Solution |
|-------|----------|
| Fichiers au mauvais endroit | Copie vers `C:\wamp64\www\Keyce-KIAI\` |
| WAMP n'est pas démarré | Lancez WAMP, attendez que tout soit vert |
| Vous ouvrez `file://` | Utilisez `http://localhost/Keyce-KIAI/` |
| MySQL n'est pas vert | Cliquez l'icône WAMP → Démarrez MySQL |
| Base de données n'existe pas | Importez le fichier SQL |

**Détails complets** → Lis [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)

---

## 📂 Fichiers du Projet

```
Keyce-KIAI/
│
├── 📄 index.html                 # Formulaire frontend
├── 📄 config.php                 # Configuration base de données
├── 📄 insert_membre.php          # API PHP pour enregistrement
├── 📄 test_connexion.php         # Script de diagnostic
│
├── 📁 assets/
│   ├── 📁 css/
│   │   └── 📄 style.css          # Styles du formulaire
│   └── 📁 js/
│       └── 📄 app.js             # Logique JavaScript
│
├── 📁 db/
│   └── 📄 membres_du_groupe.sql  # Script création base de données
│
├── 📋 QUICK_START.md             # Guide démarrage rapide
├── 📋 TROUBLESHOOTING.md         # Résolution de problèmes
├── 📋 SETUP_WAMP.md              # Configuration détaillée WAMP
├── 📋 URLS.txt                   # Liens importants
└── ⚙️  copy_to_wamp.bat          # Script installation auto
```

---

## 🔧 Configuration

### config.php

Modifiez les paramètres de connexion si nécessaire:

```php
define('DB_HOST', 'localhost');    // Serveur MySQL
define('DB_NAME', 'KeyceKIAI');    // Nom base de données
define('DB_USER', 'root');         // Utilisateur MySQL
define('DB_PASS', '');             // Mot de passe (vide par défaut)
define('DB_PORT', 3306);           // Port MySQL
```

### Ports WAMP

Les ports par défaut:
- **Apache:** 80 (http://localhost)
- **MySQL:** 3306

Si vous changez les ports → Mettez à jour `config.php`

---

## 📈 Évolutions Futures

Améliorations suggérées:

- [ ] Ajouter un champ "Email"
- [ ] Ajouter un champ "Genre"
- [ ] Ajouter un champ "Campus/Ville"
- [ ] Interface admin pour voir les enregistrements
- [ ] Export des données (CSV)
- [ ] Authentification utilisateur
- [ ] QR code pour enregistrement rapide

---

## 📞 Support

**Si vous avez des problèmes:**

1. Lisez [`QUICK_START.md`](QUICK_START.md)
2. Consulte [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md)
3. Ouvrez [`test_connexion.php`](test_connexion.php) pour diagnostiquer
4. Appuyez sur `F12` pour voir les erreurs JavaScript

---

## 📄 Licence

Projet Keyce KIAI - Tous droits réservés (2026)

---

**Besoin d'aide?** Lis les fichiers markdown ou utilise `test_connexion.php` pour diagnostiquer! 🚀
