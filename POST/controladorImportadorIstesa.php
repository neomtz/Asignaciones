<?php
ini_set("display_errors",0);
include '../vendor/Importador/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

include '../clases/Asignaciones.php';
$arts = new Asignaciones($token);
if ($_FILES["select_excel"]["name"] == '') {
}
if($_FILES["select_excel"]["name"] != '')
{
 $allowed_extension = array('xls', 'xlsx');
 $file_array = explode(".", $_FILES['select_excel']['name']);
 $file_extension = end($file_array);

 if(in_array($file_extension, $allowed_extension))
 {
  $reader = IOFactory::createReader('Xlsx');
  $spreadsheet = $reader->load($_FILES['select_excel']['tmp_name']);
  $data = $spreadsheet->getActiveSheet()->toArray();

  $contador = 0;
  foreach ($data as $row) {

    if ($contador>0 && !empty(trim($row[1]))) {
      $idgrupo=$arts->flexibleSingleBind('SELECT id FROM jb_grupos WHERE nombre like ?',$row[2],0,0,0,'s',1,$token);
      $idcorreo=$arts->flexibleSingleBind('SELECT ID_EMPLEADO FROM jb_empleado WHERE EMAIL like ?',$row[1],0,0,0,'s',1,$token);
      $idCheck=$arts->flexibleSingleBind('SELECT id FROM jb_dinamic_section WHERE nombre like ? AND id_empresa ="5524d13ceb13d"',$row[3],0,0,0,'s',1,'');
       $fechai=date("Y-m-d H:")."00:00";
       $fecha= new DateTime($row[5]);
      $date = $fecha->format('Y-m-d H:i:s');
      $fechafin= new DateTime($row[4]);
     $datef = $fechafin->format('Y-m-d H:i:s');
     $horaInicio = $row[6];
     $horaFin = $row[7];
     $f='';
     $sucursalId='';
     $json='[{"contenido":"'.$row[2].'","columna":"621d52938e833","etiqueta":"Grupo","tipo":"0"},{"contenido":"'.$row[1].'","columna":"621d529396c9c","etiqueta":"Usuario","tipo":"0"},{"contenido":"'.$datef.'","columna":"621d52939aea1","etiqueta":"Fecha inicio","tipo":"0"},{"contenido":"'.$date.'","columna":"62bb8863db169","etiqueta":"Fecha fin","tipo":"0"}]';
      $datos = 'source0='.$f.'&source1='.$idCheck.'&source2='.$idgrupo.'&source3='.$sucursalId.'&source4='.$idcorreo.'&source5='.$datef.'&source55='.$date.'&source6=&source7=4&source=cdf54bf468019e22f18045df2c19e27168ec8a82c03a83006f23147cbc3df412e8701a8e&sourcejson='.$json.'&source8='.$horaInicio.'&source9='.$horaFin;
      $url = "http://localhost/Istesa_asignaciones/POST/?source=asign&source2=setasign";
      $postData = $datos;
      $handler = curl_init();
      curl_setopt($handler, CURLOPT_URL, $url);
      curl_setopt($handler, CURLOPT_POST,true);
      curl_setopt($handler, CURLOPT_POSTFIELDS, $postData);
      curl_setopt($handler, CURLOPT_RETURNTRANSFER, true);
      $response = curl_exec($handler);
      curl_close($handler);
      $asignacion = json_decode($response);
      $server[]=$asignacion->id;

    }
    $contador++;
  }
 }
}
?>
