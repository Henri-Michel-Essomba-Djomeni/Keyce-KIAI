<?php
/**
 * ============================================================
 *  DIAGNOSTIC COMPLET - KEYCE KIAI AVEC XAMPP
 *  Testez votre installation XAMPP
 * ============================================================
 */
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagnostic XAMPP - Keyce KIAI</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .content { padding: 30px 20px; }
        .section { margin-bottom: 30px; }
        .section h2 {
            font-size: 18px;
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .check {
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 6px;
            border-left: 4px solid;
        }
        .check.success {
            background: #e8f5e9;
            border-color: #4caf50;
            color: #2e7d32;
        }
        .check.error {
            background: #ffebee;
            border-color: #f44336;
            color: #c62828;
        }
        .check.warning {
            background: #fff3e0;
            border-color: #ff9800;
            color: #e65100;
        }
        .check-icon {
            font-size: 24px;
            margin-right: 15px;
            min-width: 30px;
        }
        .check-text {
            flex: 1;
        }
        .check-label {
            font-weight: 600;
            margin-bottom: 3px;
        }
        .check-detail {
            font-size: 12px;
            opacity: 0.8;
        }
        .actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 10px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #667eea;
            color: white;
        }
        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .btn-success {
            background: #4caf50;
            color: white;
        }
        .status-bar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .status-box {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }
        .status-box strong { display: block; color: #333; margin-bottom: 5px; }
        .status-box span { font-size: 12px; color: #666; }
        .info-box {
            background: #f0f7ff;
            border: 1px solid #b3e5fc;
            border-radius: 6px;
            padding: 15px;
            margin-top: 15px;
        }
        .info-box strong { color: #01579b; display: block; margin-bottom: 8px; }
        .info-box code {
            background: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .footer {
            background: #f9f9f9;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Diagnostic XAMPP</h1>
            <p>Keyce KIAI - Vérification complète de votre installation</p>
        </div>
        
        <div class="content">
            <!-- PHP Status -->
            <div class="section">
                <h2>✅ PHP - Serveur Web</h2>
                <div class="check success">
                    <div class="check-icon">✓</div>
                    <div class="check-text">
                        <div class="check-label">PHP Fonctionne</div>
                        <div class="check-detail">Version: <?php echo phpversion(); ?></div>
                    </div>
                </div>
                <div class="status-bar">
                    <div class="status-box">
                        <strong>PHP Version</strong>
                        <span><?php echo phpversion(); ?></span>
                    </div>
                    <div class="status-box">
                        <strong>Serveur</strong>
                        <span><?php echo $_SERVER['SERVER_SOFTWARE']; ?></span>
                    </div>
                </div>
            </div>

            <!-- Database Connection -->
            <div class="section">
                <h2>🗄️ Base de Données - Connexion MySQL</h2>
                <?php
                // Inclure la configuration
                require_once '../../Keyce-KIAI/config.php';
                
                // Test de connexion
                $dbTest = [
                    'connected' => false,
                    'error' => '',
                    'tables' => [],
                    'data_count' => 0
                ];
                
                try {
                    // Test 1: Connexion
                    $dbTest['connected'] = true;
                    
                    // Test 2: Vérifier la table
                    $stmt = $pdo->query("SHOW TABLES LIKE 'membres_du_groupe'");
                    $result = $stmt->fetch();
                    
                    if ($result) {
                        // Test 3: Compter les données
                        $stmt = $pdo->query("SELECT COUNT(*) as count FROM membres_du_groupe");
                        $row = $stmt->fetch();
                        $dbTest['data_count'] = $row['count'];
                    }
                } catch (Exception $e) {
                    $dbTest['error'] = $e->getMessage();
                }
                
                if ($dbTest['connected']) {
                    echo '
                    <div class="check success">
                        <div class="check-icon">✓</div>
                        <div class="check-text">
                            <div class="check-label">Connexion à MySQL Réussie</div>
                            <div class="check-detail">Serveur: ' . DB_HOST . ':' . DB_PORT . ' | Base: ' . DB_NAME . '</div>
                        </div>
                    </div>
                    ';
                    
                    if ($result) {
                        echo '
                        <div class="check success">
                            <div class="check-icon">✓</div>
                            <div class="check-text">
                                <div class="check-label">Table "membres_du_groupe" Trouvée</div>
                                <div class="check-detail">Enregistrements: ' . $dbTest['data_count'] . ' membre(s)</div>
                            </div>
                        </div>
                        ';
                    } else {
                        echo '
                        <div class="check error">
                            <div class="check-icon">✗</div>
                            <div class="check-text">
                                <div class="check-label">Table "membres_du_groupe" NON TROUVÉE</div>
                                <div class="check-detail">Vous devez importer le fichier SQL</div>
                            </div>
                        </div>
                        ';
                    }
                } else {
                    echo '
                    <div class="check error">
                        <div class="check-icon">✗</div>
                        <div class="check-text">
                            <div class="check-label">Connexion à MySQL Échouée</div>
                            <div class="check-detail">' . htmlspecialchars($dbTest['error']) . '</div>
                        </div>
                    </div>
                    ';
                }
                ?>
                
                <div class="info-box">
                    <strong>📍 Configuration:</strong>
                    <div style="margin-top: 8px; font-family: 'Courier New', monospace; font-size: 12px;">
                        Host: <code><?php echo DB_HOST; ?></code><br>
                        Port: <code><?php echo DB_PORT; ?></code><br>
                        Database: <code><?php echo DB_NAME; ?></code><br>
                        User: <code><?php echo DB_USER; ?></code>
                    </div>
                </div>
            </div>

            <!-- File Paths -->
            <div class="section">
                <h2>📂 Chemins de Fichiers</h2>
                <div class="info-box">
                    <strong>Emplacements:</strong>
                    <div style="margin-top: 8px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6;">
                        Fichier actuel: <code><?php echo __FILE__; ?></code><br>
                        Racine Web: <code><?php echo $_SERVER['DOCUMENT_ROOT']; ?></code><br>
                        Répertoire: <code><?php echo dirname(__FILE__); ?></code>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="section">
                <h2>🎯 Actions Rapides</h2>
                <div class="actions">
                    <a href="http://localhost/phpmyadmin" target="_blank" class="btn btn-primary">💾 phpMyAdmin</a>
                    <a href="http://localhost/Keyce-KIAI/" class="btn btn-success">🚀 Application</a>
                    <a href="http://localhost/Keyce-KIAI/test_connexion.php" class="btn btn-primary">🔍 Retester</a>
                </div>
            </div>

            <!-- Status Summary -->
            <div class="section">
                <h2>📊 Résumé du Statut</h2>
                <?php
                $php_ok = true;
                $db_ok = $dbTest['connected'];
                $table_ok = $result ? true : false;
                
                $all_ok = $php_ok && $db_ok && $table_ok;
                
                if ($all_ok) {
                    echo '
                    <div class="check success">
                        <div class="check-icon">✓</div>
                        <div class="check-text">
                            <div class="check-label">🎉 Tout est Prêt!</div>
                            <div class="check-detail">Vous pouvez maintenant utiliser l\'application à: <a href="http://localhost/Keyce-KIAI/">http://localhost/Keyce-KIAI/</a></div>
                        </div>
                    </div>
                    ';
                } else {
                    echo '
                    <div class="check warning">
                        <div class="check-icon">⚠</div>
                        <div class="check-text">
                            <div class="check-label">Problème(s) Détecté(s)</div>
                            <div class="check-detail">Suivez les instructions ci-dessus pour résoudre les erreurs</div>
                        </div>
                    </div>
                    ';
                }
                ?>
            </div>
        </div>

        <div class="footer">
            <p>Diagnostic généré le <?php echo date('d/m/Y H:i:s'); ?> | XAMPP Keyce KIAI</p>
        </div>
    </div>
</body>
</html>
