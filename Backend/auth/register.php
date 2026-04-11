<?php
// ============================================================
//  KEYCE KIAI — API : Inscription d'un étudiant
//  Méthode  : POST
//  URL      : /backend/auth/register.php
//  Body JSON: { nom, prenom, email, mot_de_passe, ville_id,
//               filiere, niveau }
// ============================================================

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../includes/helpers.php';

setCorsHeaders();
requireMethod('POST');

$body = getJsonBody();

// --- 1. Récupération et nettoyage des champs ---
$nom         = sanitize($body['nom']          ?? '');
$prenom      = sanitize($body['prenom']       ?? '');
$email       = trim(strtolower($body['email'] ?? ''));
$mot_de_passe = $body['mot_de_passe']         ?? '';
$ville_id    = (int)($body['ville_id']        ?? 0);
$filiere     = sanitize($body['filiere']      ?? '');
$niveau      = sanitize($body['niveau']       ?? 'L1');

// --- 2. Validation ---
$erreurs = [];

if (empty($nom))          $erreurs['nom']          = 'Le nom est obligatoire.';
if (empty($prenom))       $erreurs['prenom']        = 'Le prénom est obligatoire.';
if (empty($email))        $erreurs['email']         = "L'email est obligatoire.";
if (!isValidEmail($email)) $erreurs['email']        = "L'email n'est pas valide.";
if (strlen($mot_de_passe) < 6) $erreurs['mot_de_passe'] = 'Le mot de passe doit faire au moins 6 caractères.';
if ($ville_id <= 0)       $erreurs['ville_id']      = 'Veuillez sélectionner un campus.';

if (!empty($erreurs)) {
    jsonError('Données invalides.', 422, $erreurs);
}

$db = getDB();

// --- 3. Vérifier que l'email n'est pas déjà utilisé ---
$stmt = $db->prepare('SELECT id FROM utilisateurs WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonError('Cet email est déjà utilisé.', 409);
}

// --- 4. Vérifier que la ville existe ---
$stmt = $db->prepare('SELECT id FROM villes WHERE id = ? LIMIT 1');
$stmt->execute([$ville_id]);
if (!$stmt->fetch()) {
    jsonError('Campus invalide.', 400);
}

// --- 5. Hash du mot de passe ---
$hash = password_hash($mot_de_passe, PASSWORD_BCRYPT);

// --- 6. Insertion en base ---
$stmt = $db->prepare('
    INSERT INTO utilisateurs
        (ville_id, nom, prenom, email, mot_de_passe, filiere, niveau, est_actif, est_verifie)
    VALUES
        (:ville_id, :nom, :prenom, :email, :mot_de_passe, :filiere, :niveau, 1, 1)
');

$stmt->execute([
    ':ville_id'     => $ville_id,
    ':nom'          => $nom,
    ':prenom'       => $prenom,
    ':email'        => $email,
    ':mot_de_passe' => $hash,
    ':filiere'      => $filiere,
    ':niveau'       => $niveau,
]);

$new_id = $db->lastInsertId();

// --- 7. Réponse ---
jsonSuccess(
    ['utilisateur_id' => (int)$new_id],
    'Compte créé avec succès. Bienvenue sur Keyce KIAI !',
    201
);
