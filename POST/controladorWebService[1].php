<?php
include '../clases/Asignaciones.php';
$arts = new Asignaciones($token);
ini_set('display_errors',1);
if($token == '71f7c02c586ddd8986d778ed3f7167d95269746c478152cf4ad04880d97e29435e0163d1')
{
$idLog = uniqid();
require_once('../../backend/SOAPlib/nusoap.php');
$client = new nusoap_client('https://apps.madisa.com/WSJarbossCABLES/WSJarbossCABLES.asmx?wsdl', 'wsdl');
$param=array(); //parametros de la llamada
$param['soapAction']="http://tempuri.org/SelContratosActivosCables";
$result = $client->call('SelContratosActivosCables', array('parameters' => $param), '', '', false, true);
 // Check for a fault
$response = false;
if ($client->fault) 
{ 
        //print_r($result);
} 
else 
{
        $err = $client->getError();
        if ($err) 
	{
                // Display the error  
                $result =$err;
        } 
	else 
	{
                // Display the result 
         $response = true;
        }
}
if($response)
{
 $cables = json_encode($result);
 $cables = str_replace('{"SelContratosActivosCablesResult":{"Contrato":','',$cables);
 $cables = str_replace('}}','',$cables);

         $file = fopen('./logsWs/'.$idLog.'.txt', 'w');
         fwrite($file, $cables . PHP_EOL);
         fclose($file);


 $cables = json_decode($cables); 
 //print_r($cables);
 foreach($cables as $cb)
 {
   $email = trim($cb->Asignadoa);
  $cb->idEquipo = trim($cb->idEquipo);
 if(strpos($email,',') === false)
 {
  $cb->idEquipo = trim($cb->idEquipo);
//   $idAsign = $arts->flexibleSingleBind('SELECT COUNT(id) FROM jb_asign_elementos WHERE id_aux like ?',$cb->idContrato.'-'.$cb->idEquipo,0,0,0,'s',1,$token);
  if(!empty($email))
  {
	$email = trim($email);
   $idu = $arts->flexibleSingleBind('SELECT id_empleado FROM jb_empleado_login WHERE usuario like ?',$email,0,0,0,'s',1,$token);
   if(!empty($idu))
   {
    $contenido = '[{"contenido":"'.$cb->idContrato.'","columna":"57435f838f13f","etiqueta":"No. de contrato","tipo":"0"},{"contenido":"'.$cb->idEquipo.'","columna":"57435f8390648","etiqueta":"Kits asignados","tipo":"0"},{"contenido":"'.$cb->idEquipo.'","columna":"573a59ec60b65","etiqueta":"IDs","tipo":"3"}] ';
    $id = uniqid();
    $fecha = date("Y-m-d H:i:s");
    if($arts->flexibleSingleBind('SELECT count(id) FROM jb_asign_elementos WHERE id_aux = ?',$cb->idEquipo,0,0,0,'s',1,$token) == 0)
    {
     if($arts->setItemWs($id,$fecha,$cb->idEquipo,$contenido) && $arts->setItemAsignado($id,'573a5758be6b9',337,'',$idu,$fecha,$coordenadas,4))
     {
      $server['status'] = 'ok';
      $arts->conexion->commit();
     }
     else
     {
      $server['status'] = 'error';
      $arts->conexion->rollback();
     }
    }
   }
  }//empty mail
 }//solo un correo
 else
 {
  $correos = explode(',',$email);
//  $server['log'][] = $correos;
  foreach($correos as $email)
  {
  if(!empty($email))
  {
   $email = trim($email);
   $idu = $arts->flexibleSingleBind('SELECT id_empleado FROM jb_empleado_login WHERE usuario like ?',$email,0,0,0,'s',1,$token);
   if(!empty($idu))
   {
    $contenido = '[{"contenido":"'.$cb->idContrato.'","columna":"57435f838f13f","etiqueta":"No. de contrato","tipo":"0"},{"contenido":"'.$cb->idEquipo.'","columna":"57435f8390648","etiqueta":"Kits asignados","tipo":"0"},{"contenido":"'.$cb->idEquipo.'","columna":"573a59ec60b65","etiqueta":"IDs","tipo":"3"}] ';
    $id = uniqid();
    $fecha = date("Y-m-d H:i:s");
    if($arts->flexibleSingleBind('SELECT count(e.id) FROM jb_asign_elementos e INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = e.id WHERE e.id_aux = ? AND a.id_usuario = ?',$cb->idEquipo,$idu,0,0,'si',2,$token) == 0)
    {
     if($arts->setItemWs($id,$fecha,$cb->idEquipo,$contenido) && $arts->setItemAsignado($id,'573a5758be6b9',337,'',$idu,$fecha,$coordenadas,4))
     {
      $server['status'] = 'ok';
      $arts->conexion->commit();
     }
     else
     {
      $server['status'] = 'error';
      $arts->conexion->rollback();
     }
    }
   }
  }//empty mail
  }//each de correos
 }
 }

}
}//if
else
$server['status'] = 'na';
