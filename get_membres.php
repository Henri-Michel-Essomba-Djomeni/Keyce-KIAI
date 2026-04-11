<?php
// ============================================================
//  KEYCE KIAI — RÉCUPÉRATION DES MEMBRES
//  Retourne la liste de tous les membres en JSON
// ============================================================

// --- En-têtes pour autoriser les requêtes AJAX ---
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// --- Inclure la configuration de la base de données ---
require_once 'config.php';

// --- Récupérer tous les membres ---
try {
    $sql = "SELECT id, nom, prenom, telephone, date_creation FROM liste_des_membres ORDER BY date_creation DESC";
    $stmt = $pdo->query($sql);
    $membres = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Réponse de succès
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'membres' => $membres
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la récupération des membres.'
    ]);
}
?>