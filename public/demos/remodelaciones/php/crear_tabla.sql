-- ============================================================
-- ARCHIVO    : php/crear_tabla.sql
-- DESCRIPCIÓN: Script para crear la tabla de contactos
--              en la base de datos MySQL.
--
-- INSTRUCCIONES:
-- 1. Abre phpMyAdmin en tu hosting
-- 2. Selecciona tu base de datos
-- 3. Ve a la pestaña "SQL"
-- 4. Copia y pega todo este contenido y ejecuta
-- ============================================================

CREATE TABLE IF NOT EXISTS contactos (
    id           INT          AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL,
    telefono     VARCHAR(20)  NOT NULL,
    servicio     VARCHAR(80)  NOT NULL,
    mensaje      TEXT,
    -- acepto_datos: 1 = el usuario aceptó la política de datos
    acepto_datos TINYINT(1)   NOT NULL DEFAULT 0,
    -- ip y fecha para trazabilidad (buena práctica legal)
    ip_origen    VARCHAR(45),
    fecha        DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
