<?php
/*
  ============================================================
  ARCHIVO    : php/guardar_contacto.php
  DESCRIPCIÓN: Recibe los datos del formulario de contacto,
               los valida, los guarda en la base de datos
               y envía un correo de notificación al dueño.

  CÓMO ACTIVARLO EN EL FRONTEND:
  En js/app.js, en el bloque del formulario de contacto,
  reemplaza el contenido del evento 'submit' por:

      e.preventDefault();
      const datos = new FormData(this);
      fetch('php/guardar_contacto.php', { method: 'POST', body: datos })
        .then(res => res.json())
        .then(data => {
          if (data.exito) {
            mostrarNotificacion('¡Mensaje enviado! Te contactaremos pronto.');
            this.reset();
          } else {
            mostrarNotificacion('Error: ' + data.mensaje);
          }
        })
        .catch(() => mostrarNotificacion('Error de red. Intenta de nuevo.'));

  FLUJO:
  1. Recibe los campos POST del formulario
  2. Valida y limpia los datos (previene inyección SQL y XSS)
  3. Verifica que el usuario aceptó la política de datos
  4. Guarda el registro en la tabla `contactos`
  5. Envía correo de aviso al dueño del sitio
  6. Retorna JSON { exito: true/false, mensaje: "..." }
  ============================================================
*/

/* Solo aceptar peticiones POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.']);
    exit;
}

/* Incluir configuración y conexión */
require_once 'config.php';

/* ----------------------------------------------------------
  1. RECIBIR Y LIMPIAR DATOS
  filter_input limpia los datos y previene inyecciones.
---------------------------------------------------------- */
$nombre   = trim(filter_input(INPUT_POST, 'name',      FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$email    = trim(filter_input(INPUT_POST, 'email',     FILTER_SANITIZE_EMAIL) ?? '');
$telefono = trim(filter_input(INPUT_POST, 'phone',     FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$servicio = trim(filter_input(INPUT_POST, 'servicio',  FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
$mensaje  = trim(filter_input(INPUT_POST, 'message',   FILTER_SANITIZE_SPECIAL_CHARS) ?? '');
// El checkbox de política de datos (1 si fue marcado, 0 si no)
$acepto   = isset($_POST['acepto_politica']) ? 1 : 0;

/* ----------------------------------------------------------
  2. VALIDACIONES
  Si algún campo obligatorio falla, retornamos error
  sin guardar nada en la base de datos.
---------------------------------------------------------- */
$errores = [];

if (empty($nombre) || strlen($nombre) < 2) {
    $errores[] = 'El nombre es obligatorio.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = 'El correo electrónico no es válido.';
}

if (empty($telefono) || strlen($telefono) < 7) {
    $errores[] = 'El teléfono es obligatorio.';
}

if (empty($servicio)) {
    $errores[] = 'Selecciona un servicio de interés.';
}

/* OBLIGATORIO: el usuario debe aceptar la política de datos */
if ($acepto !== 1) {
    $errores[] = 'Debes aceptar la política de tratamiento de datos personales.';
}

/* Si hay errores, retornar sin guardar */
if (!empty($errores)) {
    echo json_encode([
        'exito'   => false,
        'mensaje' => implode(' | ', $errores),
    ]);
    exit;
}

/* ----------------------------------------------------------
  3. GUARDAR EN LA BASE DE DATOS
  Usamos prepared statements para prevenir inyección SQL.
---------------------------------------------------------- */
$pdo = conectarDB();

$sql = "INSERT INTO contactos
        (nombre, email, telefono, servicio, mensaje, acepto_datos, ip_origen)
        VALUES
        (:nombre, :email, :telefono, :servicio, :mensaje, :acepto, :ip)";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':nombre'   => $nombre,
    ':email'    => $email,
    ':telefono' => $telefono,
    ':servicio' => $servicio,
    ':mensaje'  => $mensaje,
    ':acepto'   => $acepto,
    ':ip'       => $_SERVER['REMOTE_ADDR'] ?? 'desconocida',
]);

/* ----------------------------------------------------------
  4. ENVIAR CORREO DE NOTIFICACIÓN AL DUEÑO
  Se envía un correo simple a CORREO_DESTINO (definido en config.php)
  para avisar que alguien llenó el formulario.
  Requiere que el servidor de hosting tenga la función mail() habilitada.
---------------------------------------------------------- */
$asunto  = '[' . NOMBRE_SITIO . '] Nuevo contacto: ' . $nombre;
$cuerpo  = "Nuevo mensaje desde tu página web:\n\n";
$cuerpo .= "Nombre   : {$nombre}\n";
$cuerpo .= "Email    : {$email}\n";
$cuerpo .= "Teléfono : {$telefono}\n";
$cuerpo .= "Servicio : {$servicio}\n";
$cuerpo .= "Mensaje  : {$mensaje}\n\n";
$cuerpo .= "Fecha    : " . date('d/m/Y H:i') . "\n";

$cabeceras = "From: no-reply@remodelacionesbogota.com\r\n";
$cabeceras .= "Reply-To: {$email}\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail(CORREO_DESTINO, $asunto, $cuerpo, $cabeceras);

/* ----------------------------------------------------------
  5. RESPUESTA EXITOSA
---------------------------------------------------------- */
echo json_encode([
    'exito'   => true,
    'mensaje' => '¡Mensaje recibido! Te contactaremos pronto.',
]);
