<?php
/*ejemplo para continuar a pruebas de las asignaciones realizadas 5e1fa1db4e73e_12345671*/
ini_set("display_errors",0);
require_once '../../PHPExcel/Classes/PHPExcel.php';
require_once '../clases/Asignaciones.php';
$arts = new Asignaciones('');
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
	for ($row = 2; $row <= $highestRow; $row++)
  {
	 if(!is_null($sheet->getCell("A".$row)->getValue()))
	 {
		 /*defino valores*/
		 $sucursal = "";
		$listado['sucursal'] = $sheet->getCell("A".$row)->getValue();
		$listado['grupo'] = $sheet->getCell("B".$row)->getValue();
    $listado['checklist'] = $sheet->getCell("C".$row)->getValue();
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
    $pedido = $sheet->getCell("F".$row)->getValue();
		/**/
		/*busco los equivalentes*/
//		$sucursal = explode(" ",$listado["sucursal"]);
//		$sucursal = str_replace($sucursal[0],"",$listado["sucursal"]);
		$sucursal = trim($listado["sucursal"]);
		$idChecklist = $arts->flexibleSingleBind("SELECT id FROM jb_dinamic_section WHERE nombre like ?",$listado["checklist"],0,0,0,'s',1,'');
		$idGrupo = $arts->flexibleSingleBind("SELECT id FROM jb_grupos_externos WHERE nombre like ?",$listado["grupo"],0,0,0,'s',1,'');
		$suc = $arts->flexibleSingleBind('SELECT CONCAT(id,"___",nombre) FROM jb_empresa_sucursales WHERE nombre like ?','%'.trim($sucursal).'%',0,0,0,'s',1,'7c3983f1e14a8ac35b35ee8b2d0ea8ae368f17bb47b4a5dd6706cbe9bfb2e842fcb2f033');
		$suc = explode("___",$suc);
		$idSucursal = $suc[0];
    $elemento = $arts->flexibleSingleBind("SELECT e.id FROM jb_dinamic_tables_columns e INNER JOIN jb_dinamic_tables a ON a.id = e.id_table WHERE a.id_section = ? AND e.nombre LIKE '%mero de pedido%'",$idChecklist,0,0,0,'s',1,'');
    $json = '[{"contenido": "'.$pedido.'" ,"columna":"'.$elemento.'","etiqueta":"No. de pedido","tipo":"0"},{"contenido": "'.$suc[1].'" ,"columna":"","etiqueta":"Sucursal","tipo":"0"}]';
		$idi = uniqid();
		$idAux = $idi.'_'.$pedido;
		if(!is_null($idChecklist))
			$listado["idChecklist"] = $idChecklist;
		if(!is_null($idGrupo))
			$listado["idGrupo"] = $idGrupo;
		if(!is_null($idSucursal))
			$listado["idSucursal"] = $idSucursal;
		/**/
		//$valores = [$listado['id']];
		if(!is_null($idChecklist) && !is_null($idGrupo) && !is_null($idSucursal))
		{
			$listado['usuariosGrupo'] = $arts->getMiembrosGrupo($idGrupo);
			if(count($listado['usuariosGrupo']) > 0)
			{
				$listado["creados"] = [];
				foreach($listado['usuariosGrupo'] as $u)
				{
					$id = uniqid();
					if( $arts->setItem($json,$id,$idAux,$listado['fecha']) && $arts->setItemAsignado($id,$idChecklist,$idGrupo,$idSucursal,$u['id_usuario'],$listado['fechaf'],"",4) )
					{
						$listado["creados"][] = $id;
					 $arts->conexion->commit();
					}
					else
					{
					 $arts->conexion->rollback();
				  }
				}
			}
			$registros[] = $listado;
		}
		else
		$invalidos[] = $listado;
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
?>
