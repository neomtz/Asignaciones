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
function getGrupos()
{
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/GruposI/GET/?source=grupos&source2=datosgruposall",
   data: "token="+$_get("source")+"&source1=0",
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
     $("#jb_reporte_loading").show();
	 $("#site_active_indicador").text('0');
    if(server.length)
    {
	  $.each(server,function(a,b)
	  {
		  $("#source2").append('<option value="'+b.id+'">'+b.nombre+'</option>');
	  });
	}
	getUsuarios();
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}
function getUsuarios()
{
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/API/GET/?source1=directorio&source2=get",
   data: "source="+$_get("source")+"&source1=0",
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
    if(server.length)
    {
	  $.each(server,function(a,b)
	  {
		  $("#source4").append('<option value="'+b.id+'">'+b.nombre+'</option>');
	  });
	}
	getChecklists()
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}
function getChecklists()
{
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/API/GET/?source1=checklist&source2=getsec",
   data: "source="+$_get("source"),
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
    if(server.length)
    {
	  $.each(server,function(a,b)
	  {
		  $("#source1").append('<option value="'+b.id+'">'+b.nombre+'</option>');
	  });
	}
	getSucursales();
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}
function getSucursales()
{
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/API/GET/?source1=sucursal&source2=get",
   data: "source="+$_get("source"),
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
     $("#jb_reporte_loading").hide();
    if(server.length)
    {
	  $.each(server,function(a,b)
	  {
		  $("#source3").append('<option value="'+b.id+'">'+b.nombre+'</option>');
	  });
	}
	if($("#source8").length)
		getAsignacion();

   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}
function getActividades()
{
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/API/GET/?source1=checklist&source2=getact",
   data: "source="+$_get("source")+"&source1="+$("#source1").val(),
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
    if(server.length)
    {
	  $.each(server,function(a,b)
	  {
		  $("#source8").append('<option value="'+b.id+'">'+b.nombre+'</option>');
	  });
	}
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}
function getElementos()
{
 $("#source9").empty();
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/API/GET/?source1=checklist&source2=getele",
   data: "source="+$_get("source")+"&source1="+$("#source8").val(),
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
    if(server.length)
    {
	  $.each(server,function(a,b)
	  {
	    var tipo = 'Texto: ';
		if(b.tipo == 3)
		  tipo = 'Selector: ';
		  $("#source9").append('<option value="'+b.id+'">'+tipo+' '+b.nombre+'</option>');
	  });
	}
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}
function getOpciones()
{
 var elemento = $("#source9 option:selected").text();
 if(elemento.indexOf("Selector:")) 	
  $("#contenedorTipo").html('<input class="form-control" id="source10" type="text" placeholder="Valor precargado"  name="source10">');
 else
 {
	  $("#contenedorTipo").html('<select class="form-control" id="source10" name="source10" onchange="getOpciones(this.value)"></select>')
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/API/GET/?source1=checklist&source2=getopt",
   data: "source="+$_get("source")+"&source1="+$("#source9").val(),
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
	  $.each(server,function(a,b)
	  {
		  $("#source10").append('<option value="'+b.id+'">'+b.nombre+'</option>');
	  });	      
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax		 
 }  
}

