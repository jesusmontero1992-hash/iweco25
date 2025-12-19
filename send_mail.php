<?php
/**
 * Script de envío de correo simplificado
 * - En hosting real: Envía el correo usando mail()
 * - En XAMPP (Local): Simula el envío para evitar errores de conexión
 */

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Sanitizar y validar los datos de entrada
    $nombre = strip_tags(trim($_POST["nombre"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $telefono = strip_tags(trim($_POST["telefono"]));
    $empresa = strip_tags(trim($_POST["empresa"]));
    $mensaje = strip_tags(trim($_POST["mensaje"]));

    // Validar campos obligatorios
    if (empty($nombre) || empty($mensaje) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Por favor complete el formulario correctamente.";
        exit;
    }

    // 2. Configuración del correo
    $recipient = "jesusmontero1992@gmail.com";
    $subject = "Nuevo contacto desde la web: $nombre";
    
    $email_content = "Has recibido un nuevo mensaje de contacto.\n\n";
    $email_content .= "Nombre: $nombre\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Teléfono: $telefono\n";
    $email_content .= "Empresa: $empresa\n\n";
    $email_content .= "Mensaje:\n$mensaje\n";

    // Cabeceras recomendadas para evitar SPAM y permitir respuesta directa
    $headers = "From: Web IWECOTECH <$recipient>\r\n";
    $headers .= "Reply-To: $nombre <$email>\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 3. DETECCIÓN DE XAMPP / LOCALHOST
    // Verificamos si la IP es local (127.0.0.1 o ::1)
    $is_local = in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']);

    if ($is_local) {
        // --- MODO SIMULACIÓN PARA XAMPP ---
        // Permitimos que el formulario se limpie y diga "Éxito" sin intentar conectar al exterior
        http_response_code(200);
        echo "OK"; 
    } else {
        // --- MODO SERVIDOR REAL ---
        if (mail($recipient, $subject, $email_content, $headers)) {
            http_response_code(200);
            echo "OK";
        } else {
            http_response_code(500);
            echo "Error al enviar el mensaje en el servidor.";
        }
    }

} else {
    http_response_code(403);
    echo "Acceso denegado.";
}
?>
