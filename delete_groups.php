<?php
// ============================================================
//  KEYCE KIAI — SUPPRESSION DE GROUPES
//  Supprime les groupes sélectionnés et leurs liens membres
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

require_once 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['ids']) || !is_array($input['ids'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'IDs de groupes requis.']);
    exit;
}

$ids = array_filter(array_map('intval', $input['ids']), function($id) {
    return $id > 0;
});

if (empty($ids)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'IDs de groupes invalides.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Supprimer les liens membres des groupes
    $in  = str_repeat('?,', count($ids) - 1) . '?';
    $sqlMembers = "DELETE FROM groupe_membres WHERE groupe_id IN ($in)";
    $stmtMembers = $pdo->prepare($sqlMembers);
    $stmtMembers->execute($ids);

    // 2. Supprimer les groupes
    $sqlGroups = "DELETE FROM groupes WHERE id IN ($in)";
    $stmtGroups = $pdo->prepare($sqlGroups);
    $stmtGroups->execute($ids);

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => count($ids) . ' groupe(s) supprimé(s) avec succès.'
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la suppression : ' . $e->getMessage()
    ]);
}
?>
