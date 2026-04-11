<?php
// ============================================================
//  KEYCE KIAI — API : Déconnexion
//  Méthode  : POST
//  URL      : /backend/auth/logout.php
// ============================================================

require_once __DIR__ . '/../includes/helpers.php';

setCorsHeaders();
requireMethod('POST');
startSession();

// Détruire toutes les données de session
$_SESSION = [];

// Supprimer le cookie de session
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(), '', time() - 42000,
        $params['path'], $params['domain'],
        $params['secure'], $params['httponly']
    );
}

session_destroy();

jsonSuccess([], 'Déconnexion réussie.');
