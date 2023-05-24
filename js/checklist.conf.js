function getUsuarioChecklist(objetivo)
{
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://www.jarboss.com/Indicadores/GET/?source=lista&source2=getchecklist",
   data: "source1="+$.get("source"),
   beforeSend: function(event)
   {
           $("#site_active_indicador").text('1');
   },
   success: function(server)
   {
    if(server.length > 0)
    {
     $.each(server,function(a,b)
     {
       var  interfaz = '<option value="'+b.id+'" selected>'+b.nombre+'</option>';
       $("#"+obejtivo+"").append(interfaz);
     });
    }
    else
        alertify.error("No tiene checklist asignados")
  //     window.location.href="./demo.html";
         $("#site_active_indicador").text('0');
   },
   error: function(e)
   {
           $("#site_active_indicador").text('0');
   }
  }); //ajax
}
