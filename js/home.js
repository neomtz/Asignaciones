function calendario()
{
 waitingDialog.show('Cargando datos ...', {dialogSize: 'sm', progressType: 'default'});
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
 getUsuarios();
}

 function abre(a)
 {
 if (a==1)
 {
  var formulario = '<input class="form-control" id="lista_sucursal"  placeholder="Usuario ..." list="listaUsuario"><br>';
    formulario += '<div class="form-group"><input class="form-control formulario1" id="sucursal1" placeholder="Sucursal ..." list="listaSucursal">';
   formulario += '<input class="form-control formulario1" id="checklist1" placeholder="Checklist ..." list="listaChecklist" />';
   formulario += '<input class="form-control formulario1" id="grupos1" placeholder="Grupos ..." list="listaGrupos" />';
   formulario += '<input type="date" id="date1" class="form-control formulario1" placeholder=""/><button type="button" class="btn btn-default" id="btnMas"><span class="glyphicon glyphicon-plus-sign"></span></button>  </div>';
  $("#Fusuario").html(formulario);
  $("#a").css('background-color', '#dc4034');
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
   formulario += '<input type="date" id="date1" class="form-control formulario1" placeholder=""/><button type="button" class="btn btn-default" id="btnMas"><span class="glyphicon glyphicon-plus-sign"></span></button>  </div>';
  $("#Fusuario").html(formulario);
  $("#a").css('background-color', '#C9C9C9');
  $("#b").css('background-color', '#dc4034');
  $("#c").css('background-color', '#C9C9C9');
  $("#programarmodal").attr("onclick", "programar(2)");
  $("#btnMas").attr("onclick", "mas(2)");
 }
}
//las siguientes funciones reemplazan la funcion listas(tipo)

