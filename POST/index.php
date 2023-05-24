<?php
session_start();
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
ini_set('display_errors',0);
//error_reporting(E_ALL);
$server = array();
$token = 'cdf54bf468019e22f18045df2c19e27168ec8a82c03a83006f23147cbc3df412e8701a8e';
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
 if($_GET['source1'] == 'importadorIstesa')
 {
  include 'controladorImportadorIstesa.php';
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
