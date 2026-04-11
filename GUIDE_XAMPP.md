# 🚀 GUIDE COMPLET XAMPP - KEYCE KIAI

## 🎯 ÉTAPES POUR FAIRE FONCTIONNER L'APPLICATION

### ÉTAPE 1️⃣ - Vérifier l'Installation XAMPP

**Si XAMPP n'est pas démarré:**
1. Ouvrez le **XAMPP Control Panel** (depuis le Bureau ou des Programmes)
2. Cliquez sur **"Start"** à côté de **Apache**
3. Cliquez sur **"Start"** à côté de **MySQL**
4. Attendez que les deux services deviennent **verts** ✓

**Vérification:**
- Apache: ![Running]
- MySQL: ![Running]

Si vous voyez des **Attempting to start** → attendez 5-10 secondes

---

### ÉTAPE 2️⃣ - Vérifier que les Fichiers sont au bon Endroit

**Ouvrez l'Explorateur** et naviguez à:
```
C:\xampp\htdocs\Keyce-KIAI\
```

Vous devez voir:
```
✓ index.html
✓ config.php
✓ insert_membre.php
✓ diagnostic_xampp.php
✓ test_connexion.php
✓ assets/ (dossier)
✓ db/ (dossier)
```

**Si ce n'est pas le cas** → Copiez le dossier `Keyce-KIAI` dans `C:\xampp\htdocs\`

---

### ÉTAPE 3️⃣ - Importer la Base de Données

1. **Ouvrez phpMyAdmin:**
   - Allez à: `http://localhost/phpmyadmin`
   - OU via XAMPP Control Panel: Cliquez sur "Admin" à côté de MySQL

2. **Importez le fichier SQL:**
   - Cliquez sur l'onglet **"Importer"** (en haut)
   - Cliquez sur **"Choisir un fichier"** (ou "Browse")
   - Naviguez vers: `C:\xampp\htdocs\Keyce-KIAI\db\`
   - Sélectionnez: **`membres_du_groupe.sql`**
   - Cliquez sur **"Exécuter"** (en bas)
   - Attendez le message: ✓ **"Importation réussie!"**

3. **Vérifiez:**
   - À gauche, cherchez la base: **`KeyceKIAI`** (vérifiez la casse!)
   - Cliquez dessus
   - Vous devez voir la table: **`membres_du_groupe`**

---

### ÉTAPE 4️⃣ - Tester la Configuration

1. **Ouvrez le diagnostic:**
   ```
   http://localhost/Keyce-KIAI/diagnostic_xampp.php
   ```

2. **Vérifiez que vous voyez:**
   - ✓ PHP Fonctionne
   - ✓ Connexion à MySQL Réussie
   - ✓ Table "membres_du_groupe" Trouvée
   - ✓ Tout est Prêt!

**Si une erreur s'affiche** → Lisez les détails et corrigez selon la section "Dépannage" ci-dessous

---

### ÉTAPE 5️⃣ - Utiliser l'Application

1. **Ouvrez le formulaire:**
   ```
   http://localhost/Keyce-KIAI/
   ```

2. **Remplissez les champs:**
   - Nom: Votre nom
   - Prénom: Votre prénom
   - Téléphone: Numéro avec 8-15 chiffres

3. **Cliquez "Enregistrer"**
   - ✓ Si succès: "Membre enregistré avec succès!"
   - Vous pouvez vérifier dans phpMyAdmin

---

## 🔗 URLS IMPORTANTES

| Lien | Fonction |
|------|----------|
| `http://localhost/Keyce-KIAI/` | 🎯 **Application** |
| `http://localhost/Keyce-KIAI/diagnostic_xampp.php` | 🔍 **Diagnostic** |
| `http://localhost/phpmyadmin` | 💾 **Base de Données** |
| `http://localhost/` | 🏠 **Accueil XAMPP** |

---

## 🆘 DÉPANNAGE - PROBLÈMES COURANTS

