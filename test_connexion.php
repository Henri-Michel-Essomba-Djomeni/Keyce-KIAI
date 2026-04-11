<?php
/**
 * ============================================================
 *  FICHIER DE TEST - KEYCE KIAI
 *  Vérifiez que WAMP est correctement configuré
 * ============================================================
 */

echo "<h2>✓ PHP fonctionne!</h2>";
echo "<p>Le serveur PHP est actif et fonctionne correctement.</p>";

echo "<h3>Détails du serveur:</h3>";
echo "<pre>";
echo "URL: " . $_SERVER['HTTP_HOST'] . "\n";
echo "Chemin: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "</pre>";

echo "<h3>Test de connexion à la base de données:</h3>";

try {
    require_once 'config.php';
    echo "<p style='color: green;'> ✓ Connexion à la base de données réussie!</p>";
    
    // Vérifier la table
    $stmt = $pdo->query("SHOW TABLES LIKE 'liste_des_membres'");
    $result = $stmt->fetch();
    
    if ($result) {
        echo "<p style='color: green;'>✓ Table 'liste_des_membres' existe!</p>";
    } else {
        echo "<p style='color: orange;'>⚠ Table 'liste_des_membres' n'existe pas. Importez le SQL.</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Erreur de connexion:</p>";
    echo "<pre style='color: red;'>" . $e->getMessage() . "</pre>";
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Test Keyce KIAI</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        h2, h3 { color: #333; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
</body>
</html>
