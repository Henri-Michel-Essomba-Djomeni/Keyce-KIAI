-- ============================================================
--  KEYCE KIAI SOCIAL NETWORK — DATABASE SCHEMA
--  Réseau social pour étudiants Keyce KIAI (Douala, Yaoundé,
--  Bafoussam, Ngounde)
--  Version : 1.0 — À ajuster selon l'évolution du projet


CREATE DATABASE IF NOT EXISTS keyce_kiai_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE keyce_kiai_db;

-- ============================================================
-- 1. VILLES / CAMPUS
--    Référentiel des 4 campus Keyce KIAI
-- ============================================================
CREATE TABLE villes (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL,               -- Ex: "Douala", "Yaoundé"
    region      VARCHAR(100),                         -- Ex: "Littoral", "Centre"
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO villes (nom, region) VALUES
    ('Douala',    'Littoral'),
    ('Yaoundé',   'Centre'),
    ('Bafoussam', 'Ouest'),
    ('Ngounde',   'Sud-Ouest');


-- ============================================================
-- 2. UTILISATEURS
--    Étudiants inscrits sur le réseau
-- ============================================================
CREATE TABLE utilisateurs (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ville_id        INT UNSIGNED NOT NULL,
    nom             VARCHAR(100) NOT NULL,
    prenom          VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe    VARCHAR(255) NOT NULL,           -- bcrypt hash (jamais en clair)
    photo_profil    VARCHAR(500) DEFAULT NULL,        -- chemin ou URL de la photo
    photo_couverture VARCHAR(500) DEFAULT NULL,
    bio             TEXT DEFAULT NULL,
    filiere         VARCHAR(150) DEFAULT NULL,        -- Ex: "Informatique", "Gestion"
    niveau          ENUM('L1','L2','L3','M1','M2','BTS1','BTS2','Autre') DEFAULT 'L1',
    date_naissance  DATE DEFAULT NULL,
    genre           ENUM('Homme','Femme','Autre','Non précisé') DEFAULT 'Non précisé',
    est_actif       TINYINT(1) DEFAULT 1,             -- 0 = compte suspendu
    est_verifie     TINYINT(1) DEFAULT 0,             -- vérification email
    token_verification VARCHAR(255) DEFAULT NULL,
    token_reset_mdp    VARCHAR(255) DEFAULT NULL,
    token_reset_expiry DATETIME DEFAULT NULL,
    derniere_connexion DATETIME DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ville_id) REFERENCES villes(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_utilisateurs_email   ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_ville   ON utilisateurs(ville_id);


-- ============================================================
-- 3. AMIS / ABONNEMENTS
--    Système d'amitié bidirectionnel (style Facebook)
-- ============================================================
CREATE TABLE amis (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    demandeur_id    INT UNSIGNED NOT NULL,           -- celui qui envoie la demande
    recepteur_id    INT UNSIGNED NOT NULL,           -- celui qui reçoit
    statut          ENUM('en_attente','accepte','refuse','bloque') DEFAULT 'en_attente',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_amis (demandeur_id, recepteur_id),
    FOREIGN KEY (demandeur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (recepteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_amis_recepteur ON amis(recepteur_id);
CREATE INDEX idx_amis_statut    ON amis(statut);


-- ============================================================
-- 4. PUBLICATIONS (POSTS)
--    Posts texte, photo, vidéo sur le fil d'actualité
-- ============================================================
CREATE TABLE publications (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    auteur_id       INT UNSIGNED NOT NULL,
    groupe_id       INT UNSIGNED DEFAULT NULL,        -- NULL = publication publique/profil
    contenu         TEXT DEFAULT NULL,
    type_media      ENUM('aucun','photo','video','reel','lien') DEFAULT 'aucun',
    media_url       VARCHAR(500) DEFAULT NULL,        -- chemin ou URL du fichier
    media_miniature VARCHAR(500) DEFAULT NULL,        -- thumbnail pour vidéo/reel
    visibilite      ENUM('public','amis','groupe','prive') DEFAULT 'public',
    nb_likes        INT UNSIGNED DEFAULT 0,           -- dénormalisé pour perf
    nb_commentaires INT UNSIGNED DEFAULT 0,
    nb_partages     INT UNSIGNED DEFAULT 0,
    est_epingle     TINYINT(1) DEFAULT 0,
    est_supprime    TINYINT(1) DEFAULT 0,             -- soft delete
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (auteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_publications_auteur  ON publications(auteur_id);
CREATE INDEX idx_publications_groupe  ON publications(groupe_id);
CREATE INDEX idx_publications_date    ON publications(created_at DESC);


-- ============================================================
-- 5. LIKES
--    Réactions aux publications et commentaires
-- ============================================================
CREATE TABLE likes (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id  INT UNSIGNED NOT NULL,
    cible_type      ENUM('publication','commentaire') NOT NULL,
    cible_id        INT UNSIGNED NOT NULL,
    type_reaction   ENUM('like','love','haha','wow','triste','colere') DEFAULT 'like',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_like (utilisateur_id, cible_type, cible_id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_likes_cible ON likes(cible_type, cible_id);


-- ============================================================
-- 6. COMMENTAIRES
--    Commentaires sur publications (avec réponses imbriquées)
-- ============================================================
CREATE TABLE commentaires (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    publication_id  INT UNSIGNED NOT NULL,
    auteur_id       INT UNSIGNED NOT NULL,
    parent_id       INT UNSIGNED DEFAULT NULL,        -- NULL = commentaire racine, sinon réponse
    contenu         TEXT NOT NULL,
    media_url       VARCHAR(500) DEFAULT NULL,        -- photo dans un commentaire
    nb_likes        INT UNSIGNED DEFAULT 0,
    est_supprime    TINYINT(1) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE,
    FOREIGN KEY (auteur_id)      REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id)      REFERENCES commentaires(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_commentaires_publication ON commentaires(publication_id);
CREATE INDEX idx_commentaires_auteur      ON commentaires(auteur_id);


-- ============================================================
-- 7. PARTAGES
--    Partage d'une publication (avec ou sans texte)
-- ============================================================
CREATE TABLE partages (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id      INT UNSIGNED NOT NULL,
    publication_id      INT UNSIGNED NOT NULL,
    commentaire_partage TEXT DEFAULT NULL,            -- texte ajouté lors du partage
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id)  REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (publication_id)  REFERENCES publications(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 8. GROUPES
--    Groupes de discussion style WhatsApp/Facebook Groups
-- ============================================================
CREATE TABLE groupes (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    createur_id     INT UNSIGNED NOT NULL,
    nom             VARCHAR(200) NOT NULL,
    description     TEXT DEFAULT NULL,
    photo           VARCHAR(500) DEFAULT NULL,
    photo_couverture VARCHAR(500) DEFAULT NULL,
    type            ENUM('public','prive','secret') DEFAULT 'public',
    ville_id        INT UNSIGNED DEFAULT NULL,        -- groupe limité à une ville (optionnel)
    nb_membres      INT UNSIGNED DEFAULT 1,
    est_actif       TINYINT(1) DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (createur_id) REFERENCES utilisateurs(id) ON DELETE RESTRICT,
    FOREIGN KEY (ville_id)    REFERENCES villes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_groupes_createur ON groupes(createur_id);
CREATE INDEX idx_groupes_ville    ON groupes(ville_id);


-- ============================================================
-- 9. MEMBRES DES GROUPES
-- ============================================================
CREATE TABLE membres_groupe (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    groupe_id       INT UNSIGNED NOT NULL,
    utilisateur_id  INT UNSIGNED NOT NULL,
    role            ENUM('membre','moderateur','admin') DEFAULT 'membre',
    statut          ENUM('en_attente','accepte','banni') DEFAULT 'accepte',
    joined_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_membre_groupe (groupe_id, utilisateur_id),
    FOREIGN KEY (groupe_id)       REFERENCES groupes(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur_id)  REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_membres_groupe_user ON membres_groupe(utilisateur_id);


-- ============================================================
-- 10. CONVERSATIONS PRIVÉES
--     Boîtes de messagerie 1-à-1 entre deux utilisateurs
-- ============================================================
CREATE TABLE conversations (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utilisateur1_id INT UNSIGNED NOT NULL,
    utilisateur2_id INT UNSIGNED NOT NULL,
    dernier_message_id INT UNSIGNED DEFAULT NULL,     -- mis à jour à chaque nouveau message
    u1_archive      TINYINT(1) DEFAULT 0,             -- utilisateur1 a archivé
    u2_archive      TINYINT(1) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_conversation (utilisateur1_id, utilisateur2_id),
    FOREIGN KEY (utilisateur1_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (utilisateur2_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 11. MESSAGES PRIVÉS
--     Messages dans une conversation 1-à-1
-- ============================================================
CREATE TABLE messages_prives (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT UNSIGNED NOT NULL,
    expediteur_id   INT UNSIGNED NOT NULL,
    contenu         TEXT DEFAULT NULL,
    type_media      ENUM('texte','photo','video','audio','fichier') DEFAULT 'texte',
    media_url       VARCHAR(500) DEFAULT NULL,
    est_lu          TINYINT(1) DEFAULT 0,
    est_supprime_exp TINYINT(1) DEFAULT 0,            -- supprimé par l'expéditeur
    est_supprime_rec TINYINT(1) DEFAULT 0,            -- supprimé par le destinataire
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (expediteur_id)   REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_messages_prives_conv ON messages_prives(conversation_id, created_at DESC);

-- Lien retour pour dernier_message_id (après création de la table)
ALTER TABLE conversations
    ADD CONSTRAINT fk_dernier_message
    FOREIGN KEY (dernier_message_id) REFERENCES messages_prives(id) ON DELETE SET NULL;


-- ============================================================
-- 12. MESSAGES DE GROUPE
--     Messages dans un groupe (style WhatsApp)
-- ============================================================
CREATE TABLE messages_groupe (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    groupe_id       INT UNSIGNED NOT NULL,
    expediteur_id   INT UNSIGNED NOT NULL,
    contenu         TEXT DEFAULT NULL,
    type_media      ENUM('texte','photo','video','audio','fichier') DEFAULT 'texte',
    media_url       VARCHAR(500) DEFAULT NULL,
    reply_to_id     INT UNSIGNED DEFAULT NULL,        -- réponse à un message précédent
    est_supprime    TINYINT(1) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (groupe_id)     REFERENCES groupes(id) ON DELETE CASCADE,
    FOREIGN KEY (expediteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_id)   REFERENCES messages_groupe(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_messages_groupe_groupe ON messages_groupe(groupe_id, created_at DESC);


-- ============================================================
-- 13. NOTIFICATIONS
--     Toutes les notifications in-app
-- ============================================================
CREATE TABLE notifications (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    destinataire_id INT UNSIGNED NOT NULL,
    expediteur_id   INT UNSIGNED DEFAULT NULL,        -- NULL = notification système
    type            ENUM(
                        'like_publication',
                        'commentaire_publication',
                        'reponse_commentaire',
                        'partage_publication',
                        'demande_amitie',
                        'amitie_acceptee',
                        'invitation_groupe',
                        'nouveau_message',
                        'mention',
                        'systeme'
                    ) NOT NULL,
    cible_type      VARCHAR(50) DEFAULT NULL,         -- 'publication', 'commentaire', 'groupe'...
    cible_id        INT UNSIGNED DEFAULT NULL,
    message         VARCHAR(500) DEFAULT NULL,        -- texte de la notif
    est_lue         TINYINT(1) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destinataire_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (expediteur_id)   REFERENCES utilisateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_notif_destinataire ON notifications(destinataire_id, est_lue, created_at DESC);


-- ============================================================
-- 14. SIGNALEMENTS
--     Signalement de contenu ou d'utilisateur inapproprié
-- ============================================================
CREATE TABLE signalements (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rapporteur_id   INT UNSIGNED NOT NULL,
    cible_type      ENUM('publication','commentaire','utilisateur','groupe','message') NOT NULL,
    cible_id        INT UNSIGNED NOT NULL,
    motif           ENUM(
                        'spam',
                        'harcelement',
                        'contenu_inapproprie',
                        'faux_compte',
                        'violence',
                        'autre'
                    ) NOT NULL,
    description     TEXT DEFAULT NULL,
    statut          ENUM('en_attente','traite','rejete') DEFAULT 'en_attente',
    traite_par      INT UNSIGNED DEFAULT NULL,        -- admin qui a traité
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rapporteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (traite_par)    REFERENCES utilisateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- ============================================================
-- 15. SESSIONS
--     Sessions actives (optionnel si utilisation de PHP sessions)
--     Utile pour "déconnecter tous les appareils"
-- ============================================================
CREATE TABLE sessions (
    id              VARCHAR(128) PRIMARY KEY,         -- session_id PHP
    utilisateur_id  INT UNSIGNED NOT NULL,
    ip_address      VARCHAR(45) DEFAULT NULL,
    user_agent      VARCHAR(500) DEFAULT NULL,
    payload         TEXT DEFAULT NULL,
    derniere_activite TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_sessions_user ON sessions(utilisateur_id);


-- ============================================================
-- 16. HASHTAGS
--     Tags sur les publications
-- ============================================================
CREATE TABLE hashtags (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom             VARCHAR(100) NOT NULL UNIQUE,     -- sans le # (ex: "examens")
    nb_utilisations INT UNSIGNED DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE publication_hashtag (
    publication_id  INT UNSIGNED NOT NULL,
    hashtag_id      INT UNSIGNED NOT NULL,
    PRIMARY KEY (publication_id, hashtag_id),
    FOREIGN KEY (publication_id) REFERENCES publications(id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id)     REFERENCES hashtags(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 17. MENTIONS
--     Mention d'un utilisateur dans un post/commentaire
-- ============================================================
CREATE TABLE mentions (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mentionné_id    INT UNSIGNED NOT NULL,
    cible_type      ENUM('publication','commentaire','message_groupe') NOT NULL,
    cible_id        INT UNSIGNED NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mentionné_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- DONNÉES DE TEST (optionnel — à supprimer en production)
-- ============================================================

-- Utilisateur de test : admin Douala
INSERT INTO utilisateurs
    (ville_id, nom, prenom, email, mot_de_passe, filiere, niveau, est_actif, est_verifie)
VALUES
    (1, 'Admin', 'Keyce KIAI', 'admin@keyce.cm',
     '$2y$10$PLACEHOLDER_HASH_A_REMPLACER',   -- générer avec password_hash() en PHP
     'Informatique', 'L3', 1, 1);

-- Groupe de test : Étudiants Douala
INSERT INTO groupes (createur_id, nom, description, type, ville_id)
VALUES (1, 'Étudiants Keyce KIAI Douala', 'Groupe officiel des étudiants de Douala', 'public', 1);

INSERT INTO membres_groupe (groupe_id, utilisateur_id, role, statut)
VALUES (1, 1, 'admin', 'accepte');


-- ============================================================
-- VUES UTILES (optionnel — facilitent les requêtes PHP)
-- ============================================================

-- Vue : fil d'actualité d'un utilisateur (ses posts + posts de ses amis)
CREATE VIEW vue_fil_actualite AS
SELECT
    p.id,
    p.auteur_id,
    CONCAT(u.prenom, ' ', u.nom) AS auteur_nom,
    u.photo_profil               AS auteur_photo,
    v.nom                        AS auteur_ville,
    p.contenu,
    p.type_media,
    p.media_url,
    p.visibilite,
    p.nb_likes,
    p.nb_commentaires,
    p.nb_partages,
    p.groupe_id,
    p.created_at
FROM publications p
JOIN utilisateurs u ON u.id = p.auteur_id
JOIN villes v       ON v.id = u.ville_id
WHERE p.est_supprime = 0
ORDER BY p.created_at DESC;

-- Vue : liste des conversations avec info du dernier message
CREATE VIEW vue_conversations AS
SELECT
    c.id                          AS conversation_id,
    c.utilisateur1_id,
    c.utilisateur2_id,
    CONCAT(u1.prenom, ' ', u1.nom) AS nom_user1,
    CONCAT(u2.prenom, ' ', u2.nom) AS nom_user2,
    u1.photo_profil               AS photo_user1,
    u2.photo_profil               AS photo_user2,
    mp.contenu                    AS dernier_message,
    mp.created_at                 AS date_dernier_message,
    mp.est_lu,
    c.updated_at
FROM conversations c
JOIN utilisateurs u1 ON u1.id = c.utilisateur1_id
JOIN utilisateurs u2 ON u2.id = c.utilisateur2_id
LEFT JOIN messages_prives mp ON mp.id = c.dernier_message_id;

-- Vue : membres d'un groupe avec leurs infos
CREATE VIEW vue_membres_groupe AS
SELECT
    mg.groupe_id,
    mg.utilisateur_id,
    CONCAT(u.prenom, ' ', u.nom) AS nom_complet,
    u.photo_profil,
    v.nom                        AS ville,
    u.filiere,
    mg.role,
    mg.statut,
    mg.joined_at
FROM membres_groupe mg
JOIN utilisateurs u ON u.id = mg.utilisateur_id
JOIN villes v       ON v.id = u.ville_id;