$( document ).ready(function() 
{
getGrupos()
 $("#crearAsignacion").submit(function(e)
 {
  e.preventDefault();
   var dataPost =  $("#crearAsignacion").serializeArray();
    dataPost.push({"name":"source","value":$_get("source")});
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://jarboss.com/Asignaciones/POST/?source=asign&source2=setasign",
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
	   alert("Se ha creado una asignación.")
	 }
	 else
	 {
	   alert("Error al crear la asignación")
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


