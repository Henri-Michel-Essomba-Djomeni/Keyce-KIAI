<?php
// ============================================================
//  KEYCE KIAI — INSERTION D'UN MEMBRE DU GROUPE
//  Reçoit les données JSON depuis le frontend
//  Valide, nettoie et insère dans la table membres_du_groupe
// ============================================================

// --- En-têtes pour autoriser les requêtes AJAX et réponses JSON ---
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// --- Gérer les requêtes preflight (OPTIONS) ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- Vérifier que la méthode est POST ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée. Utilisez POST.'
    ]);
    exit;
}

// --- Inclure la configuration de la base de données ---
require_once 'config.php';

// --- Récupérer les données JSON envoyées ---
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Vérifier que le JSON est valide
if ($data === null) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Données JSON invalides.'
    ]);
    exit;
}

// --- Extraire et nettoyer les données ---
$nom       = isset($data['nom'])       ? trim(htmlspecialchars($data['nom'], ENT_QUOTES, 'UTF-8'))       : '';
$prenom    = isset($data['prenom'])    ? trim(htmlspecialchars($data['prenom'], ENT_QUOTES, 'UTF-8'))    : '';
$telephone = isset($data['telephone']) ? trim(preg_replace('/\s+/', '', $data['telephone']))              : '';

// --- Validation côté serveur ---
$erreurs = [];

// Vérifier que le nom n'est pas vide
if (empty($nom)) {
    $erreurs[] = 'Le nom est obligatoire.';
} elseif (strlen($nom) > 100) {
    $erreurs[] = 'Le nom ne doit pas dépasser 100 caractères.';
}

// Vérifier que le prénom n'est pas vide
if (empty($prenom)) {
    $erreurs[] = 'Le prénom est obligatoire.';
} elseif (strlen($prenom) > 100) {
    $erreurs[] = 'Le prénom ne doit pas dépasser 100 caractères.';
}

// Vérifier le numéro de téléphone
if (empty($telephone)) {
    $erreurs[] = 'Le numéro de téléphone est obligatoire.';
} elseif (!preg_match('/^\+?[0-9]{8,15}$/', $telephone)) {
    $erreurs[] = 'Le numéro de téléphone doit contenir entre 8 et 15 chiffres (préfixe + optionnel).';
}

// S'il y a des erreurs, les retourner
if (!empty($erreurs)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $erreurs)
    ]);
    exit;
}

// --- Insertion dans la base de données ---
try {
    $sql = "INSERT INTO liste_des_membres (nom, prenom, telephone) VALUES (:nom, :prenom, :telephone)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':nom'       => $nom,
        ':prenom'    => $prenom,
        ':telephone' => $telephone
    ]);

    // Réponse de succès
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Membre enregistré avec succès !',
        'id'      => (int) $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'enregistrement. Veuillez réessayer.'
    ]);
}
