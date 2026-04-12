<?php
// ============================================================
//  KEYCE KIAI — RÉCUPÉRATION DES GROUPES
//  Retourne la liste des groupes avec leurs membres
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once 'config.php';

try {
    // Récupérer les groupes avec le nombre de membres
    $sql = "SELECT g.*, COUNT(gm.membre_id) as nombre_membres 
            FROM groupes g 
            LEFT JOIN groupe_membres gm ON g.id = gm.groupe_id 
            GROUP BY g.id 
            ORDER BY g.date_creation DESC";
    
    $stmt = $pdo->query($sql);
    $groupes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Pour chaque groupe, charger les détails des membres (optionnel, on peut le faire à la demande)
    // Ici on va juste renvoyer la liste des groupes pour l'index

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'groupes' => $groupes
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des groupes.'
    ]);
}
?>
