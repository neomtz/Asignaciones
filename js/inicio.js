$( document ).ready(function() 
{
 $("#contenedorHeader").load("Cabecera.html?v=0.2");
});

function getAsignaciones(opt)
{
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/Asignaciones/GET/?source=asign&source2=geti&source3="+opt,
   data: "source="+$_get("source")+"&source1=",
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');
	  
   },
   success: function(server)
   {
	 $("#site_active_indicador").text('0');
       if(server.length > 0)
       {
	 $.each(server,function(a,b)
	 {
		 var interfaz = interfaceArticulo(b.col1,b.col4,b.col7,b.col8,b.col11,b.col13,b.col14,b.col0,b.col15);
		 $("#contenedorAsignaciones").append(interfaz);
	 });
	}
	else
	{
		alert("No hay asignaciones aún")
	}
	$("#jb_reporte_loading").hide();
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax	
}

/*
 * 		
 * */

function interfaceArticulo(id,fecha,checklist,grupo,estado,sucursal,usuario,reporte,fechaAtencion)
{	 
 var color = '#e4e4e4';
 var idReporte = '';
 var status = 'Pendiente';
 if(estado == 4)
 {
  color = '#C2E5F1';
  status = 'Asignada';
 } 	
 if(estado == 5)
 {
  color = '#C4F1C2';
  status = '<a target="_blank" href="https://jarboss.com/Soriana.com/reporteTemporal.php?source='+reporte+'"> Atendida </a>';
 } 	
  var interfaz = '<a href="Editar.html?source='+$_get("source")+'&source1='+id+'"><div class="col-lg-4  articulos manito" id="top_1">  <div class="card h-100" style="background-color:'+color+'"><div class="card-body"><h4 class="card-title">Fecha de atención: '+fechaAtencion+'</h4><h5>Creado en: '+fecha+'</h5><h5>Seccion: '+checklist+'</h5><h5>Grupo: '+grupo+'</h5><h5>Sucursal: '+sucursal+'</h5><h5>Usuario: '+usuario+'</h5><h5>Estado: '+status+'</h5></div></div></div></a>';
    return interfaz;
}

