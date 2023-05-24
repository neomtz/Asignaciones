<?php
session_start();
date_default_timezone_set('America/Mexico_City');
include '../clases/Asignaciones.php';
$token = 'cdf54bf468019e22f18045df2c19e27168ec8a82c03a83006f23147cbc3df412e8701a8e';
$arts = new Asignaciones($token);
ini_set('display_errors',0);
$fecha = date("Y-m-d");
$incumplimientos = $arts->getAsignaciones($fecha);
// print_r($incumplimientos);
$horaA = new DateTime(); // Fecha y hora actual
// $hora = $horaA->format('Y-m-d H:i:s');
$titulo = "Alerta de incumplimiento";
$body='Buen día<br><br>';
$body .='<p>Sirva este correo para informarle que ya pasaron 10 minutos y aun no iniciado la asignación</p><br>';
foreach ($incumplimientos as $b) {
  if ($b['col4'] == 4) {
    // $horasI = explode(" ", $b['col2']);
    $horaInicial = new DateTime($b['col2']);
    $transcurridos = $horaA->diff($horaInicial);
    // Obtener el número de minutos transcurridos
    $minutos = $transcurridos->days * 24 * 60;
    $minutos += $transcurridos->h * 60;
    $minutos += $transcurridos->i;
    if ($minutos > 10) {
      $url = 'https://www.jarboss.com/Notificaciones/POST/?source1=notificacion&source2=mail';
        $postData = 'source1=neomtz2951@gmail.com&source2='.$body.'&source3='.$titulo.'&source4=Istesa.com.mx';
        $handler = curl_init();
        $ch = curl_init();
        curl_setopt($handler, CURLOPT_URL, $url);
        curl_setopt($handler, CURLOPT_POST,true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($handler, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($handler, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec ($handler);
        $http_code = curl_getinfo( $handler, CURLINFO_HTTP_CODE );
        curl_close($handler);
      print_r($response);
    }else {
      echo "No pasado de verga";
    }
  }
}
// source1 : correo
// source2 : cuerpo del correo
// source3 : titulo del correo
// source4 : empresa
 ?>
