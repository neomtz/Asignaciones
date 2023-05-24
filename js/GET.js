$(document).ready(function()
{
$("#jb_contenedor_mostrar_varios").show();
  $.get("./items.html", function(htmlexterno)
  {
   $("#site_area_editar").html(htmlexterno);
    setTimeout('getItems(1)',100);
    setTimeout('getUsuarios()',1000);
    setFormSet();
  });
});
function showArea(opt)
{
 $("#resetform").click();
 if(opt == 6)
  $("#site_area_editar").hide();
   
 if(opt == 0)
 {
  $("#site_area_editar").show();
  $("#source5").show();
  $("#site_guardar_im").hide();
  $("#site_editar_im").removeClass("hidden");
  $("#sourcelab0").removeClass("hidden");
  $("#sourcelab5").removeClass("hidden");
  $("#source5").removeClass("hidden");
  $("#source0").removeClass("hidden").attr("disabled",true);
 }
 if(opt == 1)
 {
  $(".form-control").prop("disabled",false); 
  $("#site_area_editar").show();
  $("#primerColumna").hide();
  $("#site_guardar_im").show();
  $("#site_editar_im").addClass("hidden");
  $("#sourcelab0").addClass("hidden");
  $("#sourcelab5").addClass("hidden");
  $("#source5").addClass("hidden");
  $("#source0").addClass("hidden");
 $("#tipo_form").text(0);
 }
 if(opt == 2)
 {
  $("#site_area_editar").hide();
  $("#primerColumna").show();
  $("#site_guardar_im").show();
  $("#site_editar_im").addClass("hidden");
  $("#sourcelab0").addClass("hidden");
  $("#sourcelab5").addClass("hidden");
  $("#source5").addClass("hidden");
  $("#source0").addClass("hidden");
 }
return false;
}
function getItems(opt)
{
 $("#tipo_form").text(opt);
 showArea(2);
 if(opt == 4 || opt == 5)
  $(".form-control").prop("disabled",true);
 else
  $(".form-control").prop("disabled",false); 
 var content = '';
  $.ajax({
   type: "POST",
   dataType: "JSON",
   url: "GET/?source=asign&source2=geti",
   data: "source1="+opt+"&source="+$_get("source"),
   success: function(server)
   {
     if(!$("#site_tbody_tickets").is(":empty"))
       $("#site_tbody_tickets").empty();
      if(server.length)
      {
        $.each(server, function(i,t)
        {
	 createInterfaceItems(t.col1,t.col2,t.col3,t.col4,t.col5,t.col10,opt);
        });
            $("#site_tbody_tickets").append(content);
      }
      else
       alert("No hay items");
            $("#jb_contenedor_mostrar_varios").hide();
   }
  }); //ajax
}
function setItems()
{
  $.ajax({
   type: "POST",
   dataType: "JSON",
   url: "POST/?source=asign&source2=geti",
   data: "source=1",
   success: function(server)
   {
      if(server.status == 'ok')
      {
	alert("Guardado")
      }
      else
       alert("No hay tickets que coincidan con la busqueda..");
   }
  }); //ajax

}
function getUsuarios()
{
 $.ajax({
   type: "GET",
   dataType: "JSON",
   url: "./GET/?source=asign&source2=getu",
   success: function(server)
   {
      if(server.length)
      {
       $('[name="source5"]').append('<option  value="" selected>Seleccionar</option>');
       $.each(server,function(i,t)
       {
         $('[name="source5"]').append('<option value="'+t.col1+'">'+t.col2+' </option>');
       });
      }
   }
 }); //ajax
}

function createInterfaceItems(id,id_aux,contenido,fecha,id_section,id_reporte,opt)
{
console.log(opt)
 var click = 'showDetalleItem(\''+id+'\')';
 if(opt == 5)
   click = 'window.open(\'../reporteTemporal.php?source='+id_reporte+'\')';
 var content = '';
 content += '<div class="jbItemBoxFlex" onclick="'+click+'"> <div id="'+id+'"><span>'+id+'</span>';
 content += '<span class="hidden" id="contenido_'+id+'">'+contenido+'</span><span class="hidden">'+fecha+'</span></div></div>';
 $("#site_tbody_tickets").append(content);
}
function showDetalleItem(id)
{
 showArea(0);
 var descripciones = JSON.parse($("#contenido_"+id+"").text());
 var elementos = $(".form-control")
 var desc = new Array();
 $.each(descripciones, function(i,t)
 {   desc.push(t);  });
 $.each(elementos, function(i,t)
 {
  var etiqueta = $(this).prop("tagName").toLowerCase();
  if(etiqueta == 'input')
  {
    var inputType = $(this).attr("type");
   if(inputType == 'text' || inputType == 'date')
   {
     $(this).val(desc[i])
   }
  }
  if(etiqueta == 'textarea')
  {
    $(this).val(desc[i])
  }
  if(etiqueta == 'select')
  {
	console.log(desc[i])
    $(this).val(desc[i])
//   $('[name="source'+i+'"] option[value="'+desc[i]+'"]').prop('selected', true);
  
  }
 });
}
