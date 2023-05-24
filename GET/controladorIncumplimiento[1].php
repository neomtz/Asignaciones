<?php
ini_set('display_errors',0);
/* Aquí se instancía la clase y se invocan los metodos requeridos comunmente los metodos get en el parametro source2 get*****\ */
include '../clases/Conexion.php';
include '../clases/Tickets.php';
/* la variable arts suele ser el contenedor estandar para almacenar clases*/
$arts = new tickets($token);
if($_GET['source2'] == 'checklists')
{
  /*corrección necesaria para que funcione email como correo alterno*/

  $correo =  $arts->flexibleSingleBind('SELECT l.usuario FROM jb_empleado e INNER JOIN jb_empleado_login l ON l.id_empleado = e.id_empleado WHERE e.id_empleado = ? AND e.id_empresa > 0 LIMIT 1',$_POST['source1'],0,0,0,"s",1,$token);
  $idcs =  $arts->flexibleSingleBind('SELECT id_section FROM jb_dinamic_relations WHERE mail = ? LIMIT 1',$correo,0,0,0,"s",1,'');
  $idcs = trim($idcs,',');
  $idcs = '"'.str_replace(',','","',$idcs).'"';
  $server = $arts->getChecklistsUsuario($idcs);
}
if($_GET['source2'] == 'conf')
{
   $server = $arts->getTicketsConf($_POST['source1']);
   $server['nombreEmpresa'] = $arts->flexibleSingleBind('SELECT nombre FROM jb_company WHERE APItoken = ? LIMIT 1',$_POST['source'],0,0,0,"s",1,'');
   $validadores = json_decode($server['validador']);
   $elementos = json_decode($server['precargaOriginal']);
   foreach($validadores as $v)
   {
     if(is_numeric($v->posicion))
       $server['opciones'] .= '"'.$v->id.'",';
     else
       $server['opciones'] .= '"'.$v->opcion.'",';
   }
   $server['opciones'] = rtrim($server['opciones'],",");
   foreach($elementos as $v)
   {
     $server['elementos'] .= '"'.$v->id.'",';
   }
   $server['total'] = 0;
   $server['asignados'] = 0;
   $server['realizados'] = 0;
   $server['estatus'] = 'error';

   if($server['opciones'] != "")
   {
     $server['estatus'] = 'ok';
     $server['elementos'] = rtrim($server['elementos'],",");
     $total = "SELECT COUNT(rg.id) FROM jb_dinamic_tables_rows rg
     INNER JOIN jb_reporte_mantenimiento r ON r.id = rg.id_reporte
     WHERE rg.contenido in (".$server['opciones'].") AND r.id_plantilla = ? AND r.fecha BETWEEN ? AND ?";
     $asignados = "SELECT COUNT(rg.id) FROM jb_dinamic_tables_rows rg
     INNER JOIN jb_reporte_mantenimiento r ON r.id = rg.id_reporte
     INNER JOIN jb_asign_elementos e ON e.id_aux = rg.id_row INNER JOIN jb_asign_elementos_asignar ea ON ea.id_elem=e.id
     WHERE rg.contenido in (".$server['opciones'].") AND r.id_plantilla = ? AND ea.status = 4 AND r.fecha BETWEEN ? AND ?";
     $atendidos = "SELECT COUNT(rg.id) FROM jb_dinamic_tables_rows rg
     INNER JOIN jb_reporte_mantenimiento r ON r.id = rg.id_reporte
     LEFT JOIN jb_asign_elementos e ON e.id_aux = rg.id_row LEFT JOIN jb_asign_elementos_asignar ea ON ea.id_elem=e.id
     WHERE rg.contenido in (".$server['opciones'].") AND r.id_plantilla = ? AND ea.status = 5 AND r.fecha BETWEEN ? AND ?";
     $server['nombreChecklist'] = $arts->flexibleSingleBind('SELECT nombre FROM jb_dinamic_section WHERE id = ?',$server['idChecklist'],0,0,0,"s",1,'');
     $server['total'] = $arts->flexibleSingleBind($total,$_POST['source1'],$_POST['source2'].' 00:00:00',$_POST['source3'].' 23:59:59',0,"sss",3,$_POST['source']);
     $server['asignados'] = $arts->flexibleSingleBind($asignados,$_POST['source1'],$_POST['source2'].' 00:00:00',$_POST['source3'].' 23:59:59',0,"sss",3,$_POST['source']);
     $server['realizados'] = $arts->flexibleSingleBind($atendidos,$_POST['source1'],$_POST['source2'].' 00:00:00',$_POST['source3'].' 23:59:59',0,"sss",3,$_POST['source']);
   }

}
if($_GET['source2'] == 'gettickets')
{
  /*f(!empty($sucursales)){
    $sucursales = '';
  }*/
  if(!isset($_POST['source7']) || empty($_POST['source7']))
    $sucursales = '';
  else
    $sucursales =$_POST['source7']; //'"'.str_replace(',','","',$_POST['source7']).'"';

  if(!isset($_POST['source6']) || empty($_POST['source6']))
    $grupos = '';
  else
    $grupos = '"'.str_replace(',','","',$_POST['source6']).'"';

   $server = $arts->getTickets($_POST['source1'],$_POST['source2'],$_POST['source3'],$_POST['source4'],$_POST['source5'],$grupos,$sucursales);
}
if($_GET['source2'] == 'getticketsmetricos')
{
  $server = $arts->getticketsMetricos($_POST['source1'],$_POST['source2']);
}
if($_GET['source2'] == 'getticketsid')
{
  $server = $arts->getticketsId($_POST['source2']);
}
if($_GET['source2'] == 'getticketsbuscar')
{
  $server = $arts->getticketsBuscar($_POST['source1']);
}
if($_GET['source2'] == 'getticketsfiltro')
{
  $server = $arts->getticketsFiltro($_POST['source1'],$_POST['source2'],$_POST['source3'],$_POST['source4']);
}
if($_GET['source2'] == 'getdevices')
{
  $server = $arts->getDevicesUsuario($_POST['source1']);
}
if($_GET['source2'] == 'getticketsidreporte')
{
  $idc = $arts->flexibleSingleBind("SELECT id_plantilla FROM jb_reporte_mantenimiento WHERE id = ? LIMIT 1",$_POST['source1'],0,0,0,'s',1,$_POST['source']);
  $confs = $arts->getTicketsConf($idc);
  $validadores = json_decode($confs['validador']);
  $elementos = json_decode($server['precargaOriginal']);
  foreach($validadores as $v)
  {
    if(is_numeric($v->posicion))
      $opciones .= '"'.$v->id.'",';
    else
      $opciones .= '"'.$v->opcion.'",';
  }
   $opciones = rtrim($opciones,",");
   $server = $arts->getTicketsIdreporte($_POST['source1'],$opciones);
}
//Aqui inicia las lineas para reasignar tickets

if($_GET['source2'] == 'getHistorico')
{
  $server = $arts->getHistorico($_POST['source1'],$_POST['source2']);
}
if($_GET['source2'] == 'getticketsEliminados')
{
   $server = $arts->getticketsEliminados($_POST['source1'],$_POST['source2'],$_POST['source3'],$_POST['source4'],$_POST['source5'],$_POST['source6'],$_POST['source7'],$_POST['source8']);
}
if ($_GET['source2']=='cancelarTicket') {
  $server=$arts->cancelarTicket($_POST['source2']);
}
if($_GET['source2'] == 'mostrarSucursales'){
  $server = $arts->getSucursales();
}
if($_GET['source2'] == 'mostrarGrupos'){
  $server = $arts->getGrupos();
}
