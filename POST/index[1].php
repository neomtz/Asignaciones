<?php
session_start();
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
ini_set('display_errors',0);
//error_reporting(E_ALL);
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
 if($_GET['source'] == 'ws')
 {
  include 'controladorWebService.php';
 }
 if($_GET['source1'] == 'importador')
  include 'controladorImportador.php';
if($_GET['source1'] == 'importadorinternos')
 include 'controladorImportadorInternos.php';

 if($_GET['source'] == 'ticket')
 {
  include 'controladorIncumplimientos.php';
 }
}
else
{
  $server['status'] = 'API token error';
  if($_GET['source1'] == 'upload')
   include 'controladorUpload.php';
}

if($_POST['serverResponse'] != 'false')
echo json_encode($server);
