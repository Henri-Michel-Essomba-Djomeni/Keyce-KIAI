-- ============================================================
--  KEYCE KIAI — TABLE LISTE DES MEMBRES
--  Script de création de la table liste_des_membres
--  Base de données : KeyceKIAI
-- ============================================================

-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS KeyceKIAI
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE KeyceKIAI;

-- ============================================================
--  TABLE : liste_des_membres
--  Stocke la liste de tous les membres enregistrés
-- ============================================================
CREATE TABLE IF NOT EXISTS liste_des_membres (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(100) NOT NULL,
    prenom        VARCHAR(100) NOT NULL,
    telephone     VARCHAR(20)  NOT NULL,
    date_creation TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;