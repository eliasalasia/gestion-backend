-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-07-2024 a las 16:16:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `incidencias_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `contenido` text NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `incidenciaId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id`, `contenido`, `userId`, `incidenciaId`, `createdAt`, `updatedAt`) VALUES
(1, 'Todavia estoy esperndo una respuesta', 2, 1, '2024-07-16 18:00:48', '2024-07-16 18:00:48'),
(2, 'Lo siento ya estoy llamando al tecnico', 7, 1, '2024-07-16 18:53:02', '2024-07-16 18:53:02'),
(3, 'Damos por finalizado el problema muchas gracias por reportar.', 7, 3, '2024-07-16 18:54:39', '2024-07-16 18:54:39'),
(4, 'Excelente Servicio muchas gracias', 6, 3, '2024-07-16 18:55:34', '2024-07-16 18:55:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id` int(11) NOT NULL,
  `incidenciaId` int(11) DEFAULT NULL,
  `rutaImagen` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes`
--

INSERT INTO `imagenes` (`id`, `incidenciaId`, `rutaImagen`, `createdAt`, `updatedAt`) VALUES
(4, 3, 'uploads\\1721147986644-EnzoF.jpeg', '2024-07-16 16:39:46', '2024-07-16 16:39:46'),
(5, 2, 'uploads\\1721148166299-EnzoF.jpeg', '2024-07-16 16:42:46', '2024-07-16 16:42:46'),
(10, 8, 'uploads\\1721415256752-lavamanos.jpeg', '2024-07-19 18:54:17', '2024-07-19 18:54:17'),
(12, 1, 'uploads\\1721512935901-Chicharito.jpeg', '2024-07-20 22:02:16', '2024-07-20 22:02:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidencias`
--

CREATE TABLE `incidencias` (
  `id` int(11) NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `estado` enum('pendiente','en proceso','resuelto') DEFAULT 'pendiente',
  `ubicacion` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `incidencias`
--

INSERT INTO `incidencias` (`id`, `asunto`, `descripcion`, `tipo`, `estado`, `ubicacion`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 'Problema con el servidor', 'No se puede acceder al servidor desde las 10:00 AM', 'Urgente', 'pendiente', 'Sala de servidores 2', 2, '2024-07-15 19:24:12', '2024-07-20 22:02:16'),
(2, 'Cerradura rota', 'no puedo cerrarlo, no esta girando', 'Urgente', 'en proceso', 'Primer piso habitacion 104 puerta principal', 4, '2024-07-15 21:26:42', '2024-07-19 20:22:20'),
(3, 'dpto. Humedad ', 'Tengo Humendad en la cocina se esta arruinando la pared.', 'Grave', 'pendiente', 'Primer piso habitacion 102 en la cocina.', 6, '2024-07-15 22:43:45', '2024-07-19 20:22:22'),
(8, 'Se rompio el lavamanos ', 'Se me rompio y se vino abajo el lavamanos tengo una inundacion en mi departamento.', 'urgente ', 'resuelto', 'dpto 102 Primer Piso ', 2, '2024-07-19 18:54:16', '2024-07-19 20:22:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `tipo` enum('residente','administrador') NOT NULL,
  `apartamento` varchar(255) DEFAULT NULL,
  `notificaciones` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`notificaciones`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `piso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `email`, `contraseña`, `tipo`, `apartamento`, `notificaciones`, `createdAt`, `updatedAt`, `piso`) VALUES
(2, 'Enzo Alasia', 'enzo_3@gmail.com', '$2a$12$Yy75rwg6WxziLNT.SJGz5u7nEVbFuSL4EmasEsNhe/4AIWQRMhISi', 'residente', '102', NULL, '2024-07-15 15:02:16', '2024-07-16 16:14:58', 1),
(3, 'Bruno Alasia', 'bruno_1@gmail.com', '$2a$12$pvQp6zOv5FXFClIk69dvWuD1dHZc1OX8Q9Rsxb2b23sA89tf7lmpC', 'residente', '103', NULL, '2024-07-15 15:02:35', '2024-07-16 16:14:58', 1),
(4, 'Jaime Palco', 'palquito_1@gmail.com', '$2a$12$OqE7HSetucSeSdUIOyVN6u5I9FySYNmV80kzKB0eOp70MrcteMTva', 'residente', '104', NULL, '2024-07-15 16:01:08', '2024-07-16 16:14:29', 1),
(6, 'Elias Alasia', 'Elias101@gmail.com', '$2a$12$OhWt.AJilK8B6c62A7FFROS8iOcRy3fTbiVltmNcXy9PGFM0PraiW', 'residente', '101', NULL, '2024-07-15 21:37:30', '2024-07-16 16:14:29', 1),
(7, 'Harold C', 'adminHar@gmail.com', '$2a$12$8nXhAavLHfI48jmWNw7WSu/tmrMQJic11z28wr6/1QvC.3af7vBoW', 'administrador', '100', NULL, '2024-07-15 21:38:53', '2024-07-16 16:14:29', 0),
(8, 'Diego Huarsaya', 'Dieguitogol@gmail.com', '$2a$12$pdVun0kIps19s3Edr.MiIuREpNCIFhuNB2Y2IAl2Wxa8JNKG235Y2', 'administrador', '99', NULL, '2024-07-15 21:39:22', '2024-07-16 16:14:29', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `incidenciaId` (`incidenciaId`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incidenciaId` (`incidenciaId`);

--
-- Indices de la tabla `incidencias`
--
ALTER TABLE `incidencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `incidencias`
--
ALTER TABLE `incidencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`incidenciaId`) REFERENCES `incidencias` (`id`);

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`incidenciaId`) REFERENCES `incidencias` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `incidencias`
--
ALTER TABLE `incidencias`
  ADD CONSTRAINT `incidencias_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