function getUsuarios()
{
		$.ajax(
	  {
	   type: "POST", // aqui defino el canal de envio de datos GET o POST
	   dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
	   url: "https://www.jarboss.com/Usuarios/GET/?source=lista&source2=getall",
		 data: { token: $_get("source") }, // url hacia el controlado
		  beforeSend: function(event)
		 {
		   $("#site_active_indicador").text('1');
	   },
	   success: function(server)
	   {
		   $.each(server,function(a,b)
		   {
				 var lista='<option data-id="'+b.id_empleado+'" value="'+b.nombre+'"></option>';
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
function getChecklists()
{
			$.ajax(
			{
			 type: "POST", // aqui defino el canal de envio de datos GET o POST
			 dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
			 url: "https://www.jarboss.com/API/GET/?source1=checklist&source2=getsec",
			 data:{ source: $_get("source") },// url hacia el controlado
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
			$.ajax(
				{
				 type: "POST", // aqui defino el canal de envio de datos GET o POST
				 dataType: "JSON", // aqui determino el tipo de dato en el que me debe responder el servidor, puede ser html /text / xml
				 url: "https://www.jarboss.com/Sucursales/GET/?source=sucursal&source2=getall",
				 data:{ source: $_get("source") },// url hacia el controlado
					beforeSend: function(event)
				 {
					 $("#site_active_indicador").text('1');
				 },
				 success: function(server)
				 {
					 $.each(server.secciones,function(a,b)
					 {
						 var lista='<option data-id="'+b.col1+'" value="'+b.col2+'"></option>';
						 $('#listaSucursal').append(lista);
					 });
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
				 url: "https://www.jarboss.com/GruposI/GET/?source=grupos&source2=datosgruposall",
				 data:{ token: $_get("source") },// url hacia el controlado
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
				 url: "https://jarboss.com/Asignaciones/GET/?source=asign&source2=getasignmes&source3=12345",
				 data:{ 'source': $_get("source"), 'source1': '', 'source2':  $("#fechaBusqueda").text() },// url hacia el controlado
					beforeSend: function(event)
				 {
	waitingDialog.show('Cargando ..',{dialogSize: 'sm', progressType: 'default'});
					 $("#site_active_indicador").text('1');
				 },
				 success: function(server)
				 {
				   if(server.length > 0 )
				   {
             var i=0;
             var c=0;
             var j=0;
             var data=0;
				     var eventos = [];
					 $.each(server,function(a,b)
					 {

					   var evento = {};
					   evento.id = b.col1;
					   evento.title = b.col14;
					   evento.description = 'Visita programada para del Checklist '+b.col7+' en la sucursal '+b.col13;
					   evento.start = $.trim(b.col15);
					   if(b.col0 == null)
					   {
					     evento.color = '#CCC';
					   }
					   else
					   {
					     evento.color = 'green';
					   }
					     evento.url = 'javascript:detalleAsignacion(\''+b.col14+'\',\''+b.col8+'\',\''+b.col18+'\',\''+b.col7+'\',\''+b.col16+'\',\''+b.col0+'\',\''+evento.color+'\')';
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
					$('#calendar').fullCalendar('removeEvents');
					$("#calendar").fullCalendar('addEventSource', eventos);
				   }
					waitingDialog.hide();
	 $(".xls").remove();
          $("#tabla-asignaciones").tableExport({
            formats: [ 'xls' ],
            bootstrap: true }) ;

            barChart(porciento, restante);
				 $("#site_active_indicador").text('0');

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

if(a==1)
{
 var contador=$(".form-group").length + 1;
 var contmodal='<div class="form-group"><input class="form-control formulario'+contador+'" id="sucursal'+contador+'" placeholder="Sucursal ..." list="listaSucursal" /><input class="form-control formulario'+contador+'" id="checklist'+contador+'" placeholder="Checklist ..." list="listaChecklist" /><input class="form-control formulario'+contador+'" id="grupos'+contador+'" placeholder="Grupos ..." list="listaGrupos" /><input type="date" id="date'+contador+'" class="form-control formulario'+contador+'" placeholder=""/></div>';
	$("#Fusuario").append(contmodal);
}
if(a==2)
{
 var contador= $(".form-group").length + 1;
 var contmodal='<div class="form-group"><input class="form-control formulario'+contador+'" id="sucursal'+contador+'" placeholder="Usuario ..." list="listaUsuario" /><input class="form-control formulario'+contador+'" id="checklist'+contador+'" placeholder="Checklist ..." list="listaChecklist"/><input class="form-control formulario'+contador+'" id="grupos'+contador+'" placeholder="Grupos ..." list="listaGrupos" /><input type="date" id="date'+contador+'" class="form-control formulario'+contador+'" placeholder=""/></div>';
	$("#Fusuario").append(contmodal);
}

}
function programar(tipo)
{
 var contador= $(".form-group").length;
 for(var i = contador ; i > 0 ; i --)
 {
  if($("#sucursal"+i+"").val().trim() != "" && $("#checklist"+i+"").val().trim() != "" && $("#grupos"+i+"").val().trim() != "" && $("#date"+i+"").val().trim() != "")
  {
    waitingDialog.show('Guardando  formulario '+i+' ...', {dialogSize: 'sm', progressType: 'default'});
    setAsignacion(i,tipo);
    return false;
  }
  else
  waitingDialog.changeMessage('Formulario vacío ...');
 }

}
function setAsignacion(i,tipo)
{
 var json = '[{"contenido":"Sucursal: '+$('#sucursal'+i).val()+'","columna":"0","etiqueta":"Info","tipo":"0"}]';
 var idusuario = $('#listaUsuario option[value ="'+$('#lista_sucursal').val()+'"]').attr("data-id");
 var idsucursal = $('#listaSucursal option[value ="'+$('#sucursal'+i).val()+'"]').attr('data-id');
 var idchecklist = $('#listaChecklist option[value ="'+$('#checklist'+i).val()+'"]').attr('data-id');
 var idgrupo = $('#listaGrupos option[value ="'+$('#grupos'+i).val()+'"]').attr('data-id');
 var fecha = $('#date'+i).val();
 var dataPost={source1:idchecklist, source2:idgrupo, source3:idsucursal, source4:idusuario, source5:fecha, source6:'', source7:'4', source: $_get("source"),'sourcejson': json }
 if(tipo == 2)
 {
  idusuario = $('#listaSucursal option[value ="'+$('#lista_sucursal').val()+'"]').attr("data-id");
  idsucursal = $('#listaUsuario option[value ="'+$('#sucursal'+i).val()+'"]').attr('data-id');
  idgrupo = $('#listaGrupos option[value ="'+$('#grupos'+i).val()+'"]').attr('data-id');
  dataPost={ 'source1':idchecklist, 'source2':idgrupo, 'source3':idusuario, 'source4':idsucursal, 'source5':fecha, 'source6':'', 'source7':'4', 'source': $_get("source"), 'sourcejson': json}
 }
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "https://www.jarboss.com/Asignaciones/POST/?source=asign&source2=setasign",
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
	waitingDialog.changeMessage('Guardado, actualizando ...');
		getAsignaciones();
      }
      else
      {
	waitingDialog.changeMessage('Guardado');
	programar();
      }
     }
     else
	   alert("Error al guardar")
	 $("#site_active_indicador").text('0');
   },
   error: function(e)
   {
	   //console.log(e);
	   $("#site_active_indicador").text('0');
   }
  }); //ajax
}
function editarAsignacion(id)
{
	$("#editarAsignacion").modal('show');
   $("#formEditar").attr('src','https://www.jarboss.com/Asignaciones/Editar.html?source='+$_get("source")+'&source1='+id+'&source2=externo')
}

function editarAsignacion(id)
{
	$("#editarAsignacion").modal('show');
   $("#formEditar").attr('src','https://www.jarboss.com/Asignaciones/Editar.html?source='+$_get("source")+'&source1='+id+'&source2=externo')
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


var token = $_get("source");
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
  				 url: "https://jarboss.com/Asignaciones/GET/?source=asign&source2=getfiltro",
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

  					   var evento = {};
  					   evento.id = b.col1;
  					   evento.title = b.col14;
  					   evento.description = 'Visita programada para del Checklist '+b.col7+' en la sucursal '+b.col13;
  					   evento.start = $.trim(b.col15);
  					   if(b.col0 == null)
  					   {
  					     evento.color = '#CCC';
  					   }
  					   else
  					   {
  					     evento.color = 'green';
  					   }
					     evento.url = 'javascript:detalleAsignacion(\''+b.col14+'\',\''+b.col8+'\',\''+b.col18+'\',\''+b.col7+'\',\''+b.col16+'\',\''+b.col0+'\',\''+evento.color+'\')';
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

  					waitingDialog.hide();



  				 $("#site_active_indicador").text('0');
         },
  				 error: function(e)
  				 {
  					 //console.log(e);
  					 $("#site_active_indicador").text('0');
  				 }
  				}); //ajax
}
function detalleAsignacion(usuario,grupo,sucursal,checklist,total,idReporte,color)
{
 $("#detalleAsignacion").find("div.modal-content").css("border-color",color);
 $("#detalleAsignacion").find("div.modal-header").css("border-color",color);
 $("#detalleAsignacion").find("div.modal-body").empty();
 $("#detalleAsignacion").find("div.modal-body").append('<p>Usuario: '+usuario+'</p>');
 $("#detalleAsignacion").find("div.modal-body").append('<p>Grupo: '+grupo+'</p>');
 $("#detalleAsignacion").find("div.modal-body").append('<p>Sucursal: '+sucursal+'</p>');
 $("#detalleAsignacion").find("div.modal-body").append('<p>Checklist: '+checklist+'</p>');
  if(idReporte != "null")
    $("#detalleAsignacion").find("div.modal-body").append('<p>Resultado: '+total+' <a target="_blank" href="https://jarboss.com/Soriana.com/reporteTemporal.php?source='+idReporte+'">ver reporte</a></p>');
  else
    $("#detalleAsignacion").find("div.modal-body").append('<p>Resultado: Pendiente</p>');
 $("#detalleAsignacion").modal("show");
}


function barChart(realizadas, norealizadas){
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
