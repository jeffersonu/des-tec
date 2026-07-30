<?php
/*
  ============================================================
  ARCHIVO    : php/config.php
  DESCRIPCIÓN: Configuración de conexión a la base de datos.
               Este archivo se incluye en todos los scripts PHP.

  INSTRUCCIONES:
  1. Crea una base de datos MySQL en tu hosting (cPanel, etc.)
  2. Rellena los 4 datos de conexión abajo con los que
     te dé tu proveedor de hosting.
  3. Importa el archivo php/crear_tabla.sql en phpMyAdmin
     para crear la tabla de contactos.
  4. NUNCA subas este archivo a GitHub con tus datos reales.
     Agrégalo a .gitignore
  ============================================================
*/

/* ----------------------------------------------------------
  DATOS DE CONEXIÓN
  Cambiar estos valores según tu hosting:
  - DB_HOST    → casi siempre es "localhost"
  - DB_NOMBRE  → nombre de la base de datos que creaste
  - DB_USUARIO → usuario de la base de datos
  - DB_CLAVE   → contraseña del usuario
---------------------------------------------------------- */
define('DB_HOST',    'localhost');
define('DB_NOMBRE',  'tu_base_de_datos');
define('DB_USUARIO', 'tu_usuario');
define('DB_CLAVE',   'tu_contraseña');

/* ----------------------------------------------------------
  CORREO DONDE RECIBIRÁS LAS NOTIFICACIONES
  Cada vez que alguien llene el formulario, te llegará
  un correo a esta dirección.
---------------------------------------------------------- */
define('CORREO_DESTINO', 'jeffersonurbina20@gmail.com');
define('NOMBRE_SITIO',   'Remodelaciones & Acabados');

/* ----------------------------------------------------------
  FUNCIÓN: CONECTAR A LA BASE DE DATOS
  Retorna un objeto PDO listo para usar.
  Se llama desde guardar_contacto.php
---------------------------------------------------------- */
function conectarDB() {
    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NOMBRE . ';charset=utf8';
        $pdo = new PDO($dsn, DB_USUARIO, DB_CLAVE, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // En producción no mostrar el error real (seguridad)
        http_response_code(500);
        echo json_encode(['exito' => false, 'mensaje' => 'Error de conexión con la base de datos.']);
        exit;
    }
}
