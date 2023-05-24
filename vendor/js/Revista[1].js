(function($) {
    $_get = function(key)   {
        key = key.replace(/[\[]/, '\\[');
        key = key.replace(/[\]]/, '\\]');
        var pattern = "[\\?&]" + key + "=([^&#]*)";
        var regex = new RegExp(pattern);
        var url = unescape(window.location.href);
        var results = regex.exec(url);
        if (results === null) {
            return null;
        } else {
            return results[1];
        }
    }
})(jQuery);

function getArticulos(opt)
{ 
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "./GET/?source=articulo&source2=get",
   data: "source="+opt,
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	   $.each(server,function(a,b)
	   {
		  var interfaz = interfaceArticulo(b.id,b.seccion,b.creador,b.titulo,b.contenido,b.agrada,b.fecha);
		 $("#contenedorArticulos").append(interfaz);
	   });
	 $("#site_active_indicador").text('0');
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax
}
function getArticulo(id)
{ 
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "./GET/?source=articulo&source2=getp",
   data: "source="+id,
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	  if(server.status == 'error')
	  {
		  alert("Hubo un problema con el artículo, fue borrado o esta siendoe editado.")
	  }
	  else
	  {
		  $("#titulo").html(server.titulo);
		  $("#nombre").html('Por '+server.creador);
		  $("#seccion").html('Publicado en '+server.titulo);
		  $("#fecha").html('Al '+server.fecha);
		  $("#contenido").html(server.contenido);
	  }
	 $("#site_active_indicador").text('0');
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax
}
function interfaceArticulo(id,seccion,nombre,titulo,contenido,agrada,fecha)
{
 var interfaz = '<div id="'+id+'" class="post-preview">';
     interfaz += '<h2 class="post-title colorLetraPrimario">'+nombre;
     interfaz += '</h2><h3 class="post-subtitle colorLetraSecundario">'+titulo+' <a href="post.html?source='+id+'">';
     interfaz += '<p><small><a href="post.html?source='+id+'">Seguir Leyendo</a></small></p></h3></a>';
     interfaz += '<p class="post-meta">Publicado en '+seccion+' '+fecha+'</p></div><hr>';
 return interfaz;
}
