<?php
// ============================================================
//  KEYCE KIAI — API : Connexion d'un étudiant
//  Méthode  : POST
//  URL      : /backend/auth/login.php
//  Body JSON: { email, mot_de_passe }
// ============================================================

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../includes/helpers.php';

setCorsHeaders();
requireMethod('POST');
startSession();

// Si déjà connecté, retourner directement
if (!empty($_SESSION['user_id'])) {
    jsonSuccess(
        ['utilisateur_id' => $_SESSION['user_id']],
        'Vous êtes déjà connecté.'
    );
}

$body = getJsonBody();

$email        = trim(strtolower($body['email']        ?? ''));
$mot_de_passe = $body['mot_de_passe'] ?? '';

// --- Validation basique ---
if (empty($email) || empty($mot_de_passe)) {
    jsonError("L'email et le mot de passe sont obligatoires.", 422);
}

$db = getDB();

// --- Rechercher l'utilisateur ---
$stmt = $db->prepare('
    SELECT u.id, u.nom, u.prenom, u.email, u.mot_de_passe,
           u.photo_profil, u.ville_id, u.filiere, u.niveau,
           u.est_actif, v.nom AS ville_nom
    FROM utilisateurs u
    JOIN villes v ON v.id = u.ville_id
    WHERE u.email = ?
    LIMIT 1
');
$stmt->execute([$email]);
$user = $stmt->fetch();

// --- Vérifier le mot de passe ---
// On utilise un délai fixe même si l'user n'existe pas (anti-timing attack)
$hash_factice = '$2y$10$invalidhashforcomparison000000000000000000000000000';
$hash_a_verifier = $user ? $user['mot_de_passe'] : $hash_factice;

if (!$user || !password_verify($mot_de_passe, $hash_a_verifier)) {
    jsonError('Email ou mot de passe incorrect.', 401);
}

// --- Vérifier que le compte est actif ---
if (!$user['est_actif']) {
    jsonError('Votre compte a été suspendu. Contactez un administrateur.', 403);
}

// --- Mettre à jour la dernière connexion ---
$db->prepare('UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = ?')
   ->execute([$user['id']]);

// --- Créer la session ---
session_regenerate_id(true); // sécurité : nouvel ID de session
$_SESSION['user_id']       = $user['id'];
$_SESSION['user_nom']      = $user['nom'];
$_SESSION['user_prenom']   = $user['prenom'];
$_SESSION['user_email']    = $user['email'];
$_SESSION['user_ville_id'] = $user['ville_id'];

// --- Réponse (ne jamais renvoyer le mot de passe) ---
jsonSuccess([
    'utilisateur' => [
        'id'           => (int)$user['id'],
        'nom'          => $user['nom'],
        'prenom'       => $user['prenom'],
        'email'        => $user['email'],
        'photo_profil' => $user['photo_profil'],
        'ville'        => $user['ville_nom'],
        'filiere'      => $user['filiere'],
        'niveau'       => $user['niveau'],
    ]
], 'Connexion réussie. Bienvenue ' . $user['prenom'] . ' !');
