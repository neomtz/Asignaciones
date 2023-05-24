<?php
include '../clases/Conexion.php';
include '../clases/Tickets.php';
ini_set('display_errors',0);

$arts = new Tickets($_POST['source']);

if($_GET['source2'] == 'updEstatus')
{
$idAux =  $arts->flexibleSingleBind('SELECT id_aux FROM jb_asign_elementos WHERE id = ? LIMIT 1',$_POST['source1'],0,0,0,'s',1,$_POST['source']);

  if($arts->updEstatus($_POST['source1'],$_POST['source2']) && $arts->updHistorico($_POST['source1']))
  {
   $server['status'] = 'ok';
   $server['idAux']=$idAux;
   $arts->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $server['log'] = $arts->mysqlError;
  $arts->conexion->rollback();
  }
}

if($_GET['source2'] == 'updValidar')
{
$idAux =  $arts->flexibleSingleBind('SELECT id_aux FROM jb_asign_elementos WHERE id = ? LIMIT 1',$_POST['source1'],0,0,0,"s",1,$_POST['source']);
$server['idasd']=$idAux;

  if($arts->updEstatus($_POST['source1'],$_POST['source2']))
  {
   $server['status'] = 'ok';
   $server['idAux']=$idAux;
   $arts->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $server['log'] = $arts->mysqlError;
   $arts->conexion->rollback();
  }
}

if($_GET['source2'] == 'eliminarIncumplimiento')
{
$idAux =  $arts->flexibleSingleBind('SELECT id_aux FROM jb_asign_elementos WHERE id = ? ',$_POST['source1'],0,0,0,'s',1,$_POST['source']);
//echo $idElemento;

  if($arts->updEstatus($_POST['source1'],$_POST['source2']))
  {
   $server['status'] = 'ok';
  // $server['usuarios']=$arts->sucUsuarios($_POST['source3']);
   $server['idAux']=$idAux;
   $arts->conexion->commit();
  }
  else
  {
   $server['status'] = 'error';
   $server['log'] = $arts->mysqlError;
   $arts->conexion->rollback();
  }
}
?>
