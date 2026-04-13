<?php
// ============================================================
//  KEYCE KIAI — CRÉATION DE GROUPE
//  Crée un groupe et y ajoute les membres sélectionnés
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

if (!$input || empty($input['nom']) || empty($input['membre_ids']) || !is_array($input['membre_ids'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données incomplètes (nom du groupe et membres requis).']);
    exit;
}

$nom = trim($input['nom']);
$description = isset($input['description']) ? trim($input['description']) : '';
$membre_ids = array_filter(array_map('intval', $input['membre_ids']), function($id) {
    return $id > 0;
});

if (empty($membre_ids)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'IDs de membres invalides.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Création du groupe
    $sqlGroup = "INSERT INTO groupes (nom, description) VALUES (?, ?)";
    $stmtGroup = $pdo->prepare($sqlGroup);
    $stmtGroup->execute([$nom, $description]);
    $groupe_id = $pdo->lastInsertId();

    // 2. Ajout des membres au groupe
    $sqlMember = "INSERT INTO groupe_membres (groupe_id, membre_id) VALUES (?, ?)";
    $stmtMember = $pdo->prepare($sqlMember);

    foreach ($membre_ids as $membre_id) {
        $stmtMember->execute([$groupe_id, $membre_id]);
    }

    $pdo->commit();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Groupe "' . $nom . '" créé avec succès avec ' . count($membre_ids) . ' membre(s).',
        'groupe_id' => $groupe_id
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la création du groupe : ' . $e->getMessage()
    ]);
}
?>
