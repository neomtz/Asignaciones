<?php
 /* agregar cierre para probar modulo por separaqdo ->
 include '../clases/Asignaciones.php';
 $token = '897ab3ffb25c354d97a9ea172e5a5decf2436ea4d8db7e3cc50f7cc6de758a12fab4b465';
 $art = new Asignaciones($token);/**/
 if($_POST['source1'] == "602418a42cc58")
 {
   $elementos = ['602418a4b777e','602418a4b6fdd','602418a4b7fe5','602418a4b882e'];
   $etiquetas = ['Proyecto','Numero','Nombre','Proveedor'];
   $idSucursal = $_POST['source3']; //source3
   $nombreSucursal = $art->flexibleSingleBind('SELECT nombre FROM jb_empresa_sucursales WHERE id = ?',$idSucursal,0,0,0,'s',1,$token);
   $nombreSucursal = str_replace('-','',$nombreSucursal);
   $proyecto = $art->flexibleSingleBind('SELECT CONCAT(proyecto,"___",nopieza,"___",pieza,"___",proveedor) FROM jbw_piezas WHERE nopieza like ?','%'.$nombreSucursal.'%',0,0,0,'s',1,$token);
   $proyecto = explode('___',$proyecto);
   if(count($proyecto) > 0)
   {
     $server['modificadores'] = 'ok ->'.$nombreSucursal;
     $x = 0;
     $json = [];
     foreach($proyecto as $p)
     {
       $listado['contenido'] = trim($p);
       $listado['columna'] = $elementos[$x];
       $listado['etiqueta'] = $etiquetas[$x];
       $listado['tipo '] = '0';
       $json[] = $listado;
       $x++;
     }
     $json = json_encode($json);
   }
 }

?>
