<?php
class Conexion
{
   private $link;
 function getLink($token)
 {
  if(empty($token))
  {
   $token = 'jarbos_metadata';
   $db = 'jarbos_metadata';
   $server = 'localhost';
   $user = 'root';
   $pass = '';
  }
  else
  {
   $sql = 'SELECT base_de_datos FROM jb_company WHERE APItoken = ? LIMIT 1';
   $token = $this->flexibleSingleBind($sql,$token,$val2,$val3,$val4,'s',1,'');
   $server = 'localhost';
   $user = 'root';
   $pass = '';
  }
   $this->link=new mysqli($server, $user, $pass, $token);
   $this->link->autocommit(FALSE);
   if (mysqli_connect_errno ())
      return null;
   else
   {
      $this->link->autocommit(FALSE);
      return $this->link;
   }
 }
 function cerrarConexion()
 {
   mysqli_close($this->link);
 }
 function rollback()
 {
   mysqli_rollback($this->link);
 }
 function commit()
 {
   mysqli_commit($this->link);
 }
 function fullConnect($token)
 {
    $mysqli = $this->conexion = $this->getLink($token);
      return $mysqli;
 }
 function flexibleSingleBind($sql,$val,$val2,$val3,$val4,$params,$vars,$token)
 {
  $mysqli = $this->fullConnect($token);
   if ($stmt = $mysqli->prepare($sql))
   {
        if($vars == 1)
            $stmt->bind_param($params, $val);
        if($vars == 2)
            $stmt->bind_param($params, $val, $val2);
        if($vars == 3)
            $stmt->bind_param($params, $val, $val2, $val3);
        if($vars == 4)
            $stmt->bind_param($params, $val, $val2, $val3, $val4);
            $stmt->execute();
            $stmt->bind_result($resultado);
            $stmt->fetch();
            $stmt->close();
            return $resultado;
   }
   else
        return false;
 }
}
?>
