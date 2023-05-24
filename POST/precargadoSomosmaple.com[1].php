<?php
if($idChecklist == "556de6ead39d6")
{
  $equipo = $sheet->getCell("G".$row)->getValue();
  $comentarios = $sheet->getCell("H".$row)->getValue();
  $idEquipo = $arts->flexibleSingleBind("SELECT id FROM jb_dinamic_tables_option_row WHERE contenido like ?",'%'.trim($equipo).'%',0,0,0,'s',1,$token);
  $json = '[{"contenido":"'.$idEquipo.'","columna":"5dd55d88cb5aa","etiqueta":"Equipo","tipo":"3"}]';
  $extras .= $comentarios;
}
 ?>
