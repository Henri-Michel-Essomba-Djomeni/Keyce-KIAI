🚀 DÉMARRAGE RAPIDE - KEYCE KIAI
=================================

## ÉTAPE 1️⃣ - Placer les fichiers dans WAMP

**❌ PROBLÈME ACTUEL :**
Les fichiers doivent être dans le dossier `htdocs` de WAMP, pas sur le Desktop!

**✅ À FAIRE :**

### Windows:

1. Appuyez sur `Win+E` pour ouvrir l'Explorateur
2. Accédez à: `C:\wamp64\www\`
3. Collez le dossier `Keyce-KIAI` (depuis le Desktop) ici
   - Résultat: `C:\wamp64\www\Keyce-KIAI\`

OU si vous avez WAMP 32-bit:
- `C:\wamp\www\Keyce-KIAI\`

---

## ÉTAPE 2️⃣ - Vérifier que WAMP fonctionne

1. **Lancez WAMP** (si pas encore fait)
   - Double-cliquez sur l'icône WAMP sur le bureau
   - Attendez que tous les services deviennent verts ✓

2. **Vérifiez Apache et MySQL:**
   - Cliquez sur l'icône WAMP (barre de tâche)
   - Vérifiez que tout est vert ✓

---

## ÉTAPE 3️⃣ - Créer la base de données

1. **Ouvrez phpMyAdmin:**
   - Cliquez sur l'icône WAMP
   - Cliquez sur "phpMyAdmin"
   - OU allez à: `http://localhost/phpmyadmin`

2. **Importez la base de données:**
   - Cliquez sur onglet **"Importer"** (en haut)
   - Cliquez sur **"Choisir un fichier"**
   - Naviguez vers: `C:\wamp64\www\Keyce-KIAI\db\`
   - Sélectionnez: `membres_du_groupe.sql`
   - Cliquez sur **"Exécuter"** (en bas à droite)
   - ✓ Attendre le message: "Importation réussie!"

3. **Vérifiez:**
   - À gauche, vous devez voir la base: `keycekiai` (ou `KeyceKIAI`)
   - Cliquez dessus
   - Vous devez voir la table: `membres_du_groupe`

---

## ÉTAPE 4️⃣ - Tester la connexion

1. **Ouvrez votre navigateur:**
   - Allez à: `http://localhost/Keyce-KIAI/test_connexion.php`

2. **Vérifiez le message:**
   - ✓ Vous devez voir: "✓ Connexion à la base de données réussie!"
   - ✓ Vous devez voir: "✓ Table 'membres_du_groupe' existe!"

   Si ERREUR:
   - Relisez l'étape 2️⃣ (MySQL doit être vert)
   - Relisez l'étape 3️⃣ (Base de données doit être importée)

---

## ÉTAPE 5️⃣ - Utiliser l'application

1. **Ouvrez le formulaire:**
   - Allez à: `http://localhost/Keyce-KIAI/`

2. **Remplissez et enregistrez un membre:**
   - Nom: `Dupont`
   - Prénom: `Jean`
   - Téléphone: `237680123456`
   - Cliquez sur **"Enregistrer"**

3. **Succès! 🎉**
   - Message: "Membre enregistré avec succès!"
   - Le membre est enregistré dans la base de données

4. **Vérifie dans phpMyAdmin:**
   - Allez à `http://localhost/phpmyadmin`
   - Cliquez sur base: `KeyceKIAI`
   - Cliquez sur table: `membres_du_groupe`
   - Regardez l'onglet **"Parcourir"**
   - Vous verrez toutes les personnes enregistrées!

---

## 🆘 DÉPANNAGE RAPIDE

| Erreur | Solution |
|--------|----------|
| "Impossible de contacter le serveur" | ❌ N'ouvrez PAS `file://Keyce-KIAI/index.html`<br>✓ Utilisez `http://localhost/Keyce-KIAI/` |
| "Erreur de connexion MySQL" | MySQL n'est pas vert dans WAMP<br>Cliquez l'icône WAMP → Démarrez MySQL |
| "Table non trouvée" | L'import SQL n'a pas marché<br>Relisez l'étape 3️⃣ |
| Rien ne s'affiche | Vérifiez le chemin: `C:\wamp64\www\Keyce-KIAI\` |

---

## ✅ CHECKLIST FINALE

- [ ] WAMP est installé et démarre
- [ ] Dossier `Keyce-KIAI` est dans `C:\wamp64\www\`
- [ ] Apache est vert dans WAMP ✓
- [ ] MySQL est vert dans WAMP ✓
- [ ] Base de données `KeyceKIAI` existe dans phpMyAdmin
- [ ] Table `membres_du_groupe` existe
- [ ] `http://localhost/Keyce-KIAI/test_connexion.php` montre les messages verts
- [ ] Vous pouvez enregistrer des membres!

---

**C'EST BON? Vous pouvez maintenant utiliser Keyce KIAI! 🚀**
