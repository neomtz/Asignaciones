var tipoAsignaciones = '';
var rutaGrupos = 'GruposI';
var filtrosCargados = false;
$(document).ready(function ()
{
  console.log('s');
  if(sessionStorage.getItem("source"))
  {
    if(sessionStorage.getItem("ocultar") == 1)
     $(".cabecera").hide()
    $("#programadas").click();
    abre(1);
    getBrand()
    if(sessionStorage.getItem("source") == "031d4e943f78cba56dd84f1146422250e8c72448")
    {
      rutaGrupos = 'GruposE';
      $("#ctnImportador").show();
    }
    else {
      if(sessionStorage.getItem("source") == "ea53c16994c5e1ce9f12c64165036b1c7b1b0eff165789367e968522250ef6599cca083d" || sessionStorage.getItem("source") == "74452baadc5779020cf126d8bee3ae0552b86ef5850d1e08f3c4f8e0482783dc80754dff")
        $("#ctnImportador").show();

    }
  }
  else {
    console.log("no hay session")
  }
});
function calendario(opciones)
{

   tipoAsignaciones = opciones;
  $('#calendar').fullCalendar(
  {
      eventStartEditable: false,
      fixedWeekCount: false,
	  editable: true,
	  eventLimit: true, // allow "more" link when too many events
      lang: 'es',
      header:
      {
       left: 'prev,next today',
       center: 'title',
       right: 'month',
      },
    dayClick: function(date, jsEvent, view)
    {
    }
  });
  $('#calendar').fullCalendar('removeEvents');
var momento = $('#calendar').fullCalendar('getDate');
  momento = momento.format();
  momento = momento.split("-");
 $("#fechaBusqueda").text(momento[0]+'-'+momento[1]);
  $('.fc-corner-right').click(function(event)
  {
   var momento = $('#calendar').fullCalendar('getDate');
    momento = momento.format();
    momento = momento.split("-");
   $("#fechaBusqueda").text(momento[0]+'-'+momento[1]);
   getAsignaciones();
  });
  $('.fc-corner-left').click(function(event)
  {
   var momento = $('#calendar').fullCalendar('getDate');
    momento = momento.format();
    momento = momento.split("-");
   $("#fechaBusqueda").text(momento[0]+'-'+momento[1]);
   getAsignaciones();
  });
  if(tipoAsignaciones == '12345')
   getUsuarios();
  else
   getAsignaciones();
}

 function abre(a)
 {
 if (a==1)
 {
  var formulario = '<input class="form-control" id="lista_sucursal"  placeholder="Usuario ..." list="listaUsuario">';
  if(sessionStorage.getItem("source") == "74452baadc5779020cf126d8bee3ae0552b86ef5850d1e08f3c4f8e0482783dc80754dff")
   formulario += ' <select class="form-control" id="5dd55d88cb5aa"><option value="5dd5657810ae0">Eveladores 1</option></select> <input placeholder="Comentario" id="mailComentario" class="form-control"/> ';
   formulario +='<br>';
    formulario += '<div class="form-group" id="conjunto_1"><input class="form-control formulario1" id="sucursal1" placeholder="Sucursal ..." list="listaSucursal">';
   formulario += '<input class="form-control formulario1" id="checklist1" placeholder="Checklist ..." list="listaChecklist" />';
   formulario += '<input class="form-control formulario1" id="grupos1" placeholder="Grupos ..." list="listaGrupos" />';
   formulario += '<input type="date" id="date1" class="form-control formulario1" placeholder=""/><input type="date" id="datef1" class="form-control formulario1" placeholder=""/><input type="time" id="time1" class="form-control formulario1" placeholder=""/><input type="time" id="timef1" class="form-control formulario1" placeholder=""/><button type="button" class="btn btn-light" id="btnMas" ultimo="1"><i class="fa fa-plus"></i></button>  </div>';
  $("#Fusuario").html(formulario);
  $("#a").css('background-color', sessionStorage.getItem("backColor"));
  $("#b").css('background-color', '#C9C9C9');
  $("#c").css('background-color', '#C9C9C9');
  $("#programarmodal").attr("onclick", "programar(1)");
  $("#btnMas").attr("onclick", "mas(1)");
 }
 if (a==2)
 {
  var formulario = '<input class="form-control" id="lista_sucursal"  placeholder="Sucursal ..." list="listaSucursal"/><br>';
    formulario += '<div class="form-group"><input class="form-control formulario1" id="sucursal1" placeholder="Usuario ..." list="listaUsuario">';
   formulario += '<input class="form-control formulario1" id="checklist1" placeholder="Checklist ..." list="listaChecklist" />';
   formulario += '<input class="form-control formulario1" id="grupos1" placeholder="Grupos ..." list="listaGrupos" />';
   formulario += '<input type="date" id="date1" class="form-control formulario1" placeholder=""/><input type="date" id="datef1" class="form-control formulario1" placeholder=""/><button type="button" class="btn btn-default" id="btnMas"><span class="glyphicon glyphicon-plus-sign"></span></button>  </div>';
  $("#Fusuario").html(formulario);
  $("#a").css('background-color', '#C9C9C9');
  $("#b").css('background-color', sessionStorage.getItem("backColor"));
  $("#c").css('background-color', '#C9C9C9');
  $("#programarmodal").attr("onclick", "programar(2)");
  $("#btnMas_1").attr("onclick", "mas(2)");
 }
}
//las siguientes funciones reemplazan la funcion listas(tipo)

