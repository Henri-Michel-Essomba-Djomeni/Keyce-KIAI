<?php
// ============================================================
//  KEYCE KIAI — API : Profil de l'utilisateur connecté
//  Méthode  : GET
//  URL      : /backend/auth/me.php
//  Retourne les infos de session + données BDD à jour
// ============================================================

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../includes/helpers.php';

setCorsHeaders();
requireMethod('GET');

$user_session = requireAuth(); // redirige en 401 si non connecté

$db = getDB();

$stmt = $db->prepare('
    SELECT u.id, u.nom, u.prenom, u.email,
           u.photo_profil, u.photo_couverture,
           u.bio, u.filiere, u.niveau,
           u.date_naissance, u.genre,
           u.derniere_connexion,
           u.created_at,
           v.id   AS ville_id,
           v.nom  AS ville_nom,
           v.region
    FROM utilisateurs u
    JOIN villes v ON v.id = u.ville_id
    WHERE u.id = ? AND u.est_actif = 1
    LIMIT 1
');
$stmt->execute([$user_session['id']]);
$user = $stmt->fetch();

if (!$user) {
    // Session valide mais compte supprimé/suspendu entre-temps
    session_destroy();
    jsonError('Compte introuvable ou suspendu.', 404);
}

// Compter les amis acceptés
$stmt = $db->prepare('
    SELECT COUNT(*) AS nb_amis
    FROM amis
    WHERE (demandeur_id = ? OR recepteur_id = ?) AND statut = "accepte"
');
$stmt->execute([$user['id'], $user['id']]);
$user['nb_amis'] = (int)$stmt->fetch()['nb_amis'];

// Compter les notifications non lues
$stmt = $db->prepare('
    SELECT COUNT(*) AS nb_notifs
    FROM notifications
    WHERE destinataire_id = ? AND est_lue = 0
');
$stmt->execute([$user['id']]);
$user['nb_notifications'] = (int)$stmt->fetch()['nb_notifs'];

jsonSuccess(['utilisateur' => $user], 'Profil récupéré.');
