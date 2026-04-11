-- ============================================================
--  KEYCE KIAI — TABLE MEMBRES DU GROUPE
--  Script de création de la table membres_du_groupe
--  Base de données : KeyceKIAI
-- ============================================================

-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS KeyceKIAI
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE KeyceKIAI;

-- ============================================================
--  TABLE : membres_du_groupe
--  Stocke les informations des membres enregistrés
-- ============================================================
CREATE TABLE IF NOT EXISTS membres_du_groupe (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(100) NOT NULL,
    prenom        VARCHAR(100) NOT NULL,
    telephone     VARCHAR(20)  NOT NULL,
    date_creation TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
