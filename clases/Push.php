<?php
class Push extends Conexion
{
   var $token;
 function __construct($token)
 {
     $this->token = $token;
 }
 function getDevicesUsuario($id,$app,$tipo)
 {
 $mysqli = $this->fullConnect($this->token);
 $listado = array();
 $query = 'select DISTINCT(id_divice) FROM jb_push_notifications WHERE id_usuario = ? AND type_app = ? AND tipo = ?';
  if ($stmt = $mysqli->prepare($query))
  {
   $stmt->bind_param("iii", $id,$app,$tipo);
    if ($stmt->execute())
     $stmt->bind_result($col1);
      while ($stmt->fetch())
      {
        $listado[] = $col1;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }
 function sendAndroidPush($collapseKey, $contenido, $username, $gcmId,$app)
 {
   if($app == 0)
   {
    $apiKey = '';
    $subtitulo = 'app';
   }
   if($app == 1)
   {
    $apiKey = '';
    $subtitulo = 'Usuario';
   }
   if($app == 3)
   {
    $apiKey = '';
    $subtitulo = 'Asignaciones';
   }
  $msg = array('body' => substr(strip_tags($contenido),0,100),'title' => $username,'icon' => 'myicon','sound' => 'mySound');
//  $data = array('id' => $id, 'likes' => $articulo['agrada'], 'coments' => $articulo['totalComent']);
  $fields = array('registration_ids' => $gcmId,'data' => $data,'notification' => $msg);
  $headers = array('Authorization: key='.$apiKey,'Content-Type: application/json');
  $handler = curl_init();
  curl_setopt($handler,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
  curl_setopt($handler, CURLOPT_POST,true);
  curl_setopt($handler, CURLOPT_POSTFIELDS, json_encode($fields));
  curl_setopt($handler, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($handler, CURLOPT_HTTPHEADER, $headers);
  $response = curl_exec ($handler);
  $http_respond = trim( strip_tags( $response ) );
  $http_code = curl_getinfo( $handler, CURLINFO_HTTP_CODE );
  curl_close($handler);
   return "ok";
 }
 function sendIosPush($bag,$notification,$devices,$production,$app)
 {
        $results = array();
  if ($production)
    $gateway = 'ssl://gateway.push.apple.com:2195';
  else
    $gateway = 'ssl://gateway.sandbox.push.apple.com:2195';
   if($app == 0)
     $cert = 'JAAP_production.pem';
   if($app == 1)
     $cert = 'JACH_apn_production_2017_2018.pem';
   if($app == 3)
     $cert = 'JAWK_production_n.pem';
    $streamContext = stream_context_create();
   stream_context_set_option($streamContext, 'ssl', 'local_cert','../../Certificados/'.$cert);
   $apns = stream_socket_client($gateway,$error,$errorString,60,STREAM_CLIENT_CONNECT, $streamContext);
        $body['aps'] = array(
            'badge' => 0,
            'body' => 'Nuevo artículo',
            'alert' => substr(strip_tags($notification),0,100),
            'sound' => 'default'
        );
        $payload = json_encode($body);
        foreach ($devices as $device)
        {
            $msg = chr(0) . pack('n', 32) . pack('H*', $device) . pack('n', strlen($payload)) . $payload;
            $results[] = fwrite($apns, $msg, strlen($msg));
        }
        fclose($apns);
        if (empty($results))
            return FALSE;
        else
            return $results;
        fclose($fp);
 }
}

?>
