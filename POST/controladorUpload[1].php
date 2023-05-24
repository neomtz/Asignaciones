<?php
$version = date("Y-m-d_H:i:s");
$nombre=str_replace(" ","_",$_FILES["file"]["name"]);
$p = array('á','é','í','ó','ú','Á','É','Í','Ó','Ú','ñ','Ñ','¿','¡','?','!');
$r = array('a','e','i','o','u','A','E','I','O','U','n','N','','','','');
$nombre = str_replace($p, $r, $nombre).'_'.$version;
$adjunto= 'adjuntos/'.$nombre;
if (!file_exists('../'.$adjunto))
{
 if(move_uploaded_file($_FILES["file"]["tmp_name"],"../adjuntos/".$nombre))
    $server = array( "status" => "ok", "nombre"=> $adjunto );
 else
   $server = array( "status" => "error", "log"=> "no se pudo mover el archivo" );
}
else
 $server = array( "status" => "ok", "log"=> "existe" );
