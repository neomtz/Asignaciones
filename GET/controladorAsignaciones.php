<?php
session_start();
include '../clases/Asignaciones.php';
$arts = new Asignaciones($token);
ini_set('display_errors',0);

if($_GET['source2'] == 'geti')
{
// $status = $_POST['source'];
 if(!empty($_GET['source3']))
   $status = $_GET['source3'];
//echo '***';
	$server = $arts->getItems($status,$_POST['source1']);
}
if($_GET['source2'] == 'getasignmes')
{
  if(!empty($_GET['source3']))
    $status = $_GET['source3'];
    $idSucursal = $_POST['source4'];
  if(!isset($_POST['source4']) || $_POST['source4'] == '*')
    $idSucursal = "";
	$server = $arts->getItemsxMes($status,$_POST['source1'],$_POST['source2'],$_POST['source3'],$idSucursal);
}
if($_GET['source2'] == 'getasign')
{
 $server = $arts->getItem($_POST['source1']);
 if(count($server) > 0)
  $server['status'] = 'ok';
 else
 $server['status'] = 'error';

}
if($_GET['source2'] == 'getu')
{
	$server = $arts->getUsuarios();
}
if($_GET['source2'] == 'getfiltro')
{
        $server = $arts->getItemsFiltro($_POST['source1'],$_POST['source2'],$_POST['source3']);
}
if($_GET['source2'] == 'getbrand')
{
  $server['brand'] = $arts->flexibleSingleBind('SELECT barra FROM jb_logos',0,0,0,0,'',0,$token);
  $server['nombreEmpresa'] = $arts->flexibleSingleBind('SELECT nombre FROM jb_company WHERE APItoken = ?',$token,0,0,0,'s',1,'');
  if($token == "")
  {
    $server['brand'] = "";
    $server['nombreEmpresa'] ="";
  }
  $server['correoUsuario'] = $_SESSION["email_usuario"];
  $server['nombresUsuario'] = $_SESSION["nombres_usuario"];
  $server['idUsuario'] = $_SESSION["id_usuario"];
}
