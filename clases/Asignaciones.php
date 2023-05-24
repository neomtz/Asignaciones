<?php
include 'Conexion.php';
//require_once('../../backend/SOAPlib/nusoap.php');
class Asignaciones extends Conexion
{
 var $conexion;
 var $token;
 function __construct($token)
 {
   $this->token = $token;
 }
 function setItem($contenido,$id,$aux,$fecha)
 {
  $aux = trim($aux);
   $mysqli = $this->fullConnect($this->token);
/*  if(empty($fecha))
   $fecha = date("Y-m-d H:i:s");*/
    if ($stmt = $mysqli->prepare("INSERT INTO jb_asign_elementos VALUES (?,?,?,?,1)"))
    {
      $stmt->bind_param('ssss', $id,$aux,$contenido,$fecha );
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
 function setItemWs($id,$fecha,$aux,$contenido)
 {
   $mysqli = $this->fullConnect($this->token);
    if ($stmt = $mysqli->prepare("INSERT INTO jb_asign_elementos VALUES (?,?,?,?,1)"))
    {
      $stmt->bind_param('ssss', $id,$aux,$contenido,$fecha);
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
 function setItemAsignado($idi,$ids,$idg,$sucursal,$idu,$fecha,$coord,$stat,$horai,$horaf)
 {
/*  if(empty($fecha))
   $fecha = date("Y-m-d H:i:s");*/
  $id = uniqid();
   $mysqli = $this->fullConnect($this->token);
    if ($stmt = $mysqli->prepare("INSERT INTO jb_asign_elementos_asignar(id,id_elem,id_usuario,fecha_i,status,id_section,id_grupo,coordenadas,id_sucursal,horai,horaf) VALUES (?,?,?,?,?,?,?,?,?,?,?)"))
    {
      $stmt->bind_param('ssisisissss',$id,$idi,$idu,$fecha,$stat,$ids,$idg,$coord,$sucursal,$horai,$horaf);
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
function getItems($opt,$idu)
{
 $mysqli = $this->fullConnect($this->token);
 $listado = array();
 $col3 = array();
 $where = 'a.status = ?';
 if(!empty($idu))
 {
   $and = ' AND a.id_usuario = ?';
  if($opt == 2)
   $where = '(a.status = ? OR a.status = 3)';
 }
 if($opt == '24')
 {
   $and = ' AND a.id_usuario = ?';
   $where = '(a.status = 2 OR a.status = 3 OR a.status = 4)';
 }
 if($opt == '12345')
 {
  $and = '';
   $where = '(a.status = 1 OR a.status = 2 OR a.status = 3 OR a.status = 4 OR a.status = 5) ';
 }
 if($opt == '1')
 {
  $and = '';
   $where = 'a.status = 1 ';
 }
 if($opt == '4')
 {
  $and = '';
   $where = 'a.status = 4 ';
 }
 if($opt == '5')
 {
  $and = '';
   $where = 'a.status = 5 ';
 }
 $ext = '';
 if(empty($this->token))
  $ext = '_externos';
/*   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado,g.nombre,CONCAT(e.nombres," ",e.a_paterno),s.nombre
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    LEFT JOIN jb_grupos g ON g.id = a.id_grupo
    LEFT JOIN jb_empleado e ON e.id_empleado = a.id_usuario
    LEFT JOIN jb_empresa_sucursales s ON s.id = a.id_sucursal
    WHERE '.$where.$and.' ORDER BY i.fecha DESC';*/
   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado,g.nombre
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    LEFT JOIN jb_grupos'.$ext.' g ON g.id = a.id_grupo
    WHERE '.$where.$and.' ORDER BY i.fecha DESC';
 if ($stmt = $mysqli->prepare($query))
 {
 if(!empty($idu))
  $stmt->bind_param("ii", $opt,$idu);
 if(empty($idu))
  $stmt->bind_param("i", $opt);
 if($opt == '24')
  $stmt->bind_param("i", $idu);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15);
//     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15,$col16,$col17);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;


        $registro['col3'] = $col3;
        $registro['col4'] = $col4;
        $registro['col5'] = $col6;
        $registro['col6'] = $col7;
      /*  $equipo= $this->flexibleSingleBind('SELECT equipo FROM kf_lineas_mantenimiento WHERE id = ? and tipo_mantenimiento = 2 ',$col2,0,0,0,'s',1,$this->token);
        $des=$this->flexibleSingleBind('SELECT frecuencia FROM kf_lineas_mantenimiento WHERE id = ? and tipo_mantenimiento = 2 ',$col2,0,0,0,'s',1,$this->token);
        if($equipo == null || $equipo == false)
        $registro['equipo'] ='';
        else
        $registro['equipo'] =$equipo;

         if($des == null || $des == false)
        $registro['descripcion'] = '';
        else
           $registro['descripcion'] = $des;*/
        $registro['col7'] = '';
        $registro['col8'] = '';
	if($col6 != 0)
        $registro['col7'] = $this->flexibleSingleBind('SELECT nombre FROM jb_dinamic_section WHERE id = ?',$col6,0,0,0,'s',1,'');
	if(!is_null($col15))
        $registro['col8'] = $col15;
	if(empty($this->token))
          $registro['col9'] = 1;
	else
          $registro['col9'] = 0;
        $registro['col0'] = $col8;
        $registro['col10'] = $col9;
        $registro['col11'] = $col5;
        $registro['col12'] = new stdClass();
        $registro['col13'] = $col10;
	$tokenEmpresa = $this->token;
	if(empty($this->token))
	  $tokenEmpresa = $this->flexibleSingleBind('SELECT c.APItoken FROM jb_grupos_externos_miembros gm INNER JOIN jb_company c ON c.id = gm.id_empresa WHERE gm.id_usuario = ? LIMIT 1',$col11,0,0,0,'s',1,'');
        $nombreUsuario = $this->flexibleSingleBind('SELECT CONCAT(nombres," ",a_paterno) FROM jb_empleado WHERE id_empleado = ?',$col11,0,0,0,'s',1,$tokenEmpresa);
	if(!is_null($nombreUsuario) || $nombreUsuario != false)
         $registro['col14'] = $nombreUsuario;
	else
	 $registro['col14'] = 'Sin asignar';
        if($this->token == '71f7c02c586ddd8986d778ed3f7167d95269746c478152cf4ad04880d97e29435e0163d1')
        $registro['col12'] = $this->getElementoValidaciones($idu,$col2);
        $registro['col15'] = str_replace('00:00:00','',$col4);
        $registro['col16'] =  $col14;
        $registro['col17'] =  $col13;
//        $registro['col18'] =  $col17;
        $registro['col18'] = $this->flexibleSingleBind('SELECT nombre FROM jb_empresa_sucursales WHERE id = ?',$col10,0,0,0,'s',1,$tokenEmpresa);
        $registro['col19'] = str_replace('00:00:00','',$col12); //fechafin
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
 }
}
function getItemsxMesmagna($opt,$idu,$mes)
{
 $mysqli = $this->fullConnect($this->token);
 $listado = array();
 $where = 'a.status = ?';
 if(!empty($idu))
 {
   $and = ' AND a.id_usuario = ?';
  if($opt == 2)
   $where = '(a.status = ? OR a.status = 3)';
 }
 if($opt == '24')
 {
   $and = ' AND a.id_usuario = ?';
   $where = '(a.status = 2 OR a.status = 3 OR a.status = 4)';
 }
 if($opt == '12345')
 {
  $and = '';
   $where = '(a.status = 1 OR a.status = 2 OR a.status = 3 OR a.status = 4 OR a.status = 5) ';
 }
 if($opt == '1')
 {
  $and = '';
   $where = 'a.status = 1 ';
 }
 if($opt == '4')
 {
  $and = '';
   $where = 'a.status = 4 ';
 }
 if($opt == '5')
 {
  $and = '';
   $where = 'a.status = 5 ';
 }
 $ext = '';
 $mes = '%'.$mes.'%';
 $and .= ' AND a.fecha_i like ?';
 if(empty($this->token))
  $ext = '_externos';
/*   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado,g.nombre,CONCAT(e.nombres," ",e.a_paterno),s.nombre
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    LEFT JOIN jb_grupos g ON g.id = a.id_grupo
    LEFT JOIN jb_empleado e ON e.id_empleado = a.id_usuario
    LEFT JOIN jb_empresa_sucursales s ON s.id = a.id_sucursal
    WHERE '.$where.$and.' ORDER BY i.fecha DESC';*/
   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado,g.nombre
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    LEFT JOIN jb_grupos'.$ext.' g ON g.id = a.id_grupo
    WHERE '.$where.$and.'  and a.id_section IN ("5ced62f9130cc","5ced612481c24","5ced53ae77574","5cec5d6a3b2bc","5cec33ffb62ef")  ORDER BY i.fecha DESC';
 if ($stmt = $mysqli->prepare($query))
 {
 if(!empty($idu))
  $stmt->bind_param("ii", $opt,$idu);
 if(empty($idu))
  $stmt->bind_param("i", $opt);
 if($opt == '24')
  $stmt->bind_param("i", $idu);
 if($opt == '12345')
  $stmt->bind_param("s", $mes);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15);
//     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15,$col16,$col17);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;
        $registro['col3'] = $col3;
        $registro['col4'] = $col4;
        $registro['col5'] = $col6;
        $registro['col6'] = $col7;
        $registro['col7'] = '';
        $registro['col8'] = '';
	if($col6 != 0)
        $registro['col7'] = $this->flexibleSingleBind('SELECT nombre FROM jb_dinamic_section WHERE id = ?',$col6,0,0,0,'s',1,'');
	if(!is_null($col15))
        $registro['col8'] = $col15;
	if(empty($this->token))
          $registro['col9'] = 1;
	else
          $registro['col9'] = 0;
        $registro['col0'] = $col8;
        $registro['col10'] = $col9;
        $registro['col11'] = $col5;
        $registro['col12'] = new stdClass();
        $registro['col13'] = $col10;
	$tokenEmpresa = $this->token;
	if(empty($this->token))
	  $tokenEmpresa = $this->flexibleSingleBind('SELECT c.APItoken FROM jb_grupos_externos_miembros gm INNER JOIN jb_company c ON c.id = gm.id_empresa WHERE gm.id_usuario = ? LIMIT 1',$col11,0,0,0,'s',1,'');
        $nombreUsuario = $this->flexibleSingleBind('SELECT CONCAT(nombres," ",a_paterno) FROM jb_empleado WHERE id_empleado = ?',$col11,0,0,0,'s',1,$tokenEmpresa);
	if(!is_null($nombreUsuario) || $nombreUsuario != false)
         $registro['col14'] = $nombreUsuario;
	else
	 $registro['col14'] = 'Sin asignar';
        if($this->token == '71f7c02c586ddd8986d778ed3f7167d95269746c478152cf4ad04880d97e29435e0163d1')
        $registro['col12'] = $this->getElementoValidaciones($idu,$col2);
        $registro['col15'] = str_replace('00:00:00','',$col12);
        $registro['col16'] =  $col14;
        $registro['col17'] =  $col13;
//        $registro['col18'] =  $col17;
        $registro['col18'] = $this->flexibleSingleBind('SELECT nombre FROM jb_empresa_sucursales WHERE id = ?',$col10,0,0,0,'s',1,$tokenEmpresa);
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
 }
}
function getItemsxMes($opt,$idu,$mes,$idc,$idSuc)
{
 $mysqli = $this->fullConnect($this->token);
 $listado = array();
 $where = 'a.status = ?';
 if(!empty($idu))
 {
   $and = ' AND a.id_usuario = ?';
  if($opt == 2)
   $where = '(a.status = ? OR a.status = 3)';
 }
 if($opt == '24')
 {
   $and = ' AND a.id_usuario = ?';
   $where = '(a.status = 2 OR a.status = 3 OR a.status = 4)';
 }
 if($opt == '12345')
 {
  $and = '';
   $where = '(a.status = 1 OR a.status = 2 OR a.status = 3 OR a.status = 4 OR a.status = 5 OR a.status = 6) ';
 }
 if($opt == '1')
 {
  $and = '';
   $where = 'a.status = 1 ';
 }
 if($opt == '4')
 {
  $and = '';
   $where = 'a.status = 4 ';
 }
 if($opt == '5')
 {
  $and = '';
   $where = 'a.status = 5 OR a.status = 6';
 }
 $ext = '';
 $mes = '%'.$mes.'%';
 if(!empty($idSuc))
  $and .= " AND a.fecha_i like ? AND a.id_section IN ('$idc') AND a.id_sucursal = '$idSuc'";
else
  $and .= " AND a.fecha_i like ? AND a.id_section IN ('$idc')";
 if(empty($this->token))
  $ext = '_externos';
    $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado,g.nombre
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    LEFT JOIN jb_grupos'.$ext.' g ON g.id = a.id_grupo
    WHERE '.$where.$and.' ORDER BY i.fecha DESC LIMIT 1000';
 if ($stmt = $mysqli->prepare($query))
 {
 if(!empty($idu))
  $stmt->bind_param("ii", $opt,$idu);
 if(empty($idu))
  $stmt->bind_param("i", $opt);
 if($opt == '24')
  $stmt->bind_param("i", $idu);
 if($opt == '12345' || $opt == '4' || $opt == '5')
  $stmt->bind_param("s", $mes);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15);
//     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15,$col16,$col17);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;
        $registro['col3'] = $col3;
        $registro['col4'] = $col4;//fechainicio
        $registro['col5'] = $col6;
        $registro['col6'] = $col7;
        $registro['col7'] = '';
        $registro['col8'] = '';
	if($col6 != 0)
        $registro['col7'] = $this->flexibleSingleBind('SELECT nombre FROM jb_dinamic_section WHERE id = ?',$col6,0,0,0,'s',1,'');
	if(!is_null($col15))
        $registro['col8'] = $col15;
	if(empty($this->token))
          $registro['col9'] = 1;
	else
          $registro['col9'] = 0;
        $registro['col0'] = $col8;
        $registro['col10'] = $col9;
        $registro['col11'] = $col5;
        $registro['col12'] = new stdClass();
        $registro['col13'] = $col10;
	$tokenEmpresa = $this->token;
	if(empty($this->token))
	  $tokenEmpresa = $this->flexibleSingleBind('SELECT c.APItoken FROM jb_grupos_externos_miembros gm INNER JOIN jb_company c ON c.id = gm.id_empresa WHERE gm.id_usuario = ? LIMIT 1',$col11,0,0,0,'s',1,'');
        $nombreUsuario = $this->flexibleSingleBind('SELECT CONCAT(nombres," ",a_paterno) FROM jb_empleado WHERE id_empleado = ?',$col11,0,0,0,'s',1,$tokenEmpresa);
	if(!is_null($nombreUsuario) || $nombreUsuario != false)
         $registro['col14'] = $nombreUsuario;
	else
	 $registro['col14'] = 'Sin asignar';
        if($this->token == '71f7c02c586ddd8986d778ed3f7167d95269746c478152cf4ad04880d97e29435e0163d1')
        $registro['col12'] = $this->getElementoValidaciones($idu,$col2);
        $registro['col15'] = str_replace('00:00:00','',$col4); //fechafin
        $registro['col16'] =  $col14;
        $registro['col17'] =  $col13;
//        $registro['col18'] =  $col17;
//    $registro['col18'] = $this->flexibleSingleBind('SELECT nombre FROM jb_empresa_sucursales WHERE id = ?',$col10,0,0,0,'s',1,"7c3983f1e14a8ac35b35ee8b2d0ea8ae368f17bb47b4a5dd6706cbe9bfb2e842fcb2f033");
        $registro['col18'] = $this->flexibleSingleBind('SELECT nombre FROM jb_empresa_sucursales WHERE id = ?',$col10,0,0,0,'s',1,$tokenEmpresa);
        $registro['col19'] = str_replace('00:00:00','',$col12); //fechafin
        $registro['col20'] = $tokenEmpresa; //fechafin
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
 }
}
function getItem($id)
{
 $mysqli = $this->fullConnect($this->token);
   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_usuario,a.id_sucursal,a.fecha_i
   FROM jb_asign_elementos i
   INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
   WHERE i.id = ?';
 if ($stmt = $mysqli->prepare($query))
 {
  $stmt->bind_param("s", $id);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;
        $registro['col3'] = json_decode($col3);
        $registro['col4'] = $col4;
        $registro['col5'] = $col6;
        $registro['col6'] = $col7;
        $registro['col7'] = '';
        $registro['col8'] = '';
	if($col6 != 0)
        $registro['col7'] = $this->flexibleSingleBind('SELECT nombre FROM jb_dinamic_section WHERE id = ?',$col6,0,0,0,'s',1,'');
	if($col7 != 0)
        $registro['col8'] = $this->flexibleSingleBind('SELECT nombre FROM jb_grupos WHERE id = ?',$col7,0,0,0,'i',1,$this->token);
        $registro['col9'] = 0;
        $registro['col0'] = $col8;
        $registro['col10'] = $col9;
        $registro['col11'] = $col5;
        $registro['col12'] = $col10;
        $registro['col13'] = $col11;
        $registro['col14'] = str_replace('00:00:00','',$col12);
        $registro['idColumnaDatos'] = $this->flexibleSingleBind('SELECT id FROM jb_dinamic_tables WHERE id_section = ? AND status = 1 ORDER BY position LIMIT 1',$col6,0,0,0,'s',1,'');
        $listado = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
 }
 else
  return $mysqli->error;
}
function getUsuarios()
{
 $mysqli = $this->fullConnect('');
 $listado = array();
  $query = 'select distinct(id_empleado),CONCAT(NOMBRES," ",A_PATERNO," ",A_MATERNO) nombre from jb_empleado';
  if ($stmt = $mysqli->prepare($query))
  {
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
  }
}
 function sendAsignacionMail($mail)
 {
  $body = 'Se te ha asigando una actividad revisa tu aplicación Jarboss Work';
  include_once('../../../Jarboss.com/backend/Postmark.php');
  $postmark = new Postmark("5c5a038f-dc99-4a2c-9c90-d6c97c46863a","soporte@jarboss.com","");
  $result = $postmark->to($mail)
  ->subject("Nuevo ticket asignado")
  ->html_message($body)
  ->send();
 }
 function getElementoValidaciones($idu,$item)
 {
  $mysqli = $this->fullConnect('');
$client = new nusoap_client('https://apps.madisa.com/WSJarbossCABLES/WSJarbossCABLES.asmx?wsdl', 'wsdl');
$param=array(); //parametros de la llamada
$param['soapAction']="http://tempuri.org/SelContratosActivosCables";
$result = $client->call('SelContratosActivosCables', array('parameters' => $param), '', '', false, true);
// Check for a fault
$response = false;
if ($client->fault)
{
        print_r($result);
} else {
        // Check for errors
        $err = $client->getError();
        if ($err) {
                // Display the error
                $result =$err;
        } else {
                // Display the result
         $response = true;
        }
}
if($response)
{
//$email = $this->flexibleSingleBind('select email from jb_empleado where id_empleado = ? limit 1',$idu,0,0,0,'i',1,$this->token); //se activas agrega la validacion $email == $c->Asignadoa
$cables = json_encode($result);

$cables = str_replace('{"SelContratosActivosCablesResult":{"Contrato":','',$cables);
$cables = str_replace('}}','',$cables);

$cables = json_decode($cables);
$contratos = array();
$listado = array();
//$server = array();
foreach($cables as $cb)
{
 if(!in_array($cb->idContrato,$contratos))
  $contratos[] = $cb->idContrato;
}
//$cable = array();
//      $id_rep = $this->flexibleSingleBind('select id_reporte from jb_dinamic_tables_rows where contenido = ? order by fecha DESC limit 1',$col1,0,0,0,'s',1,$this->token);
   $server['elemento'] = '573a59ec60b65';
   $server['tipo'] = 3;
  foreach($contratos as $c)
  {
   for($x = 0 ; $x < 4 ; $x++)
   {
    if($x == 0)
    $cab['elemento'] = '573a59ec62224';
    if($x == 1)
    $cab['elemento'] = '573a59ec639f9';
    if($x == 2)
    $cab['elemento'] = '573a59ec64e16';
    if($x == 3)
    $cab['elemento'] = '573a59ec661ed';
    $cab['tipo'] = 'max';
    $cable[] = $cab;
   }
   $idKits = array();
    foreach($cables as $cb)
    {
	if($cb->idContrato == $c && trim($cb->idEquipo) == $item)
	{
	      $id_row = $this->flexibleSingleBind('select id_row from jb_dinamic_tables_rows where contenido = ? ORDER BY fecha desc limit 1',$cb->idEquipo,0,0,0,'s',1,$this->token);
          if(!empty($id_row))
          {
           $cable[0]['contenido'] = $this->flexibleSingleBind('select contenido from jb_dinamic_tables_rows where id_row = ? AND status = 2 limit 1',$id_row,0,0,0,'s',1,$this->token);
           $cable[1]['contenido'] = $this->flexibleSingleBind('select contenido from jb_dinamic_tables_rows where id_row = ? AND status = 4 limit 1',$id_row,0,0,0,'s',1,$this->token);
           $cable[2]['contenido'] = $this->flexibleSingleBind('select contenido from jb_dinamic_tables_rows where id_row = ? AND status = 6 limit 1',$id_row,0,0,0,'s',1,$this->token);
           $cable[3]['contenido'] = $this->flexibleSingleBind('select contenido from jb_dinamic_tables_rows where id_row = ? AND status = 8 limit 1',$id_row,0,0,0,'s',1,$this->token);
          }
          else
          {
           $cable[0]['contenido'] = $cb->MedIniCable1;
           $cable[1]['contenido'] = $cb->MedIniCable2;
           $cable[2]['contenido'] = $cb->MedIniCable3;
           $cable[3]['contenido'] = $cb->MedIniCable4;
          }
                $largo = $cable;
	 if($cb->Estatus == 'Regreso')
	 $tipo = 1;
	  $idKits[] = array("disparador" => trim($cb->idEquipo),"elementos" => $largo);
       }
	unset($largo);
   }
   $server['validaciones'] = $idKits;
        unset($largo);
        unset($cable);
   $listado = $server;
  }
 }
    return $listado;
}
 function updItemAsignadoStatus($id,$contenido,$stat)
 {
   $mysqli = $this->fullConnect($this->token);
    if ($stmt = $mysqli->prepare("UPDATE jb_asign_elementos_asignar SET status = ? , contenido = ? WHERE id_elem = ?"))
    {
      $stmt->bind_param('iss', $stat,$contenido,$id);
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
 function updReporteId($id,$idReporte)
 {
   $mysqli = $this->fullConnect($this->token);
    if ($stmt = $mysqli->prepare("UPDATE jb_asign_elementos_asignar SET id_reporte = ? WHERE id_elem = ?"))
    {
      $stmt->bind_param('ss', $idReporte,$id);
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
 function updItemAsignado($id,$ids,$idg,$sucursal,$idu,$fecha,$coord)
 {
   $mysqli = $this->fullConnect($this->token);
    if ($stmt = $mysqli->prepare("UPDATE jb_asign_elementos_asignar SET id_section = ?, id_grupo = ?, id_sucursal = ?, id_usuario = ?, fecha_i = ?,coordenadas = ? WHERE id_elem = ?"))
    {
      $stmt->bind_param('sisisss', $ids,$idg,$sucursal,$idu,$fecha,$coord,$id);
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
   else
    return false;
 }
 function delItem($id)
 {
   $mysqli = $this->fullConnect($this->token);
    if ($stmt = $mysqli->prepare("DELETE FROM jb_asign_elementos WHERE id = ?"))
    {
      $stmt->bind_param('s', $id);
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
 function delItemAsignado($id)
 {
   $mysqli = $this->fullConnect($this->token);
    if ($stmt = $mysqli->prepare("DELETE FROM jb_asign_elementos_asignar WHERE id_elem = ?"))
    {
      $stmt->bind_param('s', $id);
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
 function getItemsFiltro($idg,$idu,$ids)
{
 $mysqli = $this->fullConnect($this->token);
 $listado = array();
 if( empty($idg) )
 $idgNot = 'NOT';
 if( empty($idu) )
 $iduNot = 'NOT';
 if( empty($ids) )
 $idsNot = 'NOT';
// echo '-'.$idgNot.'-'.$iduNot.'-'.$idsNot.'-';
   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado,g.nombre,CONCAT(e.nombres," ",e.a_paterno),s.nombre
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    LEFT JOIN jb_grupos g ON g.id = a.id_grupo
    LEFT JOIN jb_empleado e ON e.id_empleado = a.id_usuario
    LEFT JOIN jb_empresa_sucursales s ON s.id = a.id_sucursal
    WHERE '.$iduNot.' a.id_usuario = ? AND '.$idgNot.' a.id_grupo = ? AND '.$idsNot.' a.id_sucursal = ? ORDER BY i.fecha DESC';
 if ($stmt = $mysqli->prepare($query))
 {
  $stmt->bind_param("iis", $idu,$idg,$ids);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15,$col16,$col17);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;
        $registro['col3'] = $col3;
        $registro['col4'] = $col4;
        $registro['col5'] = $col6;
        $registro['col6'] = $col7;
        $registro['col7'] = '';
        $registro['col8'] = '';
	if($col6 != 0)
        $registro['col7'] = $this->flexibleSingleBind('SELECT nombre FROM jb_dinamic_section WHERE id = ?',$col6,0,0,0,'s',1,'');
	if(!is_null($col15))
        $registro['col8'] = $col15;
        $registro['col9'] = 0;
        $registro['col0'] = $col8;
        $registro['col10'] = $col9;
        $registro['col11'] = $col5;
        $registro['col12'] = new stdClass();
        $registro['col13'] = $col10;
	if(!is_null($col16))
         $registro['col14'] = $col16;
	else
	 $registro['col14'] = 'Sin asignar';
        if($this->token == '71f7c02c586ddd8986d778ed3f7167d95269746c478152cf4ad04880d97e29435e0163d1')
        $registro['col12'] = $this->getElementoValidaciones($idu,$col2);
        $registro['col15'] = str_replace('00:00:00','',$col12);
        $registro['col16'] =  $col14;
        $registro['col17'] =  $col13;
        $registro['col18'] =  $col17;
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
 }
 else
 return $mysqli->error;
}
function getItemsFiltrotau($idg,$idu,$ids)
{
 $mysqli = $this->fullConnect($this->token);
 $listado = array();
 if( empty($idg) )
 $idgNot = 'NOT';
 if( empty($idu) )
 $iduNot = 'NOT';
 if( empty($ids) )
 $idsNot = 'NOT';
// echo '-'.$idgNot.'-'.$iduNot.'-'.$idsNot.'-';
   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    WHERE '.$iduNot.' a.id_usuario = ? AND '.$idgNot.' a.id_grupo = ? AND '.$idsNot.' a.id_sucursal = ? ORDER BY i.fecha DESC';
 if ($stmt = $mysqli->prepare($query))
 {
  $stmt->bind_param("iis", $idu,$idg,$ids);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;
        $registro['col3'] = $col3;
        $registro['col4'] = $col4;
        $registro['col5'] = $col6;
        $registro['col6'] = $col7;
        $registro['col7'] = '';
        $registro['col8'] = '';
	if($col6 != 0)
        $registro['col7'] = $this->flexibleSingleBind('SELECT nombre FROM jb_dinamic_section WHERE id = ?',$col6,0,0,0,'s',1,'');
        $nomg = $this->flexibleSingleBind('SELECT nombre FROM jb_grupos_externos WHERE id = ?',$idg,0,0,0,'s',1,'');

        if(!is_null($nomg))
        $registro['col8'] = $nomg;

        $registro['col9'] = 0;
        $registro['col0'] = $col8;
        $registro['col10'] = $col9;
        $registro['col11'] = $col5;
        $registro['col12'] = new stdClass();
        $registro['col13'] = $col10;
        $usuario = $this->flexibleSingleBind('SELECT CONCAT(nombres," ",a_paterno) FROM jb_empleado WHERE id_empleado = ?',$col11,0,0,0,'s',1,'59ab9f257406b3b178bcf21317183c034ae1a6fceb511e72620b769d61895044e14414ca');

	if(!is_null($usuario))
         $registro['col14'] = $usuario;
	else
	 $registro['col14'] = 'Sin asignar';
        if($this->token == '71f7c02c586ddd8986d778ed3f7167d95269746c478152cf4ad04880d97e29435e0163d1')
        $registro['col12'] = $this->getElementoValidaciones($idu,$col2);
        $registro['col15'] = str_replace('00:00:00','',$col12);
        $registro['col16'] =  $col14;
        $registro['col17'] =  $col13;
        $registro['col18'] =$this->flexibleSingleBind('SELECT nombre FROM jb_empresa_sucursales WHERE id = ?',$col10,0,0,0,'s',1,'59ab9f257406b3b178bcf21317183c034ae1a6fceb511e72620b769d61895044e14414ca');

        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
 }
 else
 return $mysqli->error;
}


function getItemsxMestau($opt,$idu,$mes)
{
 $mysqli = $this->fullConnect($this->token);
 $listado = array();
 $where = 'a.status = ?';
 if(!empty($idu))
 {
   $and = ' AND a.id_usuario = ?';
  if($opt == 2)
   $where = '(a.status = ? OR a.status = 3)';
 }
 if($opt == '24')
 {
   $and = ' AND a.id_usuario = ?';
   $where = '(a.status = 2 OR a.status = 3 OR a.status = 4)';
 }
 if($opt == '12345')
 {
  $and = '';
   $where = '(a.status = 1 OR a.status = 2 OR a.status = 3 OR a.status = 4 OR a.status = 5)  and a.id_section="5ceed7434967c"';
 }
 if($opt == '1')
 {
  $and = '';
   $where = 'a.status = 1 ';
 }
 if($opt == '4')
 {
  $and = '';
   $where = 'a.status = 4 ';
 }
 if($opt == '5')
 {
  $and = '';
   $where = 'a.status = 5 ';
 }
 $ext = '';
 $mes = '%'.$mes.'%';
 $and .= ' AND a.fecha_i like ?';
 if(empty($this->token))
  $ext = '_externos';
/*   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado,g.nombre,CONCAT(e.nombres," ",e.a_paterno),s.nombre
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    LEFT JOIN jb_grupos g ON g.id = a.id_grupo
    LEFT JOIN jb_empleado e ON e.id_empleado = a.id_usuario
    LEFT JOIN jb_empresa_sucursales s ON s.id = a.id_sucursal
    WHERE '.$where.$and.' ORDER BY i.fecha DESC';*/
   $query = 'SELECT i.id,i.id_aux,i.contenido,i.fecha,a.status,a.id_section,a.id_grupo,a.id_reporte,a.coordenadas,a.id_sucursal,a.id_usuario,a.fecha_i,r.fecha,r.resultado,g.nombre
    FROM jb_asign_elementos i
    INNER JOIN jb_asign_elementos_asignar a ON a.id_elem = i.id
    LEFT JOIN jb_reporte_mantenimiento r ON r.id = a.id_reporte
    LEFT JOIN jb_grupos'.$ext.' g ON g.id = a.id_grupo
    WHERE '.$where.$and.' ORDER BY i.fecha DESC';
 if ($stmt = $mysqli->prepare($query))
 {
 if(!empty($idu))
  $stmt->bind_param("ii", $opt,$idu);
 if(empty($idu))
  $stmt->bind_param("i", $opt);
 if($opt == '24')
  $stmt->bind_param("i", $idu);
 if($opt == '12345')
  $stmt->bind_param("s", $mes);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15);
//     $stmt->bind_result($col1,$col2,$col3,$col4,$col5,$col6,$col7,$col8,$col9,$col10,$col11,$col12,$col13,$col14,$col15,$col16,$col17);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;
        $registro['col3'] = $col3;
        $registro['col4'] = $col4;
        $registro['col5'] = $col6;
        $registro['col6'] = $col7;
        $registro['col7'] = '';
        $registro['col8'] = '';
	if($col6 != 0)
        $registro['col7'] = $this->flexibleSingleBind('SELECT nombre FROM jb_dinamic_section WHERE id = ?',$col6,0,0,0,'s',1,'');
	if(!is_null($col15))
        $registro['col8'] = $col15;
	if(empty($this->token))
          $registro['col9'] = 1;
	else
          $registro['col9'] = 0;
        $registro['col0'] = $col8;
        $registro['col10'] = $col9;
        $registro['col11'] = $col5;
        $registro['col12'] = new stdClass();
        $registro['col13'] = $col10;
	$tokenEmpresa = $this->token;
	if(empty($this->token))
	  $tokenEmpresa = $this->flexibleSingleBind('SELECT c.APItoken FROM jb_grupos_externos_miembros gm INNER JOIN jb_company c ON c.id = gm.id_empresa WHERE gm.id_usuario = ? LIMIT 1',$col11,0,0,0,'s',1,'');
        $nombreUsuario = $this->flexibleSingleBind('SELECT CONCAT(nombres," ",a_paterno) FROM jb_empleado WHERE id_empleado = ?',$col11,0,0,0,'s',1,$tokenEmpresa);
	if(!is_null($nombreUsuario) || $nombreUsuario != false)
         $registro['col14'] = $nombreUsuario;
	else
	 $registro['col14'] = 'Sin asignar';
        if($this->token == '71f7c02c586ddd8986d778ed3f7167d95269746c478152cf4ad04880d97e29435e0163d1')
        $registro['col12'] = $this->getElementoValidaciones($idu,$col2);
        $registro['col15'] = str_replace('00:00:00','',$col12);
        $registro['col16'] =  $col14;
        $registro['col17'] =  $col13;
//        $registro['col18'] =  $col17;
        $registro['col18'] = $this->flexibleSingleBind('SELECT nombre FROM jb_empresa_sucursales WHERE id = ?',$col10,0,0,0,'s',1,$tokenEmpresa);
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
 }
}
function getMiembrosGrupo($id)
{
$listado = array();
$mysqli = $this->fullConnect('');
$query="SELECT DISTINCT(a.id_empresa),a.es_admin,a.id_usuario,c.APItoken FROM jb_grupos_externos_miembros a INNER JOIN jb_company c ON c.id = a.id_empresa WHERE a.id_grupo= ? AND NOT a.id_empresa = '52d72516c0758'";
if ($stmt = $mysqli->prepare($query))
{
$stmt->bind_param('i',$id);
   if ($stmt->execute())
   {
     $stmt->bind_result($col1,$col2,$col3,$col4);
     while ($stmt->fetch())
     {
       $registro['id'] = $col1;
       $registro['admin'] = $col2;
       $registro['id_usuario'] = $col3;
       $listado[] = $registro;
     }
      $stmt->free_result();
      $stmt->close();
        return $listado;
   }
   else
   {
      $stmt->close();
       return $listado;
   }

}
}
function getAsignaciones($fecha)
{
  $fecha="%".$fecha."%";
 $mysqli = $this->fullConnect($this->token);
   $query = 'SELECT a.id,a.horai,a.horaf,a.status,a.id_usuario
   FROM jb_asign_elementos i
   INNER JOIN jb_asign_elementos_asignar a ON i.id = a.id_elem WHERE i.fecha LIKE ?';
 if ($stmt = $mysqli->prepare($query))
 {
  $stmt->bind_param("s", $fecha);
    if ($stmt->execute())
     $stmt->bind_result($col1,$col2,$col3,$col4,$col5);
      while ($stmt->fetch())
      {
        $registro['col1'] = $col1;
        $registro['col2'] = $col2;
        $registro['col3'] = $col3;
        $registro['col4'] = $col4;
        $registro['col5'] = $col5;
        $usuario = $this->flexibleSingleBind('SELECT CONCAT(nombres," ",a_paterno) FROM jb_empleado WHERE id_empleado = ?',$col5,0,0,0,'s',1,'cdf54bf468019e22f18045df2c19e27168ec8a82c03a83006f23147cbc3df412e8701a8e');
        $email = $this->flexibleSingleBind('SELECT EMAIL FROM jb_empleado WHERE id_empleado = ?',$col5,0,0,0,'s',1,'cdf54bf468019e22f18045df2c19e27168ec8a82c03a83006f23147cbc3df412e8701a8e');
        $registro['col6'] = $usuario;
        $registro['col7'] = $email;
        $listado[] = $registro;
      }
     $stmt->free_result();
     $stmt->close();
   return $listado;
 }
 else
  return $mysqli->error;
}
}
