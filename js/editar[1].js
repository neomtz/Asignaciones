$( document ).ready(function() 
{
 if($_get("source2") != 'externo')
 $("#contenedorHeader").load("Cabecera.html?v=0.2");
 getGrupos();
 $("#editarAsignacion").submit(function(e)
 {
  e.preventDefault();
   var dataPost =  $("#editarAsignacion").serializeArray();
    dataPost.push({"name":"source","value":$_get("source")});
    dataPost.push({"name":"source0","value":$_get("source1")});
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/Asignaciones/POST/?source=asign&source2=updasign",
   data: dataPost,
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
	 if(server.status == 'ok')
	 {
	   alert("Se ha editado correctamente.")
	 }
	 else
	 {
	   alert("Error al editar la asignación")
	 }  
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax
 });
});

function getAsignacion()
{
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/Asignaciones/GET/?source=asign&source2=getasign",
   data: "source="+$_get("source")+"&source1="+$_get("source1"),
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
    if(server.status == 'ok')
    {
		$("#source1 option[value='"+server.col5+"']").attr('selected','selected');
		$("#source2 option[value='"+server.col6+"']").attr('selected','selected');
		$("#source3 option[value='"+server.col13+"']").attr('selected','selected');
		$("#source4 option[value='"+server.col12+"']").attr('selected','selected');
     $("#source5").val(server.col14);
     var datos = server.col3;
      if(datos.length > 0)
      {
  	  $.each(datos,function(a,b)
	  {
		  $("#precargado").append('<tr><td>'+b.columna+'</td><td>'+b.contenido+'</td></tr>');
	  });
      }
            getActividades();
       if(server.col11 > 1)
	{
	   $(".btn").attr("disabled","disabled");
	   $(".form-control").attr("disabled","disabled");
	 alert("Esta asignación no puede ser editada debido a que se encuentra pendiente de atención o ya fue atendida")
	}
    }
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}
function updStatusAsignacion()
{
 if($("#source4").val() == 0)
 {
  return false;
   alert("Selecciona un usuario para enviarla a jawk")
 }
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/Asignaciones/POST/?source=asign&source2=updstatus",
   data: "source="+$_get("source")+"&source1="+$_get("source1")+"&source2=NA&source3=4",
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
    if(server.status == 'ok')
    {
	   $(".btn").attr("disabled","disabled");
	   $(".form-control").attr("disabled","disabled");
	  alert("La asignación esta disponible en Jarboss Work")
sendPush();
	}
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}

function sendPush()
{
 var mensaje = $("#source1 option:selected").text()+'-'+$("#source3 option:selected").text()+'-'+$("#source5").val();
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/API/POST/?source1=push&source2=usuario",
   data: "source="+$_get("source")+"&source1="+$("#source4").val()+"&source2=Administrador&source3=3&source4="+mensaje,
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}

