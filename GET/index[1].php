<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
ini_set('display_errors',0);
$server = array();
$token = $_POST['source'];
if(!empty($token))
{
 if($token == '031d4e943f78cba56dd84f1146422250e8c72448')
  $token = '';
 if($_GET['source'] == 'asign')
 {
	include 'controladorAsignaciones.php';
 }
 if($_GET['source1'] == 'ticket')
 {
	include 'controladorIncumplimiento.php';
 }
}
echo json_encode($server);
