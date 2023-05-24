<?php
ini_set('display_errors',0);///agregado
include '../clases/Asignaciones.php';
$art = new Asignaciones($token);

if($_GET['source2'] == 'setasign')
{
  $idi = uniqid();
  $json = '[{"contenido":"Sin contenido precargado","columna":"0","etiqueta":"Info","tipo":"0"}]';
  if(isset($_POST['sourcejson']))
   $json = $_POST['sourcejson'];
   if($token == '897ab3ffb25c354d97a9ea172e5a5decf2436ea4d8db7e3cc50f7cc6de758a12fab4b465')
   include 'modificadoresMetalsa.com.php';
  if(empty($_POST['source5']))
   $fecha = date("Y-m-d H:i:s");
   else
   $fecha=$_POST["source5"];
   if(empty($_POST['source55']) || !isset($_POST['source55']))
    $fechaf = $fecha;
    else
    $fechaf=$_POST["source55"];
    $horai= new DateTime($_POST['source8']);
    $horai = $horai->format('Y-m-d H:i:s');
    $horaf= new DateTime($_POST['source9']);
    $horaf = $horaf->format('Y-m-d H:i:s');
   if( $art->setItem($json,$idi,$_POST['source0'],$fecha) && $art->setItemAsignado($idi,$_POST['source1'],$_POST['source2'],$_POST['source3'],$_POST['source4'],$fechaf,$_POST['source6'],$_POST['source7'],$horai,$horaf) )
   {
    $server['status'] = 'ok';
    $server['id'] = $idi;
    $server['fecha'] = $fecha;
    $art->conexion->commit();
   }
   else
   {
    $server['status'] = 'error';
    $server['log'] = $art->conexion->error;
    $art->conexion->rollback();
   }
 if($_GET['source3'] == 'relacion')
 {
    $url = 'https://www.jarboss.com/Administrar/POST/controladorUsuario.php?source2=setrelation';
    $postData = 'source1='.$_POST['source8'].'&token='.$token.'&source='.$_POST['source1'];
    $handler = curl_init();
    curl_setopt($handler, CURLOPT_URL, $url);
    curl_setopt($handler, CURLOPT_POST,true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($handler, CURLOPT_POSTFIELDS, $postData);
    $response = curl_exec ($handler);
    curl_close($handler);
 }
 if($_GET['source4'] == 'push')
 {
    $url = 'https://www.jarboss.com/API/POST/controladorPush.php?source2=usuario';
    $postData = 'source='.$token.'&source1='.$_POST['source4'].'&source2=Mantenimientos&source3=3&source4=Código: '.$_POST['source0'];
    $handler = curl_init();
    curl_setopt($handler, CURLOPT_URL, $url);
    curl_setopt($handler, CURLOPT_POST,true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($handler, CURLOPT_POSTFIELDS, $postData);
    $response = curl_exec ($handler);
    curl_close($handler);
 }
}
if($_GET['source2'] == 'updia')
{
 $json = '{';
 $fin = $_GET['source3'];
 $stop = $_GET['source3'] + 1;
 for($x = 0; $x < $stop ; $x++)
 {
  $json .= '"'.col.$x.'":"'.$_POST["source$x"].'"';
   if($x < $fin)
    $json .= ',';
 }
 $json .= '}';
  if($art->updItem($json,$_POST['source0']) && $art->delItemsAsignados($_POST['source0']) && $art->setItemAsignado($_POST['source0'],$_POST['source5'],2))
  {
   $server['status'] = 'ok';
   $server['json'] = $json;
   $art->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $art->conexion->rollback();
  }
}
if($_GET['source2'] == 'updir')
{
 $json = '{';
 $fin = $_GET['source3'];
 $stop = $_GET['source3'] + 1;
 for($x = 1; $x < $stop ; $x++)
 {
  $json .= '"'.col.$x.'":"'.$_POST["source$x"].'"';
   if($x < $fin)
    $json .= ',';
 }
 $json .= '}';
  if($art->updItem($json,$_POST['source0']) && $art->delItemsAsignados($_POST['source0']) && $art->setItemAsignado($_POST['source0'],$_POST['source5'],3))
  {
   $server['status'] = 'ok';
   $server['json'] = $json;
   $art->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $art->conexion->rollback();
  }
}
if($_GET['source2'] == 'updi')
{
 $json = '{';
 $fin = $_GET['source3'];
 $stop = $_GET['source3'] + 1;
 for($x = 1; $x < $stop ; $x++)
 {
  $json .= '"'.col.$x.'":"'.$_POST["source$x"].'"';
   if($x < $fin)
    $json .= ',';
 }
 $json .= '}';
  if($art->updItem($json,$_POST['source0']))
  {
   $server['status'] = 'ok';
   $server['json'] = $json;
   $art->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $art->conexion->rollback();
  }
}
if($_GET['source2'] == 'updstatus')
{
  if($art->updItemAsignadoStatus($_POST['source1'],$_POST['source2'],$_POST['source3']))
  {
   $server['status'] = 'ok';
   $server['log'] = $idAsign;
   $art->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $art->conexion->rollback();
  }
}
if($_GET['source2'] == 'updreporteid')
{
  if($art->updReporteId($_POST['source1'],$_POST['source2']))
  {
   $server['status'] = 'ok';
   $server['log'] = $_POST['source1'];
   $art->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $art->conexion->rollback();
  }
}
if($_GET['source2'] == 'updasign')
{
  if($art->updItemAsignado($_POST['source0'],$_POST['source1'],$_POST['source2'],$_POST['source3'],$_POST['source4'],$_POST['source5'],$_POST['source6']))
  {
   $server['status'] = 'ok';
   $art->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $server['log'] = $art->conexion->error;
   $art->conexion->rollback();
  }
}
if($_GET['source2'] == 'delasign')
{
 $idUsuario = $_POST['source2'];
 $not = '';
 if(empty($idUsuario))
  $not = 'NOT';
 $idAsign = $art->flexibleSingleBind('SELECT e.id FROM jb_asign_elementos e INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = e.id WHERE '.$not.' a.id_usuario = ? AND (e.id = ? OR e.id_aux = ?) LIMIT 1',$idUsuario,$_POST['source1'],$_POST['source1'],0,'iss',3,$token);
  if($art->delItemAsignado($idAsign) && $art->delItem($idAsign))
  {
   $server['status'] = 'ok';
   $server['log'] = $idAsign;
   $art->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $art->conexion->rollback();
  }
}
if($_GET['source2'] == 'delasignid')
{
 $idAsign = $_POST['source1'];
  if($art->delItemAsignado($idAsign) && $art->delItem($idAsign))
  {
   $server['status'] = 'ok';
   $server['log'] = $idAsign;
   $art->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $art->conexion->rollback();
  }
}