function getUsuarios()
{
  var token = sessionStorage.getItem("source");
  if(token == '031d4e943f78cba56dd84f1146422250e8c72448')
  token = '7c3983f1e14a8ac35b35ee8b2d0ea8ae368f17bb47b4a5dd6706cbe9bfb2e842fcb2f033';
		$.ajax(
	  {
	   type: "POST", // aqui defino el canal de envio de datos GET o POST
	   dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
	   url: "http://52.117.21.213/Jaguar/Usuarios/GET/?source=lista&source2=getall",
		 data: { token:  token}, // url hacia el controlado
		  beforeSend: function(event)
		 {
		   $("#site_active_indicador").text('1');
	   },
	   success: function(server)
	   {
		   $.each(server,function(a,b)
		   {
				 var lista='<option data-id="'+b.id_empleado+'" value="'+b.nombre+'" correo="'+b.correo+','+b.correopersonal+'"></option>';
				 $('#listaUsuario').append(lista);
		   });
		 $("#site_active_indicador").text('0');
		getChecklists(); //finaliza la petición y encadeno la siguiente esta es una buena practica.
	   },
	   error: function(e)
	   {
		   //console.log(e);
		   $("#site_active_indicador").text('0');
	   }
	  }); //ajax
}
function getChecklists2()
{
			$.ajax(
			{
			 type: "POST", // aqui defino el canal de envio de datos GET o POST
			 dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
			 url: "../API/GET/?source1=checklist&source2=getsec",
			 data:{ source: sessionStorage.getItem("source") },// url hacia el controlado
				beforeSend: function(event)
			 {
				 $("#site_active_indicador").text('1');
			 },
			 success: function(server)
			 {
				 $.each(server,function(a,b)
				 {
					 var lista='<option data-id="'+b.id+'" value="'+b.nombre+'"></option>';
					 $('#listaChecklist').append(lista);
				 });
			 $("#site_active_indicador").text('0');
			  getSucursales();//finaliza la petición y encadeno la siguiente esta es una buena practica.
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
  var token = sessionStorage.getItem("source");
  if(token == '031d4e943f78cba56dd84f1146422250e8c72448')
  token = '7c3983f1e14a8ac35b35ee8b2d0ea8ae368f17bb47b4a5dd6706cbe9bfb2e842fcb2f033';
			$.ajax(
				{
				 type: "POST", // aqui defino el canal de envio de datos GET o POST
				 dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
				 url: "http://52.117.21.213/Jaguar/Sucursales/GET/?source=sucursal&source2=getall",
				 data:{ source: token },// url hacia el controlado
					beforeSend: function(event)
				 {
					 $("#site_active_indicador").text('1');
				 },
				 success: function(server)
				 {
           if(server.secciones.length > 0)
           {
             $.each(server.secciones,function(a,b)
  					 {
  						 var lista='<option data-id="'+b.col1+'" value="'+b.col2+'"></option>';
               $('#listaSucursal').append(lista);
  						 $('#sucursal').append('<option value="'+b.col1+'">'+b.col2+'</option>');
  					 });
           }
				 $("#site_active_indicador").text('0');
				  getGrupos();
				 },
				 error: function(e)
				 {
					 //console.log(e);
					 $("#site_active_indicador").text('0');
				 }
				}); //ajax
}
function getGrupos()
{
			$.ajax(
				{
				 type: "POST", // aqui defino el canal de envio de datos GET o POST
				 dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
				 url: "http://52.117.21.213/Jaguar/GruposI/GET/?source=grupos&source2=datosgruposall",
				 data:{ token: sessionStorage.getItem("source") },// url hacia el controlado
					beforeSend: function(event)
				 {
					 $("#site_active_indicador").text('1');
				 },
				 success: function(server)
				 {
					 $.each(server,function(a,b)
					 {
						 var lista='<option data-id="'+b.id+'" value="'+b.nombre+'"></option>';
						 $('#listaGrupos').append(lista);
					 });
				 $("#site_active_indicador").text('0');
				  getAsignaciones();
				 },
				 error: function(e)
				 {
					 //console.log(e);
					 $("#site_active_indicador").text('0');
				 }
				}); //ajax
}
function getAsignaciones()
{

			$.ajax(
				{
				 type: "POST", // aqui defino el canal de envio de datos GET o POST
				 dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
				 url: "./GET/?source=asign&source2=getasignmes&source3="+tipoAsignaciones,
				 data:{ 'source': sessionStorage.getItem("source"), 'source1': '', 'source2':  $("#fechaBusqueda").text(), 'source3': $("#checklist").val(), 'source4': $("#sucursal").val() },// url hacia el controlado
					beforeSend: function(event)
				 {
	         $.LoadingOverlay("show",
{
  image	: "",
  fontawesome : "fa fa-spinner fa-pulse fa-1x fa-fw",
  text        :  "Cargando.. "
});
					 $("#site_active_indicador").text('1');
				 },
				 success: function(server)
				 {


        $("#calendar").fullCalendar('removeEvents');
           $("#asignaciones-tbody").empty();
           $(".xls").remove();
				   if(server.length > 0 )
				   {
             $("#tabla-asignaciones").find("tfoot.pie").empty();
             var i=0;
             var c=0;
             var j=0;
             var data=0;
				     var eventos = [];
					 $.each(server,function(a,b)
					 {
            let fechaf = new Date($.trim(b.col19));
            fechaf.setDate(fechaf.getDate() + 1);
					   var evento = {};
					   evento.id = b.col1;
					   evento.title = b.col14;
					   evento.description = 'Visita programada para del Checklist '+b.col7+' en la sucursal '+b.col13;
             evento.start = $.trim(b.col15);
					   evento.end = $.trim(fechaf);
					  // if(b.col0 == null)
              if(b.col0 == null)//modificaciones feb2021
					   {
					     evento.color = '#CCC';
					   }
					   else
					   {
					     evento.color = 'green';
					   }
					     evento.url = 'javascript:detalleAsignacion(\''+b.col1+'\',\''+b.col14+'\',\''+b.col8+'\',\''+b.col18+'\',\''+b.col7+'\',\''+b.col16+'\',\''+b.col0+'\',\''+evento.color+'\',\''+b.col4+'\',\''+b.col17+'\')';
					     eventos.push(evento);

               tablaAsignaciones(b.col14, b.col7, b.col4, b.col11);
               if(b.col11==5)
               {
                 i++;
                data+=parseInt(b.col16);

               }
               else {
                 j++
               }
               c++;
					 });

           var porciento = (parseInt(i)/ parseInt(c)) * 100;
             if(data==0&&i==0){
               promedio=0;
             }else{
             var promedio = parseInt(data) / parseInt(i);
           }
          // var total = Math.floor(p * pn)/100+ pn;
             $("#valor").text(i);
             $("#valor2").text(j);
             $("#totalAsign").text( (i+j) );
//             $("#valor3").text(Math.round(promedio)+'%');
//             $("#valor4").text(Math.round(porciento)+'%');
             var restante =100-porciento;
					$("#calendar").fullCalendar('addEventSource', eventos);
         $("#tabla-asignaciones").tableExport({
           formats: [ 'xls' ],
           bootstrap: true }) ;
           barChart(porciento, restante);
            $("#site_active_indicador").text('0');
            $("#contenedorExportar").html($(".xls"));
            $(".xls").removeClass("btn-default").addClass("btn-success")
            alertify.success("Cargamos "+server.length+" asignaciones");

				   }
           else
           {
             alertify.warning("No hay asignaciones este mes");
             $("#tabla-asignaciones").find("tfoot.pie").append('<tr><td colspan="4">No hay asignaciones este mes</td></tr>')
             $("#contenedorGrafico").html('');
           }
           $.LoadingOverlay("hide");
				 },
				 error: function(e)
				 {
					 //console.log(e);
					 $("#site_active_indicador").text('0');
				 }
				}); //ajax
}

function mas(a)
{
  var original = parseInt($("#btnMas").attr("ultimo"));
  if(a==1)
  {
   var contador= original + 1;
   $("#btnMas").html('<i class="fa fa-close"></i>').removeAttr("onclick").attr("onclick",'removerConjunto('+original+')').removeAttr("ultimo").removeAttr("id");
   var contmodal='<div class="form-group" id="conjunto_'+contador+'"><input class="form-control formulario'+contador+'" id="sucursal'+contador+'" placeholder="Sucursal ..." list="listaSucursal" /><input class="form-control formulario'+contador+'" id="checklist'+contador+'" placeholder="Checklist ..." list="listaChecklist" /><input class="form-control formulario'+contador+'" id="grupos'+contador+'" placeholder="Grupos ..." list="listaGrupos" /><input type="date" id="date'+contador+'" class="form-control formulario'+contador+'" placeholder=""/><input type="date" id="datef'+contador+'" class="form-control formulario'+contador+'" placeholder=""/><input type="time" id="time'+contador+'" class="form-control formulario'+contador+'" placeholder=""/><input type="time" id="timef'+contador+'" class="form-control formulario'+contador+'" placeholder=""/><button type="button" class="btn btn-light" id="btnMas" onclick="mas(1)" ultimo="'+contador+'"><i class="fa fa-plus"></i></button></div>';
  	$("#Fusuario").append(contmodal);
  }
  if(a==2)
  {
   var contador=  original + 1;
   var contmodal='<div class="form-group"><input class="form-control formulario'+contador+'" id="sucursal'+contador+'" placeholder="Usuario ..." list="listaUsuario" /><input class="form-control formulario'+contador+'" id="checklist'+contador+'" placeholder="Checklist ..." list="listaChecklist"/><input class="form-control formulario'+contador+'" id="grupos'+contador+'" placeholder="Grupos ..." list="listaGrupos" /><input type="date" id="date'+contador+'" class="form-control formulario'+contador+'" placeholder=""/><input type="date" id="datef'+contador+'" class="form-control formulario'+contador+'" placeholder=""/></div>';
  	$("#Fusuario").append(contmodal);
  }

}
function removerConjunto(id)
{
  $("#conjunto_"+id+"").remove();
}
function programar(tipo)
{
 var contador= $("#cuerpoNuevaAsignacion").find("div.form-group").length;
 for(var i = contador ; i > 0 ; i --)
 {
  if($("#sucursal"+i+"").val().trim() != "" && $("#checklist"+i+"").val().trim() != "" && $("#grupos"+i+"").val().trim() != "" && $("#date"+i+"").val().trim() != "" && $("#datef"+i+"").val().trim() != "")
  {
    $.LoadingOverlay("show",
    {
      image	: "",
      fontawesome : "fa fa-spinner fa-pulse fa-1x fa-fw",
      text        :  "Guardando formularios "
    });
    setAsignacion(i,tipo);
    return false;
  }
  else
  alertify.warning('Formulario vacío ...');
 }

}
function setAsignacion(i,tipo)
{
  let extras = '';
  if(sessionStorage.getItem("source") == "74452baadc5779020cf126d8bee3ae0552b86ef5850d1e08f3c4f8e0482783dc80754dff")
   extras = ',{"contenido":"'+$('#5dd55d88cb5aa').val()+'","columna":"5dd55d88cb5aa","etiqueta":"Equipo","tipo":"3"}';
 var json = '[{"contenido":"Sucursal: '+$('#sucursal'+i).val()+'","columna":"0","etiqueta":"Info","tipo":"0"}'+extras+']';
 var idusuario = $('#listaUsuario option[value ="'+$('#lista_sucursal').val()+'"]').attr("data-id");
 var idsucursal = $('#listaSucursal option[value ="'+$('#sucursal'+i).val()+'"]').attr('data-id');
 var idchecklist = $('#listaChecklist option[value ="'+$('#checklist'+i).val()+'"]').attr('data-id');
 var idgrupo = $('#listaGrupos option[value ="'+$('#grupos'+i).val()+'"]').attr('data-id');
 var fecha = $('#date'+i).val();
 var fechaf = $('#datef'+i).val();
 var time = $('#time'+i).val();
 var timef = $('#timef'+i).val();
 var dataPost={source1:idchecklist, source2:idgrupo, source3:idsucursal, source4:idusuario, source5:fecha, source55:fechaf,source6:'', source7:'4', source: sessionStorage.getItem("source"),'sourcejson': json,source8:time, source9:timef }
 if(tipo == 2)
 {
  idusuario = $('#listaSucursal option[value ="'+$('#lista_sucursal').val()+'"]').attr("data-id");
  idsucursal = $('#listaUsuario option[value ="'+$('#sucursal'+i).val()+'"]').attr('data-id');
  idgrupo = $('#listaGrupos option[value ="'+$('#grupos'+i).val()+'"]').attr('data-id');
  dataPost={ 'source1':idchecklist, 'source2':idgrupo, 'source3':idusuario, 'source4':idsucursal, 'source5':fecha,'source55':fechaf, 'source6':'', 'source7':'4', 'source': sessionStorage.getItem("source"), 'sourcejson': json,'source8':time, 'source9':timef}
 }
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "./POST/?source=asign&source2=setasign",
   data: dataPost,
   beforeSend: function(event)
   {
	   $("#site_active_indicador").text('1');

   },
   success: function(server)
   {
     if(server.status == 'ok')
     {
	$(".formulario"+i+"").val("")
      if(i == 1)
      {
        alertify.success("Guardado, actualizado")
        sendMail($('#listaUsuario option[value ="'+$('#lista_sucursal').val()+'"]').attr("correo"),'','',server.id,i)
        setPushnotification(idusuario);
      }
      else
      {
	alertify.success('Guardado');
	programar();
      }
     }
     else
	   alert("Error al guardar");
	 $("#site_active_indicador").text('0');
   $.LoadingOverlay("hide");
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax
}
function setPushnotification(idUsuario){
   $.ajax(
        {
        type: "POST",
        dataType: "JSON",
        url: "../API/POST/?source1=push&source2=usuario",
        data: { 'source': sessionStorage.getItem("source"), 'source1': idUsuario,'source2':'Mantenimiento','source3':3,'source4':'asignación'},
        beforeSend: function(event)
        {
	   $("#site_active_indicador").text('1');
        },
        success: function(server)
        {
          console.log(server)
        },
        error: function(e)
        {
	   $("#site_active_indicador").text('0');
        }
      }); //ajax
}
function editarAsignacion(id)
{
	$("#editarAsignacion").modal('show');
   $("#formEditar").attr('src','.//Editar.html?source='+sessionStorage.getItem("source")+'&source1='+id+'&source2=externo')
}

function editarAsignacion(id)
{
	$("#editarAsignacion").modal('show');
   $("#formEditar").attr('src','.//Editar.html?source='+sessionStorage.getItem("source")+'&source1='+id+'&source2=externo')
}

function tablaAsignaciones(usuario, checklist, fecha, estado){

var fechad= fecha.split(" ", 1);
var data='<tr><td>'+usuario+'</td><td>'+checklist+'</td>'
data+='<td>'+fechad+'</td>'
if(estado==4){
data+='<td>pendiente</td></tr>'
}
if(estado==5){
data+='<td>realizado</td></tr>'
}
$('#asignaciones-tbody').append(data);

}

function Filtrar(){
  $("#valor").html('');
  $("#valor2").html('');
  $("#valor3").html('');
  $("#valor4").html('');


var token = sessionStorage.getItem("source");
 var idg = $('#listaGrupos option[value ="'+$('#grupoF').val()+'"]').attr("data-id");
  var idu = $('#listaUsuario option[value ="'+$('#usuarioF').val()+'"]').attr("data-id");
   var ids = $('#listaSucursal option[value ="'+$('#sucursalF').val()+'"]').attr("data-id");
   if($('#grupoF').val()==""){
     idg="";
   }
   if($('#usuarioF').val()==""){
     idu="";
   }
   if($('#sucursalF').val()==""){
     ids="";
   }
  $('#calendar').fullCalendar('removeEvents');
$(".btn-round").text('0')
    $.ajax(
  				{
  				 type: "POST", // aqui defino el canal de envio de datos GET o POST
  				 dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
  				 url: "./GET/?source=asign&source2=getfiltro",
  				 data:{source: token, source1:idg ,source2:idu ,source3:ids  },// url hacia el controlado
  					beforeSend: function(event)
  				 {

  					 $("#site_active_indicador").text('1');
  				 },
  				 success: function(server)
  				 {

             $("#asignaciones-tbody").empty()

             if(server.length > 0 )
  				   {
               var i=0;
               var c=0;
               var j=0;
               var data=0;
  				     var eventos = [];
  					 $.each(server,function(a,b)
  					 {
               let fechaf = new Date($.trim(b.col19));
               fechaf.setDate(fechaf.getDate() + 1);
  					   var evento = {};
  					   evento.id = b.col1;
  					   evento.title = b.col14;
  					   evento.description = 'Visita programada para del Checklist '+b.col7+' en la sucursal '+b.col13;
               evento.start = $.trim(b.col15);
  					   evento.end = $.trim(fechaf);
  					   if(b.col0 == null)
  					   {
  					     evento.color = '#CCC';
  					   }
  					   else
  					   {
  					     evento.color = 'green';
  					   }
					     evento.url = 'javascript:detalleAsignacion(\''+b.col1+'\',\''+b.col14+'\',\''+b.col8+'\',\''+b.col18+'\',\''+b.col7+'\',\''+b.col16+'\',\''+b.col0+'\',\''+evento.color+'\')';
  					     eventos.push(evento);

                 tablaAsignaciones(b.col14, b.col7, b.col4, b.col11);
                 if(b.col11==5)
                 {
                   i++;
                  data+=parseInt(b.col16);

                 }
                 else {
                   j++
                 }
                 c++;
  					 });

             var porciento = (parseInt(i)/ parseInt(c)) * 100;
             if(data==0&&i==0){
               promedio=0;
             }else{
             var promedio = parseInt(data) / parseInt(i);
           }
            // var total = Math.floor(p * pn)/100+ pn;
               $("#valor").text(i);
               $("#valor2").text(j);
               $("#valor3").text(Math.round(promedio)+'%');
               $("#valor4").text(Math.round(porciento)+'%');
               var restante =100-porciento;
  					$("#calendar").fullCalendar('addEventSource', eventos);
          }
	 $(".xls").remove();
          var table = $("#tabla-asignaciones").tableExport({
            formats: [ 'xls' ],
          bootstrap: true });
             //$("#tabla-asignaciones").reset();
             table.reset();
               barChart(porciento, restante);

  					$.LoadingOverlay("hide");



  				 $("#site_active_indicador").text('0');
         },
  				 error: function(e)
  				 {
  					 //console.log(e);
  					 $("#site_active_indicador").text('0');
  				 }
  				}); //ajax
}
function detalleAsignacion(id,usuario,grupo,sucursal,checklist,total,idReporte,color,fechai,fechaf)
{
  //console.log(id);
 $("#detalleAsignacion").find("div.modal-content").css("border-color",color);
 $("#detalleAsignacion").find("div.modal-header").css("border-color",color);
 $("#detalleAsignacion").find("div.modal-header").text(usuario);
$("#checkUser").val(usuario);
$("#objUser").val(grupo);
$("#sucursalUser").val(sucursal);
$("#idAsignacion").val(id);
$("#fechaiUser").val(fechai);
if(fechaf == 'null' )
$("#fechafUser").val("Pendiente");
else
$("#fechafUser").val(fechaf);
$("#").val('Checklist: '+checklist+'</p>');
  if(idReporte != "null"){
   $("#linkReporte").removeAttr("href").attr('href','../'+sessionStorage.getItem("nombreEmpresa")+'/reporteTemporal.php?source='+idReporte).show();
$("#btneliminar").removeAttr("onclick");
}
  else{
   $("#linkReporte").removeAttr("href").hide();
    $("#btneliminar").attr("onclick",'delAsignaciones(\''+id+'\')');
 }
 $("#detalleAsignacion").modal("show");
}


function barChart(realizadas, norealizadas)
{
  $("#contenedorGrafico").html('<canvas id="myChart" width="400" height="150"></canvas>');
   var ctx = document.getElementById("myChart").getContext('2d');
   var myChart = new Chart(ctx, {
     type: 'bar',
     data: {
         labels: ["% Realizadas", "% No Realizadas"],
         datasets: [{
             label: '% Asignaciones realizadas',
             data: [realizadas, norealizadas],
             backgroundColor: [
               'rgba(0,128,0, 0.2)',
                 'rgba(201, 203, 207, 0.2)'

             ],
             borderColor: [
               'rgba(0,128,0, 1)',
                 'rgba(201, 203, 207,1)'
             ],
             borderWidth: 1
         }]
     },
     options: {
       legend: {
               display: false
           },
           tooltips: {
               callbacks: {
                  label: function(tooltipItem) {
                         return tooltipItem.yLabel;
                  }
               }
           },

       title: {
            display: true,
            text: 'Porcentaje de Estado de las Asignaciones'
          },
         scales: {
             yAxes: [{
                 ticks: {
                   suggestedMax: 100,
                     beginAtZero:true
                 }
             }]
         }
     }
   });
}
function visualizacion(opt)
{
  $(".contenedor").hide();
  if($("#visualizar").hasClass("btn-secondary"))
  {
    $("#visualizar").removeClass("btn-secondary").addClass("btn-primary");
    $("#contenedorCalendario").show();
  }
  else
  {
    $("#visualizar").removeClass("btn-primary").addClass("btn-secondary");
    $("#contenedorTabla").show();
  }
}
function getBrand()
{
  $.ajax(
    {
     type: "POST", // aqui defino el canal de envio de datos GET o POST
     dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
     url: "./GET/?source=asign&source2=getbrand",
     data: { 'source': sessionStorage.getItem("source") }, // url hacia el controlado
     beforeSend: function(event)
     {
       $("#site_active_indicador").text('1');
     },
     success: function(server)
     {
       $(".brand").css('backgroundColor',server.brand);
       $(".btn-primary").css('backgroundColor',server.brand);
       $("#programarmodal").css('backgroundColor',server.brand);
       $(".btn-round").css('borderColor',server.brand);
       $(".fc-widget-header").css('backgroundColor',server.brand)
       sessionStorage.setItem("nombreEmpresa",server.nombreEmpresa)
       sessionStorage.setItem("backColor",server.brand)
      },
     error: function(e)
     {
             //console.log(e);
             $("#site_active_indicador").text('0');
     }
  }); //ajax
}
function sendMail(correo,idReporte,sucursal,idAsignacion,i)
{
  alert("enviando mail a "+correo+" mas com")
 if(correo == 'soporte@'+sessionStorage.getItem("nombreEmpresa")+'')
   correo = 'soporte@jarboss.com';
 var cuerpo = '<br>Buen día<br><br>Se te asignó un checklist <br><br>';
 cuerpo += 'Puedes realizar el reporte desde tu aplicación Jarboss work disponible para Android/IOS <br><br>';
 cuerpo += $("#mailComentario").val();
 var titulo = 'Asignación de checklist '+$('#sucursal'+i).val();
$.ajax({
        type:"POST",
        dataType: "JSON",
        url: "../Notificaciones/POST/?source1=notificacion&source2=mail",
        data: {"source": sessionStorage.getItem("source"), "source1": correo, "source2": cuerpo , "source3": titulo, "source4": sessionStorage.getItem("nombreEmpresa") },
        beforeSend: function()
        {        },
        success: function(server)
        {
          if(server.status == 'ok')
          {
              alertify.success("Correo enviado.")
          }
          else {
            alertify.error("No pudimos enviar el correo..")
          }
        },
        error: function(e)
        {        }
      });
}

function delAsignaciones(id){
  $.ajax({
          type:"POST",
          dataType: "JSON",
          url: "./POST/?source=asign&source2=delasignid",
          data: {"source": sessionStorage.getItem("source"),"source1":id},
          beforeSend: function()
          {        },
          success: function(server)
          {
            if(server.status == 'ok')
            {
                alertify.success("Se ha eliminado correctamente.");
                getAsignaciones();
                $("#detalleAsignacion").modal("hide");
            }
            else {
              alertify.error("No pudimos eliminar la asignación..")
            }
          },
          error: function(e)
          {        }
        });
}
function getChecklists()
{
/*  if(!validarConexion())
  {
    alertify.error('No hay conexiÃ³n a internet.');
    return false;
  }*/
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./GET/?source1=ticket&source2=checklists",
      data: { 'source': sessionStorage.getItem("source"), 'source1': sessionStorage.getItem("idUsuario") },
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
        if(server.length > 0)
        {
	 var ids = [];
          $.each(server,function(a,b)
          {
              $("#checklist").append('<option value="'+b.id+'">'+b.nombre+'</option>')
              $("#listaChecklist").append('<option data-id="'+b.id+'" value="'+b.nombre+'"></option>');
		ids.push(b.id);
          });
              $("#checklist").prepend('<option value="'+ids.join("','")+'" selected>Todos</option>')
			  getSucursales();//finaliza la petición y encadeno la siguiente esta es una buena practica.
        }
	else
	 alertify.warning('No cuentas con checklist ...', {dialogSize: 'sm', progressType: 'default'});
      },
      timeout: 10000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("OcurriÃ³ en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La peticiÃ³n tardo demasiado Â¿deseas volver a intentarlo?', function()
            {
              getValidateId();
            },
            function()
            {
              alertify.warning('Intentalo mÃ¡s tarde.')
            });
          }
       }
   });
}
// FUNCIONES PARA IMPORTADOR MASIVA
$('#load_excel_form').on('submit', function(event){
    event.preventDefault();
    if ($("#documento").val()=="") {
      alertify.error("Selecciona el documento a importar")
    }
    else{
    $.ajax({
      type: "POST",
      url: "./POST/?source1=importadorIstesa",
      data:new FormData(this),
      contentType:false,
      cache:false,
      processData:false,
      success:function(server)
      {
        alertify.success('Asignación creada');
        $("#upload_imagen").modal('hide');
        getAsignaciones();
      }
    });
}
  });
