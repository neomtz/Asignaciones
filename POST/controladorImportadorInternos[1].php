<?php
/*ejemplo para continuar a pruebas de las asignaciones realizadas 5e1fa1db4e73e_12345671*/
ini_set("display_errors",0);
require_once '../../PHPExcel/Classes/PHPExcel.php';
require_once '../../Notificaciones/clases/Postmark.php';
require_once '../clases/Asignaciones.php';
require_once '../clases/Push.php';

$arts = new Asignaciones($token);
$push = new Push($token);
$archivo = '../'.$_POST['source1'];
$inputFileType = PHPExcel_IOFactory::identify($archivo);
$objReader = PHPExcel_IOFactory::createReader($inputFileType);
$objPHPExcel = $objReader->load($archivo);
$sheet = $objPHPExcel->getSheet(0);
$highestRow = $sheet->getHighestRow();
$highestColumn = $sheet->getHighestColumn();
if(	$highestRow > 0)
{
	$creados = 0;
	$editados = 0;
	$registros = [];
	$invalidos = [];
	for ($row = 2; $row <= $highestRow; $row++)
  {
	 if(!is_null($sheet->getCell("A".$row)->getValue()))
	 {
		 /*defino valores*/
		 $sucursal = "";
		$listado['sucursal'] = $sheet->getCell("A".$row)->getValue();
		$listado['grupo'] = $sheet->getCell("B".$row)->getValue();
		$listado['checklist'] = $sheet->getCell("C".$row)->getValue();
    $listado['usuario'] = $sheet->getCell("F".$row)->getValue();
		$fecha = PHPExcel_Shared_Date::ExcelToPHP($sheet->getCell("D".$row)->getValue());
		$fecha = date('Y-m-d', $fecha);
		$fecha = strtotime ( '+1 day' , strtotime ( $fecha ) ) ;
		$fecha = date ( 'Y-m-d' , $fecha );
    $listado['fecha'] = $fecha;
		$fechaf = PHPExcel_Shared_Date::ExcelToPHP($sheet->getCell("E".$row)->getValue());
		$fechaf = date('Y-m-d', $fechaf);
		$fechaf = strtotime ( '+1 day' , strtotime ( $fechaf ) ) ;
		$fechaf = date ( 'Y-m-d' , $fechaf );
    $listado['fechaf'] = $fechaf;
		/**/
		/*busco los equivalentes*/
//		$sucursal = explode(" ",$listado["sucursal"]);
//		$sucursal = str_replace($sucursal[0],"",$listado["sucursal"]);
		$sucursal = trim($listado["sucursal"]);
		$idChecklist = $arts->flexibleSingleBind("SELECT id FROM jb_dinamic_section WHERE nombre like ?",trim($listado["checklist"]),0,0,0,'s',1,'');
		$idGrupo = $arts->flexibleSingleBind("SELECT id FROM jb_grupos WHERE nombre like ?",trim($listado["grupo"]),0,0,0,'s',1,$token);
		$idUsuario = $arts->flexibleSingleBind("SELECT id_empleado FROM jb_empleado WHERE email like ?",trim($listado["usuario"]),0,0,0,'s',1,$token);
		$suc = $arts->flexibleSingleBind('SELECT CONCAT(id,"___",nombre) FROM jb_empresa_sucursales WHERE nombre like ?','%'.trim($sucursal).'%',0,0,0,'s',1,$token);
		$suc = explode("___",$suc);
 		$idSucursal = $suc[0];
		$json = '[{"contenido":"Sin contenido precargado","columna":"0","etiqueta":"Info","tipo":"0"}]';
		$extras = '';
		$idi = uniqid();
		$invalido = $listado;
	  $invalido['validos'] = 'FI FF ';
		if(!is_null($idChecklist))
		{
			$listado["idChecklist"] = $idChecklist;
			$invalido['validos'] .= ' checklist ';
		}
		if(!is_null($idGrupo))
		{
			$listado["idGrupo"] = $idGrupo;
			$invalido['validos'] .= ' grupo ';
		}
		if(!is_null($idSucursal))
		{
			$listado["idSucursal"] = $idSucursal;
			$invalido['validos'] .= ' suc ';
		}
		if(!is_null($idUsuario))
		{
			$listado["idUsuario"] = $idUsuario;
			$invalido['validos'] .= ' usuario ';
		}
		if($token == '74452baadc5779020cf126d8bee3ae0552b86ef5850d1e08f3c4f8e0482783dc80754dff')
		 include 'precargadoSomosmaple.com.php';
		/**/
		//$valores = [$listado['id']];
		if(!is_null($idChecklist) && !is_null($idGrupo) && !is_null($idSucursal) && !is_null($idUsuario))
		{
			if( $arts->setItem($json,$idi,$idAux,$listado['fecha']) && $arts->setItemAsignado($idi,$idChecklist,$idGrupo,$idSucursal,$idUsuario,$listado['fechaf'],"",4) )
			{
			 $listado['idAsignacion'] = $idi;
			 $arts->conexion->commit();
			 $aIds = $push->getDevicesUsuario($idUsuario,3,1);
			 if(count($aIds) > 0)
			 $aIds = $push->sendAndroidPush(1,"Checklist ".$listado['checklist']." asignado",$listado['usuario'],$aIds,3);
			 $iIds = $push->getDevicesUsuario($idUsuario,3,2);
			 $appleIds = array();
			 if(count($aIds) > 0)
			 {
				 foreach($iIds as $i)
				 {
					$ids = array();
					 $ids[] = $i;
					$sendIos = $push->sendIosPush(1,"Checklist asignado",$ids,true,3);
					$appleIds = $ids;
				 }
			 }
			}
			else
			{
				//$invalidos[] = $id;
			 $arts->conexion->rollback();
			}
			$body = 'Buenos días, <br><br> '.$extras;
			$postmark = new Postmark("5e8f390a-206d-445c-bfdf-5eb4a1c681fb","soporte@jarboss.com","");
			$mailTo = trim($listado['usuario']);
			$result = $postmark->to($mailTo)
			->subject('Se te asigno el checklist '.$listado['checklist'])
			->html_message($body)
			->send();
		 $registros[] = $listado;
		}
		else
		$invalidos[] = $invalido;
	 }
  }
	$server['registros'] = $registros;
	$server['invalidos'] = $invalidos;
	$server['estatus'] = "ok";
}
else
{
	$server['registros'] = [];
	$server['estatus'] = "error";
}
ob_flush();
?>
