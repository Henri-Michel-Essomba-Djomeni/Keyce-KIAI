<?php
// ============================================================
//  KEYCE KIAI — SUPPRESSION DE MEMBRES
//  Supprime un ou plusieurs membres par leurs IDs
// ============================================================

// --- En-têtes ---
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Répondre aux preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Vérifier la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// --- Inclure la configuration ---
require_once 'config.php';

// --- Lire le corps de la requête ---
$input = json_decode(file_get_contents('php://input'), true);

// Valider les données
if (!$input || !isset($input['ids']) || !is_array($input['ids']) || count($input['ids']) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Aucun membre sélectionné pour la suppression.']);
    exit;
}

// Nettoyer et valider les IDs (ne garder que des entiers positifs)
$ids = array_filter(array_map('intval', $input['ids']), function($id) {
    return $id > 0;
});

if (empty($ids)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'IDs invalides.']);
    exit;
}

// --- Supprimer les membres ---
try {
    // Construire les placeholders pour la requête préparée
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $sql = "DELETE FROM liste_des_membres WHERE id IN ($placeholders)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_values($ids));
    
    $deleted = $stmt->rowCount();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $deleted . ' membre(s) supprimé(s) avec succès.',
        'deleted' => $deleted
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la suppression des membres.'
    ]);
}
?>