### ❌ "Impossible de contacter le serveur"

**Cause 1: XAMPP n'est pas démarré**
- Ouvrez XAMPP Control Panel
- Cliquez sur "Start" pour Apache et MySQL
- Attendez qu'ils deviennent verts

**Cause 2: Vous ouvrez le fichier localement**
- ❌ MAUVAIS: `file:///C:/xampp/htdocs/Keyce-KIAI/index.html`
- ✓ BON: `http://localhost/Keyce-KIAI/`

**Cause 3: Les fichiers ne sont pas dans le bon dossier**
- Vérifiez: `C:\xampp\htdocs\Keyce-KIAI\`
- Si pas là → Copiez le dossier

---

### ❌ "Erreur de connexion à la base de données"

**Vérifications:**
1. MySQL est-il vert dans XAMPP Control Panel?
2. La base `KeyceKIAI` existe-t-elle dans phpMyAdmin?
3. Avez-vous importé le fichier SQL?

**Solution:**
1. Ouvrez XAMPP Control Panel
2. Redémarrez MySQL (Stop → Start)
3. Allez à `http://localhost/phpmyadmin`
4. Réimportez le fichier `db/membres_du_groupe.sql`

---

### ❌ "Table 'membres_du_groupe' n'existe pas"

**Solution:**
1. Ouvrez `http://localhost/phpmyadmin`
2. Cliquez sur l'onglet **"Importer"**
3. Choisis le fichier: `C:\xampp\htdocs\Keyce-KIAI\db\membres_du_groupe.sql`
4. Cliquez sur **"Exécuter"**

---

### ❌ Après "Enregistrer", rien ne se passe

**Vérification 1: Console Developer**
- Appuyez sur `F12`
- Allez à l'onglet **"Console"**
- Cherchez des messages d'erreur rouges

**Vérification 2: Onglet Réseau**
- Appuyez sur `F12`
- Allez à **"Réseau"**
- Cliquez "Enregistrer"
- Regardez les requêtes
- Cherchez "insert_membre.php"
- Vérifiez le statut (doit être 201 ou 200)

**Si erreur 500:**
- Allez à `http://localhost/Keyce-KIAI/diagnostic_xampp.php`
- Cherchez le message d'erreur

---

## 📊 CHECKLIST FINALE

Avant de considérer l'installation comme complète:

- [ ] XAMPP Control Panel est ouvert
- [ ] Apache est **vert** ✓
- [ ] MySQL est **vert** ✓
- [ ] Dossier existe: `C:\xampp\htdocs\Keyce-KIAI\`
- [ ] Base de données `KeyceKIAI` existe dans phpMyAdmin
- [ ] Table `membres_du_groupe` existe
- [ ] `http://localhost/Keyce-KIAI/diagnostic_xampp.php` affiche tout en vert ✓
- [ ] `http://localhost/Keyce-KIAI/` fonctionne
- [ ] Vous pouvez enregistrer des membres

---

## 🚀 PROCHAINES ÉTAPES

Une fois que l'application fonctionne:

1. **Testez différents numéros de téléphone** pour vérifier la validation
2. **Vérifiez les enregistrements** dans phpMyAdmin:
   - `http://localhost/phpmyadmin`
   - Base: `KeyceKIAI`
   - Table: `membres_du_groupe`
   - Onglet: **"Parcourir"**
3. **Enregistrez plusieurs membres** pour tester la stabilité

---

## 💡 TRUCS & ASTUCES

### Créer un Raccourci sur le Desktop

1. Clic droit sur le Desktop
2. Nouveau → Raccourci
3. Colle: `http://localhost/Keyce-KIAI/`
4. Donne un nom: "Keyce KIAI"
5. OK!

Maintenant tu peux accéder à l'app en 1 clic!

---

**Questions?** Ouvrez `diagnostic_xampp.php` pour des informations détaillées! 🔍
