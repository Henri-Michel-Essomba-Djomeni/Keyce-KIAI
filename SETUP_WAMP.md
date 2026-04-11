# 📋 SETUP - KEYCE KIAI WAMP

## 🚨 PROBLÈME IDENTIFIÉ: Impossible de contacter le serveur

### ✅ SOLUTIONS

#### 1️⃣ Vérifier la structure des fichiers dans WAMP

Vos fichiers **DOIVENT** être dans le dossier `htdocs` de WAMP :

```
C:\wamp64\www\                    (ou C:\wamp\www\)
└── Keyce-KIAI\
    ├── index.html
    ├── config.php
    ├── insert_membre.php
    ├── test_connexion.php
    ├── assets/
    │   ├── css/
    │   │   └── style.css
    │   └── js/
    │       └── app.js
    └── db/
        ├── KeyceKIAI.sql
        └── membres_du_groupe.sql
```

**❌ SI CE N'EST PAS LE CAS** → Copiez le dossier `Keyce-KIAI` vers:
- `C:\wamp64\www\` (WAMP 64-bit) OU
- `C:\wamp\www\` (WAMP 32-bit)

---

#### 2️⃣ Importer la base de données dans phpMyAdmin

1. **Ouvrez phpMyAdmin** :
   - Allez à `http://localhost/phpmyadmin`
   - (Assurez-vous que WAMP est démarré ✓)

2. **Importez les scripts SQL** :
   - Cliquez sur l'onglet **"Importer"**
   - Cliquez sur **"Choisir un fichier"**
   - Sélectionnez : `db/membres_du_groupe.sql`
   - Cliquez sur **"Exécuter"**
   
3. **Vérifiez la créat
ion** :
   - Une base de données `KeyceKIAI` doit être créée
   - Une table `membres_du_groupe` doit être créée avec les colonnes:
     - `id` (INT)
     - `nom` (VARCHAR)
     - `prenom` (VARCHAR)
     - `telephone` (VARCHAR)
     - `date_creation` (TIMESTAMP)

---

#### 3️⃣ Vérifier la connexion PHP → MySQL

1. **Testez la configuration** :
   - Allez à `http://localhost/Keyce-KIAI/test_connexion.php`
   - Vous devriez voir: ✓ **Connexion à la base de données réussie!**

2. **Si erreur de connexion** :
   - Vérifiez que MySQL est démarré dans le panneau WAMP
   - Si MySQL ne démarre pas :
     ```
     • Fermez WAMP complètement
     • Allez à: C:\wamp64\bin\mysql\mysql8.0.23\bin\
     • Double-cliquez sur: mysqld.exe
     • Vérifiez que pas d'erreur ne s'affiche
     ```

---

#### 4️⃣ Configurer et tester l'application

1. **Ouvrez votre navigateur** :
   ```
   http://localhost/Keyce-KIAI/
   ```

2. **Remplissez le formulaire** :
   - Nom: `Dupont`
   - Prénom: `Jean`
   - Téléphone: `237680123456`
   - Cliquez sur **"Enregistrer"**

3. **Si succès** ✓ :
   - Message: "Membre enregistré avec succès !"
   - Les données sont dans la base de données

4. **Vérifier dans phpMyAdmin** :
   - Allez à `http://localhost/phpmyadmin`
   - Sélectionnez base: `KeyceKIAI`
   - Cliquez sur table: `membres_du_groupe`
   - Vous verrez tous les enregistrements

---

### 🔧 Configuration WAMP - Ports

Les ports par défaut de WAMP sont :
- **Apache** (serveur web) : `80`
- **MySQL** (base de données) : `3306`

Si ports différents, modifiez `config.php` :

```php
define('DB_HOST', 'localhost:3306');  // Changez le port si nécessaire
```

---

### 📞 Dépannage

| Problème | Solution |
|----------|----------|
| **Impossible de contacter le serveur** | 1. Vérinez que WAMP démarre ✓<br>2. Vérify dossier `htdocs`<br>3. Accédez via `http://localhost/...` pas `file://` |
| **Erreur de base de données** | 1. Importez `membres_du_groupe.sql`<br>2. Vérifiez que MySQL est démarré |
| **Table non trouvée** | Importez le fichier SQL dans phpMyAdmin |
| **CORS error** | Les en-têtes CORS dans `insert_membre.php` sont configurés ✓ |

---

### ✨ Fichiers modifiés

- ✓ `assets/js/app.js` - URL API corrigée (`/Keyce-KIAI/insert_membre.php`)
- ✓ `insert_membre.php` - Complet et opérationnel
- ✓ `config.php` - Correct
- ✓ `test_connexion.php` - Nouveau fichier pour tester

---

**Besoin d'aide supplémentaire ?** Utilisez `test_connexion.php` pour diagnostiquer !
