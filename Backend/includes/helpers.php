<?php
// ============================================================
//  KEYCE KIAI — Fonctions utilitaires partagées
//  À inclure dans toutes les pages API
// ============================================================

// --- Démarrage sécurisé de la session ---
function startSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'lifetime' => 86400 * 7,   // 7 jours
            'path'     => '/',
            'secure'   => false,        // mettre true en HTTPS (production)
            'httponly' => true,         // protection XSS
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

// --- Réponses JSON standardisées ---
function jsonSuccess(array $data = [], string $message = 'Succès', int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data'    => $data,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $code = 400, array $errors = []): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => $message,
        'errors'  => $errors,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// --- Vérifier que la méthode HTTP est correcte ---
function requireMethod(string $method): void {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        jsonError('Méthode non autorisée.', 405);
    }
}

// --- Récupérer le body JSON d'une requête POST ---
function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// --- Vérifier qu'un utilisateur est connecté ---
function requireAuth(): array {
    startSession();
    if (empty($_SESSION['user_id'])) {
        jsonError('Non authentifié. Veuillez vous connecter.', 401);
    }
    return [
        'id'     => $_SESSION['user_id'],
        'nom'    => $_SESSION['user_nom'],
        'email'  => $_SESSION['user_email'],
        'ville'  => $_SESSION['user_ville_id'],
    ];
}

// --- Nettoyer une chaîne de caractères ---
function sanitize(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

// --- Valider un email ---
function isValidEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// --- Headers CORS (utile si frontend séparé du backend) ---
function setCorsHeaders(): void {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
