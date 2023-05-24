<?php
class Incumplimiento extends Conexion
{
 var $token;
 var $conexion;
 var $insertId;
 private $paginador = 20;
 function __construct($token)
 {
   $this->token = $token;
 }
 function setIncumplimiento($id,$id_usuario,$correo,$fecha)
 {
  $mysqli = $this->fullConnect($this->token);
  $query="INSERT INTO jb_asistencia_lista(id,id_usuario,email,fecha,status) VALUES (?,?,?,?,1)";
  if ($stmt = $mysqli->prepare($query))
  {
   $stmt->bind_param('ssss', $id,$id_usuario,$correo,$fyecha);
     if ($stmt->execute())
     {
        $stmt->free_result();
		//$insertado = $stmt->insert_id; /* en caso de que se posea una columna auto_increment*/
        $stmt->close();

          return true;
     }
     else
     {
        $this->mysqlError = $stmt->error;
        $stmt->close();
         return false;
     }
  }
  else
  {
    $this->mysqlError = $mysqli->error;
     return false;
  }
 }
 function getTicketsConf($idChecklist)
 {
	$listado = array();
	$mysqli = $this->fullConnect($this->token);
  $query = "SELECT id_checklist_objetivo,elemento_validador,precarga_original,precarga_objetivo FROM jb_tickets_conf WHERE id_checklist = ?";
  if ($stmt = $mysqli->prepare($query))
  {
    $stmt->bind_param('s',$idChecklist);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4);
      while ($stmt->fetch())
      {
        $registro['idChecklist'] = $col1;
        $registro['validador'] = $col2;
        $registro['precargaOriginal'] = $col3;
        $registro['precargaObj'] = $col4;
        $registro['estatus'] = "ok";
        $listado = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }
 function getTickets($idChecklist,$fi,$ff,$opciones)
 {
	$listado = array();
	$mysqli = $this->fullConnect($this->token);
  $query = "SELECT rg.id_row,r.id,r.nombre,r.fecha,r.id_grupo,r.id_usuario,r.id_plantilla,e.id,e.fecha,ea.id_reporte FROM jb_dinamic_tables_rows rg
  INNER JOIN jb_reporte_mantenimiento r ON r.id = rg.id_reporte
  LEFT JOIN jb_asign_elementos e ON e.id_aux = rg.id_row LEFT JOIN jb_asign_elementos_asignar ea ON ea.id_elem=e.id
  WHERE rg.contenido in (".$opciones.") AND r.id_plantilla = ? AND r.fecha BETWEEN ? AND ?";
  if ($stmt = $mysqli->prepare($query))
  {
    $stmt->bind_param('sss',$idChecklist,$fi,$ff);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10);
      while ($stmt->fetch())
      {
        $registro['resolucion'] = [];
        $registro['idRow'] = $col1;
        $registro['id'] = $col2;
        $registro['nombre'] = $col3;
        $registro['fecha'] = $col4;
        $registro['idGrupo'] = $col5;
        $registro['idUsuario'] = $col6;
        $registro['idChecklist'] = $col7;
        $registro['asignacionId'] = $col8;
        $registro['asignacionFecha'] = $col9;
        $registro['nuevo_reporte'] = $col10;
        $registro['idSucursal'] = $this->flexibleSingleBind('SELECT id FROM jb_empresa_sucursales WHERE nombre LIKE ?','%'.trim($col3).'%',0,0,0,'s',1,'');
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }

 function getTicketsMetricos($idReg)
 {
	$listado = array();
  $columnas = $this->precargados;
	$mysqli = $this->fullConnect($this->token);
  echo $query = "SELECT r.id,r.id_row,ro.contenido FROM jb_dinamic_tables_rows r
  LEFT JOIN jb_dinamic_tables_option_row ro ON ro.id = r.contenido
  WHERE r.id_row in ($idReg) AND r.status = 1 ";
  if ($stmt = $mysqli->prepare($query))
  {
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3);
      while ($stmt->fetch())
      {
        $registro['id'] = $col1;
        $registro['idRow'] = $col2;
        $registro['nombre'] = $col3;
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }
 function getTicketsId($id)
 {
	$listado = array();
	$mysqli = $this->fullConnect($this->token);
 $query = 'SELECT id,id_usuario,email,fecha,status FROM jb_asistencia_lista WHERE id = ?';
  if ($stmt = $mysqli->prepare($query))
  {
   $stmt->bind_param('s',$id);
    if ($stmt->execute())
    $stmt->bind_result($col1,$col2,$col3,$col4,$col5);
     while ($stmt->fetch())
     {
       $registro['id'] = $col1;
       $registro['id_usuario'] = $col2;
       $registro['correo'] = $col3;
       $registro['fecha'] = $col4;
        $registro['status'] = "ok";
        $listado = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }
 function getTicketsBuscar($cadena)
 {
	$listado = array();
	$mysqli = $this->fullConnect($this->token);
  $query = 'SELECT rg.id_row,r.id,r.nombre,r.fecha,r.id_grupo,r.id_usuario,r.id_plantilla,e.id,e.fecha FROM jb_dinamic_tables_rows rg
  INNER JOIN jb_reporte_mantenimiento r ON r.id = rg.id_reporte
  LEFT JOIN jb_asign_elementos e ON e.id_aux = rg.id_row
  WHERE rg.contenido in ('.$this->opcionesAplica.') AND r.id = ? ORDER BY r.fecha DESC';
   if ($stmt = $mysqli->prepare($query))
   {
    $stmt->bind_param('s',$cadena);
    if ($stmt->execute())
    $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9);
     while ($stmt->fetch())
     {
       $registro['resolucion'] = [];
       $registro['idRow'] = $col1;
       $registro['id'] = $col2;
       $registro['nombre'] = $col3;
       $registro['fecha'] = $col4;
       $registro['idGrupo'] = $col5;
       $registro['idUsuario'] = $col6;
       $registro['asignacionId'] = $col8;
       $registro['asignacionFecha'] = $col9;
       $registro['idSucursal'] = $this->flexibleSingleBind('SELECT id FROM jb_empresa_sucursales WHERE nombre LIKE ?','%'.trim($col3).'%',0,0,0,'s',1,'');
       if(!is_null($col8))
       {
         $registro['resolucion'] = $this->getIncumplimientoResolucion($col8);
       }
       $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }
 function getTicketsFiltro($ano,$sucursal,$grupo,$usuario)
 {
   $anonot = '';
   $sucnot = '';
   $gruponot = '';

   $ano = '%'.$ano.'-%';
   $sucursal = '%'.$sucursal.'%';
   if(empty($ano))
    $ano = ' NOT ';
   if(empty($sucursal))
     $sucnot = ' NOT ';
   if(empty($grupo))
    $gruponot = ' NOT ';
   if(!empty($usuario))
    $usuario = ' AND  r.id_usuario ='.$usuario.' ';
    else
    $usuario = '';
 $listado = array();
 $mysqli = $this->fullConnect($this->token);
 $query = 'SELECT rg.id_row,r.id,r.nombre,r.fecha,r.id_grupo,r.id_usuario,r.id_plantilla,e.id,e.fecha FROM jb_dinamic_tables_rows rg
 INNER JOIN jb_reporte_mantenimiento r ON r.id = rg.id_reporte
 LEFT JOIN jb_asign_elementos e ON e.id_aux = rg.id_row
  WHERE rg.contenido in ('.$this->opcionesAplica.')
  AND '.$anonot.' r.fecha like ? AND '.$sucnot.' r.nombre like ? AND '.$gruponot.' r.id_grupo = ? '.$usuario.'
  ORDER BY r.fecha DESC';
   if ($stmt = $mysqli->prepare($query))
   {
    $stmt->bind_param('ssi',$ano,$sucursal,$grupo);
    if ($stmt->execute())
    $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9);
     while ($stmt->fetch())
     {
       $registro['resolucion'] = [];
       $registro['idRow'] = $col1;
       $registro['id'] = $col2;
       $registro['nombre'] = $col3;
       $registro['fecha'] = $col4;
       $registro['idGrupo'] = $col5;
       $registro['idUsuario'] = $col6;
       $registro['idChecklist'] = $col7;
       $registro['asignacionId'] = $col8;
       $registro['asignacionFecha'] = $col9;
       $registro['idSucursal'] = $this->flexibleSingleBind('SELECT id FROM jb_empresa_sucursales WHERE nombre LIKE ?','%'.trim($col3).'%',0,0,0,'s',1,'');
       if(!is_null($col8))
       {
         $registro['resolucion'] = $this->getIncumplimientoResolucion($col8);
       }
       $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }
 function getTicketsResolucion($idAsignacion)
 {
 $listado = array();
 $mysqli = $this->fullConnect($this->token);
  $query = "SELECT r.id,r.fecha FROM jb_asign_elementos_asignar a
  INNER JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
  WHERE a.id_elem = ? AND a.status = 5";
  if ($stmt = $mysqli->prepare($query))
  {
    $stmt->bind_param('s',$idAsignacion);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2);
      while ($stmt->fetch())
      {
        $registro['id'] = $col1;
        $registro['fecha'] = $col2;
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }
}//end class
