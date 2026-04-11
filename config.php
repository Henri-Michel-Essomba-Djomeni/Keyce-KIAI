<?php
// ============================================================
//  KEYCE KIAI — CONFIGURATION BASE DE DONNÉES
//  Connexion sécurisée à MySQL via PDO
// ============================================================

// --- Paramètres de connexion ---
define('DB_HOST', 'localhost');
define('DB_NAME', 'KeyceKIAI');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');
define('DB_PORT', 3306);

// --- DSN (Data Source Name) ---
$dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

// --- Options PDO ---
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,     // Lancer des exceptions en cas d'erreur
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,           // Résultats sous forme de tableau associatif
    PDO::ATTR_EMULATE_PREPARES   => false,                      // Désactiver les requêtes préparées émulées
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET, // Définir le charset pour la connexion
];

// --- Connexion PDO ---
try {
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    // Connexion réussie
} catch (PDOException $e) {
    // Déterminer si c'est une requête API ou HTML
    $isJson = isset($_SERVER['HTTP_ACCEPT']) && 
              strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
    
    http_response_code(500);
    
    if ($isJson || $_SERVER['REQUEST_METHOD'] === 'POST') {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => 'Erreur de connexion à la base de données.',
            'error'   => $e->getMessage()
        ]);
    } else {
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Erreur de Connexion</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #d32f2f; }
                .error { color: #d32f2f; background: #ffebee; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .debug { color: #555; background: #f5f5f5; padding: 15px; margin-top: 15px; font-family: monospace; font-size: 12px; border: 1px solid #ddd; border-radius: 5px; }
                a { color: #1976d2; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>❌ Erreur de Connexion à la Base de Données</h1>
                <div class="error">
                    <p><strong>Problème détecté:</strong> <?php echo $e->getMessage(); ?></p>
                </div>
                <p><strong>Vérifiez que:</strong></p>
                <ul>
                    <li>✓ XAMPP est démarré et Apache & MySQL sont verts</li>
                    <li>✓ La base de données <strong>KeyceKIAI</strong> existe dans phpMyAdmin</li>
                    <li>✓ La table <strong>membres_du_groupe</strong> existe</li>
                </ul>
                <p><a href="http://localhost/phpmyadmin" target="_blank">💾 Ouvrir phpMyAdmin</a></p>
                <div class="debug">
                    <strong>Infos de connexion:</strong><br>
                    Host: <?php echo DB_HOST; ?><br>
                    Port: <?php echo DB_PORT; ?><br>
                    Database: <?php echo DB_NAME; ?><br>
                    User: <?php echo DB_USER; ?><br>
                </div>
            </div>
        </body>
        </html>
        <?php
    }
    exit;
}
