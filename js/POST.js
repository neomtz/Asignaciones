function setFormSet()
{
 $("#fec_editar_form").submit(function(e)
 {
  e.preventDefault();
  var source2 = 'seti';
  if($("#tipo_form").text().trim() == '')
  {
   alert("Error cliente")
	return false;
  }
  if($("#tipo_form").text().trim() == 1 || $("#tipo_form").text().trim() == 2)
   source2 = 'updia';
  if($("#tipo_form").text().trim() == 3)
   source2 = 'updir';
  if($("#tipo_form").text().trim() == 4 || $("#tipo_form").text().trim() == 5)
  {
   alert("El proceso impide modificaciones a este item")
   return false;
  }  
 $(".form-control").prop("disabled",false)
  var dataPost =  $("#fec_editar_form").serialize();
   $.ajax({
   type: "POST",
   dataType: "JSON",
   url: "./POST/?source=asign&source2="+source2+"&source3=5",
   data: dataPost,
   success: function(server)
   {
      if(server.status == 'ok')
      {
       alert("Guardado")
       if($("#tipo_form").text().trim() == 1)
        $("#"+$("#source0").val()+"").remove(); 
       if($("#tipo_form").text().trim() > 1)
        $("#contenido_"+$("#source0").val()+"").text(server.json); 
	showArea(6);
	$("#reseform").click();
      }
      else
       alert("Hubo un error vuelve a intentarlo")
	 $("#form-control").prop("disabled",true)
   }
  }); //ajax
 });
}
