-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 03 déc. 2023 à 21:36
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `erp_aero`
--

-- --------------------------------------------------------

--
-- Structure de la table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `extension` varchar(255) NOT NULL,
  `mimeType` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `uploadDate` datetime NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `files`
--

INSERT INTO `files` (`id`, `name`, `filename`, `extension`, `mimeType`, `size`, `uploadDate`, `path`, `createdAt`, `updatedAt`) VALUES
(1, 'traducao final[1].pdf', '1701635165977.pdf', '.pdf', 'application/pdf', 19224, '2023-12-03 20:26:06', NULL, '2023-12-03 20:26:06', '2023-12-03 20:26:06'),
(2, 'rapport GPT.docx', '1701635266976.docx', '.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 28925, '2023-12-03 20:27:46', NULL, '2023-12-03 20:27:46', '2023-12-03 20:27:46');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `emailOrPhone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `refreshToken` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `emailOrPhone`, `password`, `refreshToken`, `createdAt`, `updatedAt`) VALUES
(1, 'amady@gmail.com', '$2a$10$6cco8U7kDl8bL504oIiNZOHkPPuqcyLNOAg1ctN2IhYmtVF1MGvnW', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwMTYzNDcwOCwiZXhwIjoxNzA0MjI2NzA4fQ.UOBm5azs94apAGY0J2iBQbJCEVY-9t2o4RpeylwXxEM', '2023-12-03 20:16:11', '2023-12-03 20:18:28'),
(2, '+79169818826', '$2a$10$kIKRuMEjhMqU1VPwXjsmLe4jr4CkDfGvng.FJrm3W.kKGGGxdrOna', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDE2MzQ1OTksImV4cCI6MTcwNDIyNjU5OX0.JDGzD-HzsMfLDSeXZxr-DRzwrvDJ9avcqox6pAS1p4I', '2023-12-03 20:16:39', '2023-12-03 20:16:39');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `emailOrPhone` (`emailOrPhone`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
