🆘 RÉSOLUTION DE PROBLÈMES
===========================

## PROBLÈME 1: "Impossible de contacter le serveur"

### Cause 1: Les fichiers sont au mauvais endroit
**❌ MAUVAIS:** `C:\Users\HP\Desktop\Keyce-KIAI\`
**✓ BON:** `C:\wamp64\www\Keyce-KIAI\`

**Solution:**
1. Copiez le dossier `Keyce-KIAI` depuis Desktop
2. Collez-le dans `C:\wamp64\www\`
3. Accédez à: `http://localhost/Keyce-KIAI/`

---

### Cause 2: Vous ouvrez le fichier en local
**❌ MAUVAIS:** `file:///C:/Users/HP/Desktop/Keyce-KIAI/index.html`
**✓ BON:** `http://localhost/Keyce-KIAI/`

**Solution:**
- N'ouvrez JAMAIS avec `file://`
- Utilisez le lien `http://` via le navigateur
- Assurez-vous que WAMP est démarré

---

### Cause 3: WAMP n'est pas démarré ou pas fonctionnel
**Solution:**
1. Ouvrez WAMP (icône sur le desktop ou Start Menu)
2. Attendez que tous les services deviennent verts ✓
3. Vérifiez:
   - Apache: doit être vert
   - MySQL: doit être vert
   - Si pas vert → Cliquez sur l'icône → Cliquez le service pour le démarrer

---

### Cause 4: Un autre service utilise le port 80
**Solution:**
1. Ouvrez l'invite de commande (cmd)
2. Tapez: `netstat -ano | findstr :80`
3. Si quelque chose s'affiche → Un autre service utilise le port 80
4. Essayez:
   - Fermer Skype, Zoom, ou autre logiciel avec serveur
   - Redémarrer WAMP
   - Si problème persiste → Changer le port Apache dans WAMP

---

## PROBLÈME 2: "Erreur de connexion à la base de données"

### Cause 1: MySQL n'est pas démarré
**Solution:**
1. Vérifiez que MySQL est vert dans WAMP
2. Si pas vert → Cliquez sur l'icône WAMP → Démarrez MySQL
3. Attendez 5 secondes

---

### Cause 2: La base de données n'existe pas
**Solution:**
1. Ouvrez phpMyAdmin: `http://localhost/phpmyadmin`
2. À gauche, regardez la liste des bases de données
3. Cherchez `KeyceKIAI` ou `keycekiai`
4. Si elle n'existe pas → Importez le fichier SQL:
   - Cliquez sur onglet **"Importer"**
   - Clquez sur **"Choisir un fichier"**
   - Sélectionnez: `C:\wamp64\www\Keyce-KIAI\db\membres_du_groupe.sql`
   - Cliquez sur **"Exécuter"**

---

### Cause 3: La table n'existe pas
**Solution:**
1. Ouvrez phpMyAdmin: `http://localhost/phpmyadmin`
2. Cliquez sur la base: `KeyceKIAI`
3. Regardez les tables (à gauche)
4. Cherchez `membres_du_groupe`
5. Si elle n'existe pas → Importez le SQL (voir Cause 2)

---

## PROBLÈME 3: Après enregistrement, rien ne se passe

### Cause 1: Erreur JavaScript
**Solution:**
1. Appuyez sur `F12` pour ouvrir les outils de développement
2. Cliquez sur l'onglet **"Console"**
3. Regardez les messages d'erreur rouges
4. Si des erreurs → Prenez une capture d'écran et partagez-la

---

### Cause 2: Erreur PHP
**Solution:**
1. Ouvrez `http://localhost/Keyce-KIAI/test_connexion.php`
2. Regardez le message d'erreur
3. Si erreur → Corrigez selon le message

---

## PROBLÈME 4: Test de connexion montre une erreur

### "Table 'membres_du_groupe' n'existe pas"
**Solution:**
1. Importez le fichier SQL dans phpMyAdmin
2. Allez à: `http://localhost/phpmyadmin`
3. Cliquez sur onglet **"Importer"**
4. Sélectionnez: `db/membres_du_groupe.sql`
5. Cliquez sur **"Exécuter"**

---

### "Erreur de connexion: SQLSTATE[HY000]"
**Cause:** MySQL n'est pas accessible

**Solution:**
1. Vérifiez que MySQL est vert dans WAMP
2. Si erreur "Can't connect to MySQL server on 'localhost'":
   - WAMP MySQL n'est pas démarré
   - Cliquez sur l'icône WAMP
   - Démarrez MySQL

---

## PROBLÈME 5: Vérifier que les outils de développement du navigateur

### Ouvrir la Console Développeur:
- **Chrome/Edge:** Appuyez sur `F12` ou `Ctrl+Shift+I`
- **Firefox:** Appuyez sur `F12`
- **Safari:** Menu → Développement → Accueil Web

### Regarder les erreurs:
1. Onglet **"Console"** → Cherchez les messages rouges
2. Onglet **"Réseau"** → Faites une requête → Vérifiez que `insert_membre.php` répond

---

## RAPIDE: Faire un test complet

Suivez cet ordre:

1. ✓ WAMP est démarré (tous services verts)
2. ✓ Dossier dans `C:\wamp64\www\Keyce-KIAI\`
3. ✓ Allez à `http://localhost/Keyce-KIAI/test_connexion.php`
4. ✓ Vous devez voir 2 messages verts
5. ✓ Si OK → Allez à `http://localhost/Keyce-KIAI/`
6. ✓ Remplissez et enregistrez un membre
7. ✓ Vérifiez dans phpMyAdmin

---

**TOUJOURS BESOIN D'AIDE?** 
Ouvrez la console (F12) et prenez une capture d'écran de l'erreur! 📸
