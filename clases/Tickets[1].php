<?php
class Tickets extends Conexion
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
   $stmt->bind_param('ssss', $id,$id_usuario,$correo,$fecha);
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
 function getChecklistsUsuario($idcs)
 {
 $listado = array();
 $mysqli = $this->fullConnect('');
  $query = "SELECT id,nombre,type_section FROM jb_dinamic_section WHERE id IN ($idcs) AND status = 1";
  if ($stmt = $mysqli->prepare($query))
  {
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3);
      while ($stmt->fetch())
      {
        $registro['id'] = $col1;
        $registro['nombre'] = $col2;
        $registro['tipo'] = $col3;
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
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
 function getTickets($idChecklist,$fi,$ff,$opciones,$paginador,$idGrupo,$suc)
 {
   //echo $suc;
   //$paginador = ' ORDER BY r.fecha DESC LIMIT '.$paginador.' , '.$this->paginador;
   $paginador = ' ORDER BY r.fecha DESC ';
	$listado = array();
  $fi .= ' 00:00:00';
  $ff .= ' 23:59:59';
  $ext='';
  if(empty($this->token))
  $ext = '_externos';
  if(empty($idGrupo))
   $idGrupo = '';
  else
   $idGrupo = " AND r.id_grupo IN ($idGrupo) ";
   if(empty($suc))
   $sucursal = '';
   else{
     // $sucursal = " AND r.nombre IN ($suc) ";
     $suc="%".$suc."%";
     $sucursal = " AND r.nombre like ? ";
   }

	$mysqli = $this->fullConnect($this->token);
  $query = "SELECT distinct rg.id_row,r.id,r.nombre,r.fecha,r.id_grupo,r.id_usuario,r.id_plantilla,e.id,e.fecha,ea.id_reporte,CONCAT(em.nombres,' ',em.a_paterno),g.nombre,ea.status,rg.id_table FROM jb_dinamic_tables_rows rg
  INNER JOIN jb_reporte_mantenimiento r ON r.id = rg.id_reporte
  LEFT JOIN jb_asign_elementos e ON e.id_aux = rg.id_row
  LEFT JOIN jb_asign_elementos_asignar ea ON ea.id_elem=e.id
  LEFT JOIN jb_empleado em ON em.id_empleado = r.id_usuario
  LEFT JOIN jb_grupos".$ext." g ON g.id = r.id_grupo
  WHERE rg.contenido in (".$opciones.") AND r.id_plantilla = ? AND r.fecha BETWEEN ? AND ? ".$idGrupo." ".$sucursal." AND r.status = 1 ".$paginador;
  if ($stmt = $mysqli->prepare($query))
  {

    if(empty($suc))
    $stmt->bind_param('sss',$idChecklist,$fi,$ff);
    else{
      $stmt->bind_param('ssss',$idChecklist,$fi,$ff,$suc);
    }
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14);
      while ($stmt->fetch())
      {
        $registro['resolucion']["estatus"] = "error";
        $registro['idRow'] = $col1;
        $registro['id'] = $col2;
        $registro['nombre'] = $col3;
        $registro['fecha'] = $col4;
        $registro['idGrupo'] = $col5;
        $registro['idUsuario'] = $col6;
        $registro['idChecklist'] = $col7;
        $registro['asignacionId'] = $col8;
        if(!is_null($col8))
        {
          $registro['resolucion'] = $this->getTicketsResolucion($col8,$col13);
        }
        $registro['asignacionFecha'] = $col9;
        $registro['nuevo_reporte'] = $col10;
        $registro['nombreUsuario'] = $col11;
        $registro['nombreGrupo'] = $col12;
        $registro['estatus'] = $col13;
        $registro['idSucursal'] = $this->flexibleSingleBind('SELECT id FROM jb_empresa_sucursales WHERE nombre LIKE ?','%'.trim($col3).'%',0,0,0,'s',1,$this->token);
        $registro['actividad'] = $this->flexibleSingleBind('SELECT nombre FROM jb_dinamic_tables WHERE id LIKE ?','%'.trim($col14).'%',0,0,0,'s',1,'');

        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }
 function getTicketsIdreporte($idReporte,$opciones)
  {
   $listado = array();
   $mysqli = $this->fullConnect($this->token);
   $query = "SELECT distinct rg.id_row,r.id,r.nombre,r.fecha,r.id_grupo,r.id_usuario,r.id_plantilla,e.id,e.fecha,ea.id_reporte,CONCAT(em.nombres,' ',em.a_paterno),g.nombre,ea.status FROM jb_dinamic_tables_rows rg
   INNER JOIN jb_reporte_mantenimiento r ON r.id = rg.id_reporte
   LEFT JOIN jb_asign_elementos e ON e.id_aux = rg.id_row
   LEFT JOIN jb_asign_elementos_asignar ea ON ea.id_elem=e.id
   LEFT JOIN jb_empleado em ON em.id_empleado = r.id_usuario
   LEFT JOIN jb_grupos g ON g.id = r.id_grupo
   WHERE rg.contenido in ($opciones) AND rg.id_reporte = ? ";
   if ($stmt = $mysqli->prepare($query))
   {
     $stmt->bind_param('s',$idReporte);
     if ($stmt->execute())
      $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13);
       while ($stmt->fetch())
       {
         $registro['resolucion']["estatus"] = "error";
         $registro['idRow'] = $col1;
         $registro['id'] = $col2;
         $registro['nombre'] = $col3;
         $registro['fecha'] = $col4;
         $registro['idGrupo'] = $col5;
         $registro['idUsuario'] = $col6;
         $registro['idChecklist'] = $col7;
         $registro['asignacionId'] = $col8;
         if(!is_null($col8))
         {
           $registro['resolucion'] = $this->getTicketsResolucion($col8,$col13);
         }
         $registro['asignacionFecha'] = $col9;
         $registro['nuevo_reporte'] = $col10;
         $registro['nombreUsuario'] = $col11;
         $registro['nombreGrupo'] = $col12;
         $registro['idSucursal'] = $this->flexibleSingleBind('SELECT id FROM jb_empresa_sucursales WHERE nombre LIKE ?','%'.trim($col3).'%',0,0,0,'s',1,$this->token);
         $listado[] = $registro;
         unset($registro['resolucion']);
       }
      $stmt->free_result();
      $stmt->close();
    return $listado;
   }
   else
    return $mysqli->error;
  }
 function getTicketsMetricos($idReg,$idElem)
 {
	$listado = array();
	$mysqli = $this->fullConnect($this->token);
  $query = "SELECT r.id,r.id_row,r.contenido,r.status,ro.contenido FROM jb_dinamic_tables_rows r
  LEFT JOIN jb_dinamic_tables_option_row ro ON ro.id = r.contenido
  WHERE r.id_row in ($idReg) AND r.id_column in ($idElem) ";
  if ($stmt = $mysqli->prepare($query))
  {
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5);
      while ($stmt->fetch())
      {
        $registro['id'] = $col1;
        $registro['idRow'] = $col2;
        $registro['contenido'] = $col3;
        $registro['posicion'] = $col4;
        $registro['contenidoOpcion'] = $col5;
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
 function getTicketsResolucion($idAsignacion,$est)
 {
   $cerrado='';
if ($est!=6) {
  $cerrado='AND a.status = 5';
}
else {
  $cerrado='AND (a.status = 5 OR a.status=6)';
}
if ($est===-1) {
 $cerrado='AND a.status = -1';
}
 //$listado = array();
 $listado['estatus'] = "error";
 $mysqli = $this->fullConnect($this->token);
  //$query = "SELECT r.id,r.fecha FROM jb_asign_elementos_asignar a INNER JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte WHERE a.id_elem = ? AND a.status = 5";
  $query = "SELECT r.id,r.fecha,r.id_plantilla FROM jb_asign_elementos_asignar a INNER JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte WHERE a.id_elem = ? ".$cerrado."";
  if ($stmt = $mysqli->prepare($query))
  {
    $stmt->bind_param('s',$idAsignacion);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3);
      while ($stmt->fetch())
      {
        $registro['id'] = $col1;
        $registro['fecha'] = $col2;
          if ($col3 == '5f355aa699540')
        $registro['fechaAtencion'] = $this->flexibleSingleBind('SELECT contenido FROM jb_dinamic_tables_rows WHERE id_reporte = ? AND id_column = "5f7eac139d199"',$col1,0,0,0,'s',1,$this->token);

        if ($col3 == '5f9127e986f04')
        $registro['fechaAtencion'] = $this->flexibleSingleBind('SELECT contenido FROM jb_dinamic_tables_rows WHERE id_reporte = ? AND id_column = "6042acbf5e479"',$col1,0,0,0,'s',1,$this->token);

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

 function getHistorico($paginador,$idAux)
 {
   $idAux="%".$idAux."%";
   $listado = array();
 $mysqli = $this->fullConnect($this->token);
  $query = "SELECT a.id, a.id_aux,b.id_usuario,b.fecha_i,b.id_reporte,CONCAT(c.nombres,' ',c.a_paterno) from jb_asign_elementos a LEFT JOIN jb_asign_elementos_asignar b  ON a.id=b.id_elem LEFT JOIN jb_empleado c ON b.id_usuario= c.id_empleado where a.id_aux LIKE ? ";
  if ($stmt = $mysqli->prepare($query))
  {
    $stmt->bind_param('s',$idAux);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6);
      while ($stmt->fetch())
      {
        $registro['id'] = $col1;
        $registro['idAux'] = $col2;
        $registro['idUsuario'] = $col3;
        $registro['fecha']=$col4;
        $registro['reporte']=$col5;
        $registro['nombre'] = $col6;
        $listado[] = $registro;
      }
      $stmt->free_result();
      $stmt->close();

   return $listado;
  }
  else
   return $mysqli->error;
 }

 function updEstatus($idElemento,$estatus)
{

 $mysqli = $this->fullConnect($this->token);
 $query="UPDATE jb_asign_elementos_asignar SET status = ? WHERE id_elem = ?";
 if ($stmt = $mysqli->prepare($query))
 {
 /*$stmt->bindParam('1', $estatus);
 $stmt->bindParam('2', $idElemento);*/
 $stmt->bind_param('ss',$estatus,$idElemento);
    if ($stmt->execute())
    {
      $stmt->free_result();
      $stmt->close();
         return true;
    }
    else
    {
      $stmt->close();
        return false;
    }
 }
}

function updHistorico($idElemento)
{

 $mysqli = $this->fullConnect($this->token);
 $query="UPDATE jb_asign_elementos SET id_aux = concat(id_aux,'_historico') WHERE id = ?";
 if ($stmt = $mysqli->prepare($query))
 {
 //  echo $tipo;
  $stmt->bind_param('s', $idElemento);
    if ($stmt->execute())
    {
      $stmt->free_result();
      $stmt->close();
      return true;
    }
    else
    {
      $stmt->close();
      return false;
    }
 }
}

function getSucursales()
 {
	$listado = array();
	$mysqli = $this->fullConnect($this->token);
  $query = "SELECT id,nombre FROM jb_empresa_sucursales";
  if ($stmt = $mysqli->prepare($query))
  {
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2);
      while ($stmt->fetch())
      {
        $registro['id'] = $col1;
        $registro['nombre'] = $col2;
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
  else
   return $mysqli->error;
 }

 function getGrupos()
 {
	$listado = array();
	$mysqli = $this->fullConnect($this->token);
  $query = "SELECT id,nombre FROM jb_grupos";
  if ($stmt = $mysqli->prepare($query))
  {
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2);
      while ($stmt->fetch())
      {
        $registro['id'] = $col1;
        $registro['nombre'] = $col2;
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
