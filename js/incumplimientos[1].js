var filtrosCargados = false;
var URLactual=window.location;
// var contproceso = 0;
// var contterminado = 0;
$( document ).ready(function()
{
  if (sessionStorage.getItem("nombreEmpresa")=="Gpdesarrollos.com.mx" || sessionStorage.getItem("nombreEmpresa")=="Casaley.com.mx") {
    $("#slcSucursal").show();

  }
  console.log(URLactual.host);
  if (URLactual.host=="www.jarboss.com") {
    host="jarboss.com";
  }
  else {
    host="jarbossdev.com/Jaguar";
  }
  if(sessionStorage.getItem("ocultar") == 1)
   $(".cabecera").hide()
    $( function() {
      var dateFormat = "yy-mm-dd",
        from = $( "#from" )
          .datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: "yy-mm-dd"
          })
          .on( "change", function() {
            to.datepicker( "option", "minDate", getDate( this ) );
          }),
        to = $( "#to" ).datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1,
    dateFormat: "yy-mm-dd"
        })
        .on( "change", function() {
          from.datepicker( "option", "maxDate", getDate( this ) );
        });

      function getDate( element ) {
        var date;
        try {
          date = $.datepicker.parseDate( dateFormat, element.value );
        } catch( error ) {
          date = null;
        }

        return date;
      }
    } );
    $( "#from" ).datepicker({"dateFormat" : "yy-mm-dd"}).val($.datepicker.formatDate('yy-mm-dd', new Date()));
    $( "#to" ).datepicker({"dateFormat" : "yy-mm-dd"}).val($.datepicker.formatDate('yy-mm-dd', new Date()));
    let fechaGuardada = sessionStorage.getItem("fechaGuardada");
    let fechaGuardada1 = sessionStorage.getItem("fechaGuardada1");
    if (fechaGuardada !='' && fechaGuardada != null && fechaGuardada1 !='' && fechaGuardada1 != null) {
      $("#from").val(fechaGuardada)
      $("#to").val(fechaGuardada1)
    }

$.LoadingOverlay("show",
{
  image       : "",
  fontawesome : "fa fa-spinner fa-pulse fa-1x fa-fw",
  text        :  "Cargando.. "
});
  $("#buscar").submit(function(e)
  {
    e.preventDefault();
    if(!validarConexion())
    {
      alertify.error('No hay conexión a internet.');
      return false;
    }
    $(".cargarmas").remove();
    $(".separador").remove();
    $("#contenedorElementos").empty();
  $.LoadingOverlay("show",
{
  image       : "",
  fontawesome : "fa fa-spinner fa-pulse fa-1x fa-fw",
  text        :  "Cargando.. "
});
     $.ajax(
     {
         type: "POST",
         dataType: "JSON",
         url: "./GET/?source1=incumplimiento&source2=getincumplimientobuscar",
         data: { 'source1': $("#sourcetexto").val()},
         beforeSend: function(event)
         {
         },
         success: function(server)
         {
          if(server.length > 0)
          {
            let idRows = [];
           $.each(server,function(a,b)
           {
             idRows.push(b.idRow);
            var interfaz = interfaceIncumplimiento(b.id,b.nombre,b.idRow,b.fecha,b.idGrupo,b.idUsuario,b.asignacionId,b.asignacionFecha,b.resolucion,b.idChecklist,b.idSucursal);
            $("#contenedorElementos").append(interfaz);
           });
           $("#contenedorElementos").append('<tr class="cargarmas text-center table-active"><td colspan="10"> No hay más registros </td></tr>');
            alertify.success("Encontramos "+server.length+" registros");
              getIncumplimientosMetricos(idRows);

          }
          else
          {
            $("#contenedorElementos").append('<tr class="vacio text-center"><td colspan="10"> No hay resultados de la busqueda </td></tr>');
          }
$.LoadingOverlay("hide");
         },
         timeout: 60000,
         error: function(e)
          {
            $.LoadingOverlay("hide");
            if(e.statusText != 'timeout')
               alertify.error("Ocurrió en el servidor '> "+e.statusText);
             else
             {
               alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
               {
                 $("#buscar").submit();
               },
               function()
               {
                 alertify.warning('Intentalo más tarde.')
               });
             }
          }
      });
  });
 $("#registro").submit(function(e)
 {
   e.preventDefault();
   if(!validarConexion())
   {
     alertify.error('No hay conexión a internet.');
     return false;
   }
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./POST/?source1=incumplimiento&source2=setincumplimiento",
      data: $("#registro").serialize(),
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
        if(server.status == 'ok')
        {
          alertify.success("incumplimiento '"+$("#source1").val()+"' creada correctamente")
         var interfaz = interfaceIncumplimiento(server.id,'<b>'+$("#source1").val()+'</b>',$("#source2").val(),server.fecha);
         $("#contenedorElementos").prepend(interfaz);
         $(".form-control").val("");
        }
        else
        alertify.error("Ocurrió un error en el proceso '> "+server.log)
      },
      timeout: 10000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              $("#registro").submit();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
 });
 $("#actualizar").submit(function(e)
 {
   e.preventDefault();
   if(!validarConexion())
   {
     alertify.error('No hay conexión a internet.');
     return false;
   }
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./POST/?source1=incumplimiento&source2=updincumplimiento",
      data: $("#actualizar").serialize(),
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
        if(server.status == 'ok')
        {
         alertify.success("Registro ' "+$("#sourcee2").val()+" ' actualizado")
         $("#"+$("#sourcee").val()+"").find("td.col1").text($("#sourcee1").val());
         $("#"+$("#sourcee").val()+"").find("td.col2").html($("#sourcee2").val())
         $("#"+$("#sourcee").val()+"").find("td.col3").html($("#sourcee3").val())
        }
        else
         alertify.error("Ocurrió un error en el proceso '> "+server.log)
      },
      timeout: 10000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              $("#actualizar").submit();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
 });
 getChecklistsUsuario();
});
function getChecklistsUsuario()
{
  if(!validarConexion())
  {
    alertify.error('No hay conexión a internet.');
    return false;
  }
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
          $.each(server,function(a,b)
          {
              $("#checklist").append('<option value="'+b.id+'">'+b.nombre+'</option>')
          });
          getGruposTickets();
          getSucursalesTicket();
          getValidateId();
        }
      },
      timeout: 10000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              getValidateId();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
}
function getValidateId()
{
  $(".precargacols").remove();
  if(!validarConexion())
  {
    alertify.error('No hay conexión a internet.');
    return false;
  }
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./GET/?source1=ticket&source2=conf",
      data: { 'source1': $("#checklist").val(), 'source2':$("#from").val(), 'source3': $("#to").val(), 'source': sessionStorage.getItem("source"), 'source4': sessionStorage.getItem("idUsuario") },
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
        if(server.estatus == 'ok')
        {
          $("#total").text(server.total)
          $("#proceso").text(server.asignados)
          $("#terminado").text(server.realizados)
          sessionStorage.setItem('precargara',server.precargaObj);
          sessionStorage.setItem('precargarde',server.precargaOriginal);
          sessionStorage.setItem('opciones',server.opciones);
          sessionStorage.setItem('elementos',server.elementos);
          sessionStorage.setItem('nombreEmpresa',server.nombreEmpresa);
          $("#slcChecklist").html('<option value="'+server.idChecklist+'">'+server.nombreChecklist+'</option>');
          var columnas = JSON.parse(sessionStorage.getItem("precargarde"));
          $.each(columnas,function(a,b)
          {
            if($("#precarga_"+b.posicion+"").length == 0)
              $("#agregarMetricos").before('<th id="precarga_'+b.posicion+'" class="precargacols excsv">'+b.elemento+'</tf>')
          });
          getIncumplimientos()
        }
        else {
          alertify.error("Este checklist no esta configurado para trabajar con tickets...")
          $.LoadingOverlay("hide");
        }
      },
      timeout: 10000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              getValidateId();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
}
function getIncumplimientos()
{
  $("#proceso").text(0);
  $("#terminado").text(0);
  $("#total").text(0);
  $("#pendiente").text(0);
  if(!validarConexion())
  {
    alertify.error('No hay conexión a internet.');
    return false;
  }
  $("#contenedorElementos").empty();
 $(".cargarmas").remove();
 $(".separador").remove();
 $(".incumplimientos").remove();
 $("#exp").find(".button").remove();
 var fecha0 = $("#from").val();
 var fecha1 = $("#to").val();
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./GET/?source1=ticket&source2=gettickets",
      data: { 'source1': $("#checklist").val(), 'source2':fecha0, 'source3': fecha1, 'source': sessionStorage.getItem("source"), 'source4': sessionStorage.getItem("opciones"), 'source5':$(".incumplimientos").length,"source6":$("#slcGrupo").val(),"source7":$("#slcSucursal").val()},
      beforeSend: function(event)
      {
        $.LoadingOverlay("show",
        {
          image       : "",
          fontawesome : "fa fa-spinner fa-pulse fa-1x fa-fw",
          text        :  "Cargando.. "
        });
      },
      success: function(server)
      {
        var fechaa = $("#from").val();
        var fecha2 = $("#to").val();
        // console.log(fecha + fecha2);
        sessionStorage.setItem('fechaGuardada',fechaa);
        sessionStorage.setItem('fechaGuardada1',fecha2);

       if(server.length > 0)
       {
          //$("#total").text(server.length);
          $("#contenedorElementos").find("tr.vacio").empty()
        var numero = $(".incumplimientos").length;
        if(numero == 0)
         numero = 1;
         let idRows = [];
        $.each(server,function(a,b)
        {
          idRows.push(b.idRow);
         var interfaz = interfaceIncumplimiento(b.id,b.nombre,b.idRow,b.fecha,b.idGrupo,b.idUsuario,b.asignacionId,b.asignacionFecha,b.resolucion,b.idChecklist,b.idSucursal,b.nombreUsuario,b.nombreGrupo,b.estatus,b.actividad);
         if (b.estatus!=7) {
          $("#contenedorElementos").append(interfaz);
        }

         // var remclass = $("#"+b.id+"");
         // console.log(remclass);
        /* if (b.estatus==7) {
           $("."+b.idRow+"").find('td').removeClass('excsv');
         }*/


        });
        if(server.length == 20)
        {
         $("#contenedorElementos").append('<tr class="cargarmas text-center table-active" onclick="getIncumplimientos()" style="cursor:pointer;"><td colspan="'+$(".columnas").length+'"> Cargar más </td></tr>');
        }
        else
         $("#contenedorElementos").append('<tr class="cargarmas text-center table-active"><td colspan="'+$(".columnas").length+'"> No hay más registros </td></tr>');
         alertify.success(" Cargamos "+$("#total").text()+" registros");
         if(idRows.length > 0)
           getIncumplimientosMetricos(idRows);
       }
       else
       {
         $("#contenedorElementos").append('<tr class="vacio text-center"><td colspan="10"> Sin contenido </td></tr>');
         alertify.warning(" No hay resultados ");
       }

       $.LoadingOverlay("hide");
       $.LoadingOverlay("hide");


      },
      timeout: 60000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              getIncumplimiento();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
}
function getIncumplimientoId(id)
{
  if(!validarConexion())
  {
    alertify.error('No hay conexión a internet.');
    return false;
  }
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./GET/?source1=ticket&source2=getincumplimientoid",
      data: { 'source1': localStorage.getItem("idUsuario"), 'source2': id },
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
       if(server.status == 'ok')
       {
        $("#sourcee").val(id);
        $("#sourcee1").val(server.id_usuario);
        $("#sourcee2").val(server.correo);
        $("#sourcee3").val(server.fecha);
       }
      },
      timeout: 30000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              getincumplimientoId();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
}
function delIncumplimientoId(id)
{
  if(!validarConexion())
  {
    alertify.error('No hay conexión a internet.');
    return false;
  }
  alertify.confirm('Jarboss','¿seguro de eliminar este registro?', function()
  {
    $.ajax(
    {
        type: "POST",
        dataType: "JSON",
        url: "./POST/?source1=ticket&source2=delincumplimientoid",
        data: { 'source1': localStorage.getItem("idUsuario"), 'source2': id },
        beforeSend: function(event)
        {
        },
        success: function(server)
        {
         if(server.status == 'ok')
         {
           alertify.success("Sucursal '"+ $("#"+id+"").find("td.determinante").text()+"' eliminado");
           $("#"+id+"").remove();
         }
         else {
           alertify.error("Ocurrió en el servidor '> "+server.log)
         }
        },
        timeout: 10000,
        error: function(e)
         {
           $.LoadingOverlay("hide");
           if(e.statusText != 'timeout')
              alertify.error("Ocurrió en el servidor '> "+e.statusText);
            else
            {
              alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
              {
                delIncumplimientoId();
              },
              function()
              {
                alertify.warning('Intentalo más tarde.')
              });
            }
         }
     });
  },
  function()
  {
   alertify.error('No se hicieron cambios')
  });

}
function interfaceIncumplimiento(id,nombre,idRow,fecha,idGrupo,idUsuario,idAsignacion,fechaAsignacion,resolucion,idChecklist,idSucursal,nombreUsuario,nombreGrupo,estatus,actividad)
{
  let contproceso = $("#proceso").text();
  let contterminado = $("#terminado").text();
  let contTotal=$("#total").text();
  let contPendiente=$("#pendiente").text();
  let exportar=''
  if (estatus!=7) {
    contTotal=parseInt(contTotal)+1;
    $("#total").text(contTotal);
    exportar="excsv";
  //  console.log("Total");
  }

  let idRes='';
  let btnMas='';//lineas modulo de volver asignar tickets
  let fechaAtencion = 'Pendiente';
  let clicUpd = '<button class="btn btn-success btn-sm" onclick="mostrarAsignacion(\''+idRow+'\',\''+id+'\')" title="Por asignar" id="btnAsignar">Por asignar</button>';
  if(fechaAsignacion == null){
    fechaAsignacion = 'Pendiente';
    contPendiente=parseInt(contPendiente)+1;
    $("#pendiente").text(contPendiente);
  }
  else{
    clicUpd ='En proceso';
    if (resolucion.estatus == "error" && estatus!=7 ) {
      contproceso=parseInt(contproceso) +1;
      $("#proceso").text(contproceso)
    //  console.log("proceso",idRow);
    }
  }

    var tiempo="Indefinido";
  if(resolucion.estatus != "error")
  {
    // console.log(resolucion.fechaAtencion);
    fechaAtencion = resolucion.fecha;
    if (idChecklist == "5edfbd88d2218") {
      fechaAtencion = resolucion.fechaAtencion;
    }
    if (idChecklist == "5f7ea9e873e18") {
      if (resolucion.fechaAtencion == null) {
        fechaAtencion = 'N/A'
      }else {
        fechaAtencion = resolucion.fechaAtencion;
      }

    }
    clicUpd = '  <a href="https://www.jarboss.com/Informes/?source1='+resolucion.id+'&source2='+sessionStorage.getItem("nombreEmpresa")+'" target="_blank">Cerrado</a>';
    contterminado=parseInt(contterminado) +1;
    $("#terminado").text(contterminado);
  // console.log("terminado",idRow);

      var fecha1 = moment(fecha);
    var fecha2 = moment(resolucion.fecha);
    tiempo= fecha2.diff(fecha1, 'days')+ ' dias con '+fecha2.diff(fecha1, 'hours')+ ' horas con '+fecha2.diff(fecha1, 'minutes')+ ' minutos';

    btnMas='<button class="validar" title="Validar" onclick="validarTicket(\''+idAsignacion+'\',\''+idRow+'\')" style=""><i class="fas fa-check"></i></button><button class="asignarTick" title="Asignar" onclick="asignarTicket(\''+idAsignacion+'\',\''+id+'\',\''+idGrupo+'\')" style=""><i class="fas fa-cog"></i></button>';//lineas modulo de volver asignar tickets

  }
var columnas = JSON.parse(sessionStorage.getItem("precargarde"));
var precargaCols = '';
var colids = [];
$.each(columnas,function(a,b)
{
  if($.inArray(b.posicion,colids) == -1)
  {
    precargaCols +='<td class="precarga_'+b.posicion+' precargado columnas  excsv">NA</td>';
      colids.push(b.posicion);
  }
});
//**lineas para modulo de volver asignar tickets
if (idAsignacion!=null) {
  btnMas=btnMas+'<button class="btnCancelar btnDel" title="Eliminar" style="" onclick="eliminarTicket(\''+idAsignacion+'\',\''+id+'\',\''+resolucion.id+'\')"><i class="fas fa-trash-alt"></i></button>';
}
if (estatus==6) {
  btnMas='';
  $("."+idRow+"").find(".btnDel").hide();
}
var oculto='';
if (estatus==7) {
  /*
  btnMas='';
  $("."+idRow+"").find(".btnDel").hide();
  clicUpd='<span style="color:red">Eliminado</span>';
  */
  oculto='display:none;'
}
//Aqui termina modulo de volver asignar tickets
 var interfaz ='<tr class="incumplimientos '+idRow+'" style="'+oculto+'" id="'+id+'" registro="'+idRow+'" agrupados=""><td class="col10 '+exportar+'" style="vertical-align: middle;"><a href="https://www.jarboss.com/'+sessionStorage.getItem("nombreEmpresa")+'/reporteTemporal.php?source='+id+'" target="_blank">'+$("#checklist option[value="+ idChecklist +"]").text()+'</a></td><td class="col1A '+exportar+'" style="vertical-align: middle;">'+actividad+'</td><td class="col1 '+exportar+'" style="vertical-align: middle;" title="'+idSucursal+'">'+nombre+'</td><td class="col2 '+exportar+'" style="vertical-align: middle;" title="'+idGrupo+'">'+nombreGrupo+'</td><td class="col7 '+exportar+'" style="vertical-align: middle;">'+nombreUsuario+'</td>'+precargaCols+'<td class="col4 '+exportar+'" style="vertical-align: middle;">'+fecha+'</td><td class="col5 '+exportar+'" style="vertical-align: middle;">'+fechaAsignacion+'</td><td class="col6 '+exportar+'" style="vertical-align: middle;">'+fechaAtencion+'</td><td class="'+exportar+'" style="vertical-align: middle;">'+tiempo+'</td><td class="col0 '+exportar+'" style="vertical-align: middle;">'+clicUpd+'</td><td class="opciones opTick" style="vertical-align: middle;"><button class="btnMas" title="Historial" data-toggle="modal" data-target="#ticketsHistorico" onclick="getHistorico(\''+idRow+'\')" style=""><i class="fas fa-plus"></i></button>'+btnMas+'</td></tr>';
 return interfaz;
}
function getIncumplimientosMetricos(idRows)
{
  idRows = '"'+idRows.join('","')+'"'
  if(!validarConexion())
  {
    alertify.error('No hay conexión a internet.');
    return false;
  }
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./GET/?source1=ticket&source2=getticketsmetricos",
      data: { 'source1': idRows, 'source': sessionStorage.getItem("source"),'source2':sessionStorage.getItem("elementos")},
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
       if(server.length > 0)
       {
         $.each(server,function(a,b)
         {
           if(b.contenidoOpcion == null)
             $("."+b.idRow+"").find("td.precarga_"+b.posicion+"").html(b.contenido);
           else {
             $("."+b.idRow+"").find("td.precarga_"+b.posicion+"").html(b.contenidoOpcion);
           }
         });

         setTimeout(function(){ expcsv(); }, 1000);

         if(sessionStorage.getItem("nombreEmpresa") == 'Somosmaple.com')
         {
           alertify.confirm('¿Deseas agrupar los tickets?', function()
           {
             alertify.success('Agrupando')
             agruparTickets();
           },
           function()
           {
             alertify.warning('Visualizando lista completa')
           });
         }
       }
      },
      timeout: 60000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              getIncumplimiento();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
}
function getUsuarios()
{
  if(!validarConexion())
  {
    alertify.error('No hay conexión a internet.');
    return false;
  }
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "https://www.jarboss.com/GruposI/GET/?source=grupos&source2=mostrarMiembros",
      data:{ "token": sessionStorage.getItem("source"), 'source':$("#slcGrupos").val()},// url hacia el controlado
      beforeSend: function(event)
      {
      $.LoadingOverlay("show",
{
  image       : "",
  fontawesome : "fa fa-spinner fa-pulse fa-1x fa-fw",
  text        :  "Cargando.. "
});
      },
      success: function(server)
      {
        filtrosCargados = true;
       if(server.length > 0)
       {
         $("#slcUsuarios").empty()
         $.each(server,function(a,b)
         {
           $("#slcUsuarios").append('<option value="'+b.id_usuario+'">'+b.usuario+' - '+b.correo+'</option>')
           //$("#slcUsuarios2").append('<option value="'+b.id_empleado+'">'+b.nombreCorto+'-'+b.correo+'</option>')
         });
       }
       $.LoadingOverlay("hide");
      },
      timeout: 60000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              getUsuarios();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
}
function getSucursales()
{
  if(!validarConexion())
  {
    alertify.error('No hay conexión a internet.');
    return false;
  }
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "https://www.jarboss.com/Sucursales/GET/?source=sucursal&source2=getall",
      data:{ "source": sessionStorage.getItem("source") },// url hacia el controlado
      beforeSend: function(event)
      {
      $.LoadingOverlay("show",
{
  image       : "",
  fontawesome : "fa fa-spinner fa-pulse fa-1x fa-fw",
  text        :  "Cargando.. "
});
      },
      success: function(server)
      {
        filtrosCargados = true;
       if(server.secciones.length > 0)
       {
         $.each(server.secciones,function(a,b)
         {
           $("#slcSucursales").append('<option value="'+b.col1+'">'+b.col2+'</option>')
         });
         getGrupos();
       }
       else {
         $("#slcSucursales").append('<option value="">No cuenta con sucursales</option>');
         $("#slcSucursales").hide();
       }

      },
      timeout: 60000,
      error: function(e)
       {
         $.LoadingOverlay("hide");
         if(e.statusText != 'timeout')
            alertify.error("Ocurrió en el servidor '> "+e.statusText);
          else
          {
            alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function()
            {
              getSucursales();
            },
            function()
            {
              alertify.warning('Intentalo más tarde.')
            });
          }
       }
   });
}
function getGrupos()
{
 $.ajax(
 {
   type: "POST",
   dataType: "JSON",
   url: "https://www.jarboss.com/GruposI/GET/?source=grupos&source2=datosGrupoBuscar",
   data: { 'token': sessionStorage.getItem("source"), 'source2': $("#slcChecklist").val() },
   beforeSend: function(event)
   {
   },
   success: function(server)
   {
     if(server.length > 0)
     {
       $("#slcGrupos").empty();
       $.each(server,function(a,b)
       {
        $("#slcGrupos").append('<option value="'+b.id+'">'+b.nombre+'</option>');
       })
     }
   },
   error: function(e)
   {
           //console.log(e);
           $("#site_active_indicador").text('0');
   }
  }); //ajax
}
function limpiarBusqueda()
{
  $("#contenedorElementos").empty();
  $("#sourcetexto").val('');
  getIncumplimiento();
}
function mostrarAsignacion(id,idReporte)
{
  // console.log(id);
  $("#idAuxiliar").val(id);
  $("#idReporte").val(id);
  $("#editar").modal("show");
  $("#slcGrupos").html('<option value="'+$("."+id+"").find("td.col2").attr("title")+'">'+$("."+id+"").find("td.col2").text()+'</option>');
  $("#slcSucursales").html('<option value="'+$("."+id+"").find("td.col1").attr("title")+'">'+$("."+id+"").find("td.col1").text()+'</option>');
  getUsuarios();
  generarPrecargara(id)
}
function generarPrecargara(id)
{
  var estructura = JSON.parse(sessionStorage.getItem("precargara"));
  var precargara = $("."+id+"").find(".precargado");
  $("#contenedorPrecargado").empty();
  $.each(estructura,function(a,b)
  {
    $("#contenedorPrecargado").append('<tr id="precargara_'+b.posicion+'" class="'+b.id+'"><td class="elemento">'+b.elemento+'</td><td class="precargado"></td></tr>')
  });
  $.each(precargara,function(a,b)
  {
    let posicion = a + 1;
    $("#precargara_"+posicion+"").find("td.precargado").text($(this).text());
  });
}
function generarJson(grupo,sucursal)
{
  var json = [];
  $.each($("#contenedorPrecargado").find("tr"),function(a,b)
  {
    let registro = {};
    registro.columna = $(this).attr("class");
    registro.contenido = $(this).find("td.precargado").text();
    registro.etiqueta = $(this).find("td.elemento").text();
    registro.tipo = "0";
    json.push(registro);
  });
   registro = {};
  registro.columna = "0";
  registro.contenido = $("#slcGrupos option[value='"+grupo+"']").text();
  registro.etiqueta = "Grupo";
  registro.tipo = "0";
  json.push(registro);
   registro = {};
  registro.columna = "0";
  registro.contenido = $("#slcSucursales option[value='"+sucursal+"']").text();
  registro.etiqueta = "Sucursal";
  registro.tipo = "0";
  json.push(registro);
  return JSON.stringify(json);
}
function btnAsignar()
{
 if($("#slcUsuarios").val() != "")
  setAsignacion($("#slcUsuarios").val(),$("#slcChecklist").val(),$("#idAuxiliar").val(),$("#slcSucursales").val(),$("#slcGrupos").val())
 else
  alertify.error("Selecciona un usuario por favor.");
}
function setAsignacion(idEmpleado,idChecklist,idAux,sucursal,idGrupo)
{
  var json = generarJson(idGrupo,sucursal);
      $.ajax({
        type:"POST",
        dataType: "JSON",
        url: "https://"+host+"/Asignaciones/POST/?source=asign&source2=setasign",
        data: {"source0": idAux ,"source1": idChecklist, "source2": idGrupo , "source3": sucursal , "source4": idEmpleado, "source5": "", "source6": "", "source7": "4", "source": sessionStorage.getItem("source"),"sourcejson": json},
        beforeSend: function()
        {

        },
        success: function(server)
        {
          if(server.status == 'ok')
          {
            alertify.success("El ticket se asignó, se informará por correo al cliente.")
            $("."+idAux+"").find("td.col0").html('En proceso');
            $("."+idAux+"").find("td.col5").html(server.fecha);
	         $("#editar").modal("hide");
             sendMail($("#slcUsuarios option:selected").text(),idAux,'',server.id);
             setPushnotification(idEmpleado);
	         getDevicesUsuario($("#slcUsuarios").val(),'Resolución de ticket');
          }
        },
        error: function(e)
        {

        }
      });
}
function sendMail(correo,idReporte,sucursal,idAsignacion)
{
  var estructura = JSON.parse(sessionStorage.getItem("precargara"));
  var precargara = $("."+idReporte+"").find(".precargado");
  $("#contenedorPrecargado").empty();
  var table ="";
  var contenido1= [];
  $.each(precargara,function(a,b)
  {
    let posicion = a + 1;
    contenido = $(this).text();
    let cont={
      pcion:posicion,
      nombre:contenido
    }
    contenido1.push(cont);
  });

  $.each(estructura,function(a,b)
  {
    $.each(contenido1,function(c,d) {
      var contenido = d.nombre;
      pos=c + 1;
      if (pos==b.posicion) {

        table = table + '<tr id="precargara_'+b.posicion+'" class="'+b.id+'"><td class="elemento">'+b.elemento+'</td><td class="precargado">'+contenido+'</td></tr>';
      }
    });
  });
// return 0;
  var nombreSucursal = $('select[name="source3"] option:selected').text();
  var nombreGrupo = $('select[name="source4"] option:selected').text();
 correo = correo.split("-");
 var nombre = correo[0].trim();
 correo = correo[1].trim();
 if(correo == 'soporte@'+sessionStorage.getItem("nombreEmpresa")+'')
   correo = 'soporte@jarboss.com';
 var cuerpo = '<br>Buen día estimado '+nombre+', <br><br><br>Se te asignó el checklist Acciones correctivas <br><br>';
 cuerpo = 'Puedes realizar el reporte desde un navegador web <a href="https://www.jarboss.com/jawkWeb/?source3='+idAsignacion+'">Aquí</a>';
 cuerpo += '<br> O desde tu aplicación Jarboss work disponible para Android/IOS';
 cuerpo += '<br> Sucursal:'+nombreSucursal+''+'<br> Grupo: '+nombreGrupo+'';
 var titulo = 'Asignación de ticket Acciones correctivas';

 cuerpo += '<table class="table table-bordered table-hover"><thead><tr></tr><th>Elemento</th><th>Contenido</th></thead>';

 cuerpo +='<tbody id="contenedorPrecargado" style="vertical-align: middle;">'+table+'</tbody></table>';
 //correo='oalburquerquegarcia@jarboss.com,jaureguimartha79@gmail.com';
$.ajax({
        type:"POST",
        dataType: "JSON",
        url: "https://www.jarboss.com/Notificaciones/POST/?source1=notificacion&source2=mail",
        data: {"source": sessionStorage.getItem("source"), "source1": correo, "source2": cuerpo , "source3": titulo, "source4": sessionStorage.getItem("nombreEmpresa")},
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
function getDevicesUsuario(usuario,nombreChecklist)
{
 $.ajax(
 {
   type: "POST",
   dataType: "JSON",
   url: "./GET/?source1=incumplimiento&source2=getdevices",
   data: { 'source1': usuario, 'source': sessionStorage.getItem("source") },
   beforeSend: function(event)
   {
           $("#site_active_indicador").text('1');
   },
   success: function(server)
   {
    if(server.status == 'ok')
    {
     var androidIds = server.droid.join(',');
     var iosIds = server.ios.join(',');
     sendPush(androidIds,iosIds,nombreChecklist);
    }
   },
   error: function(e)
   {
           //console.log(e);
           $("#site_active_indicador").text('0');
   }
  }); //ajax
}
function sendPush(android,ios,nombreChecklist)
{
 $.ajax(
 {
   type: "POST",
   dataType: "JSON",
   url: "https://www.jarboss.com/Notificaciones/POST/?source1=notificacion&source2=push",
   data: { 'source1': android, 'source2': ios, 'source3': 'Checklist '+nombreChecklist+' asignado', 'source4': 'Administrador', 'source5': 3 },
   beforeSend: function(event)
   {
           $("#site_active_indicador").text('1');
   },
   success: function(server)
   {
   },
   error: function(e)
   {
           //console.log(e);
           $("#site_active_indicador").text('0');
   }
  }); //ajax
}
function agruparTickets()
{
 var incumplimientos = $(".incumplimientos").get().reverse()
 $.each(incumplimientos,function(a,b)
 {
  var sucursalBase = $(this).find("td.col1").text();
  var conceptoBase = $(this).find("td.precarga_1").text();
  var contraer = true;
  var idBase = $(this).attr("registro");
  $.each(incumplimientos,function(c,d)
  {
    let idInc = $(this).attr("registro");
    if($(this).is(":visible") && idBase != idInc && contraer)
    {
      let sucursal = $(this).find("td.col1").text();
      let concepto = $(this).find("td.precarga_1").text();
      let reincidencia = $(this).find("td.precarga_3").text();
      if(sucursalBase == sucursal && conceptoBase == concepto)
      {
        console.log(sucursalBase+' - '+conceptoBase+' - '+c+':')
        console.log(sucursal+' - '+concepto+' - '+reincidencia)
        if(reincidencia == 'Si')
        {
          let agrupados = $("."+idBase+"").attr("agrupados")+idInc+','
          $("."+idBase+"").attr("agrupados",agrupados)
          $(this).hide();
        }
        else
          contraer = false;
      }
    }
  });
 });
}

function expcsv() {
  $("#exp").tableExport({
     formats: ["xls"], //Tipo de archivos a exportar ("xlsx","txt", "csv", "xls")
     position: 'button',  // Posicion que se muestran los botones puedes ser: (top, bottom)
     bootstrap: false,//Usar lo estilos de css de bootstrap para los botones (true, false)
     fileName: "Tabla_tickets",    //Nombre del archivo
  });
  $(".xls").css("width","150px");
  $(".xls").css("height","25px;");
  $(".xls").css("margin-top","-9px !important;");
  $(".xls").addClass("btn btn-secondary");
}


//Aqui inicia las funciones para la reasignacion de tickets

function getHistorico(idRow){
  $("#elementosTicket").empty();
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./GET/?source1=ticket&source2=getHistorico",
      data: {'source1': $(".historico").length, 'source2': idRow,'source': sessionStorage.getItem("source")},
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
       if(server.length > 0)
       {
        var numero = $(".historico").length;
        if(numero == 0)
         numero = 1;
        $.each(server,function(a,b)
        {
          if (b.idUsuario!=null) {
            var interfaz = interfazHistorico(b.id,b.nombre,b.fecha,b.reporte);
            $("#elementosTicket").append(interfaz);
          }
        });
       }
       else
       {
         $("#elementosTicket").append('<tr class="vacio text-center"><td colspan="3"> Sin contenido </td></tr>');
       }
      },
      timeout: 60000,
      error: function(e)
       {
       }
   });
}

function validarTicket(idAsignacion,idRow){
  //alert("Incumplimiento resuelto");
  var estatus=6;
  alertify.confirm(" ","¿Desea marcar como resuelto el incumpliento?",
  function(){
    console.log(idAsignacion);

  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./POST/?source=ticket&source2=updValidar",
      data: {"source1":idAsignacion,"source2":estatus,'source': sessionStorage.getItem("source")},
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
        if(server.status == 'ok')
        {
         $("."+server.idAux+"").find("td.opciones").empty();
         $("."+server.idAux+"").find("td.opciones").html('<button class="btnMas" title="Historial" data-toggle="modal" data-target="#ticketsHistorico" onclick="getHistorico(\''+idRow+'\')" style=""><i class="fas fa-plus"></i></button>');
          alertify.success("Incumplimiento Cerrado");
        }
        else
         alertify.error("Ocurrió un error en el proceso '> "+server.log)
      },
      timeout: 10000,
      error: function(e)
       {
       }
   });
 },function(){
     alertify.error('Sin cambios');
  }).set('labels',{ok:"Aceptar",cancel:'Cancelar'});
  //alertify.confirm(" ","¿Los incumplimientos estan resueltos?", function(){ validar(idRow,id); alertify.success('Incumplimiento no satisfactorio') }, function(){ alertify.error('Incumplimiento resuelto')}).set('labels',{ok:"No",cancel:'Si'});
}

function asignarTicket(idRow,id,idGrupo){
  var statusValidar=0;
  alertify.confirm(" ","¿Desea asignar a un usuario?",
  function(){
      $.ajax(
      {
          type: "POST",
          dataType: "JSON",
          url: "./POST/?source=ticket&source2=updEstatus",
          data: {"source1":idRow,"source2":statusValidar,"source3":"",'source': sessionStorage.getItem("source")},
          beforeSend: function(event)
          {
          },
          success: function(server)
          {
            if(server.status == 'ok')
            {
              $("."+server.idAux+"").find("td.col6").text("Pendiente");
              $("."+server.idAux+"").find("td.col7").text("Indefinido");
              $("."+server.idAux+"").find("td.col0").html('<button class="btn btn-success btn-sm btAsi" onclick="mostrarAsignacion(\''+server.idAux+'\',\''+id+'\',\''+idGrupo+'\')" title="Por asignar">Por asignar</button>')
              $("."+server.idAux+"").css("background-color","#e6e6e6");
              $("."+server.idAux+"").css("color","#000000");
              $("."+server.idAux+"").find(".btAsi").click();
            }
            else
             alertify.error("Ocurrió un error en el proceso '> "+server.log)
          },
          timeout: 10000,
          error: function(e)
           {

           }
       });

  },function(){
      alertify.error('Sin cambios');
//  console.log(statusValidar);
   }).set('labels',{ok:"Aceptar",cancel:'Cancelar'});
}

function interfazHistorico(id,nombre,fecha,reporte){
  if (reporte!=null) {
    reporte='<a href="https://www.jarbossdev.com/Jaguar/Informes/?source1='+reporte+'&source2='+sessionStorage.getItem('nombreEmpresa')+'" target="_blank">Ir al reporte</a>';
    fecha=fecha;
  }
  else {
    reporte="Reporte sin realizar";
    fecha="Pendiente";
  }
  var interfaz ='<tr class="historico" id="'+id+'"><td class="col1">'+nombre+'</td><td class="col2">'+fecha+'</td><td class="col2">'+reporte+'</td></tr>';
  return interfaz;
}

function eliminarTicket(idAsignacion,id,idRow){
  var statusCancelar=7;
  alertify.confirm(" ","¿Seguro que desea eliminar el incumplimiento?", function(){ eliminarIncumplimiento(idAsignacion,id,statusCancelar,idRow); alertify.success('Incumplimiento Cancelado') }, function(){ alertify.error('Sin cambios')}).set('labels',{ok:"Aceptar",cancel:'Cancelar'});

}

function eliminarIncumplimiento(idAsignacion,id,statusCancelar,idRow){
  $.ajax(
  {
      type: "POST",
      dataType: "JSON",
      url: "./POST/?source=ticket&source2=eliminarIncumplimiento",
      data: {"source1":idAsignacion,"source2":statusCancelar,'source3':idRow,'source': sessionStorage.getItem("source")},
      beforeSend: function(event)
      {
      },
      success: function(server)
      {
        if(server.status == 'ok')
        {
         //console.log("estatus Actualizado");
         alertify.success("incumplimiento Eliminado");
        $("."+server.idAux+"").remove();
        //$("#"+idRow+"").remove();
        }
        else
         alertify.error("Ocurrió un error en el proceso '> "+server.log);

         $.each(server.usuarios,function(a,b)
         {
        //   sendMail3(b.nomResponsable,b.nomCpp,b.nombreRes,b.nombreCpp,idRow);
         });
      },
      timeout: 10000,
      error: function(e)
       {

       }
   });
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
          // console.log(server)
        },
        error: function(e)
        {
	   $("#site_active_indicador").text('0');
        }
      }); //ajax
}

function getSucursalesTicket()
{
  $("#slcSucursal").val('');
  $("#checkboxesSuc").empty();
  $("#nomcheckSucu").empty();
  $("#slcSucursal").empty();
 $.ajax({
   type: "POST",
   dataType: "JSON",
   url: "./GET/?source1=ticket&source2=mostrarSucursales",
   data: {'source': sessionStorage.getItem("source")},
   success: function(server)
   {
     if(server.length > 0)
     {
       grSucursal=server;
       var ids = [];
       $.each(server,function(a,b)
       {
         if(server.length > 0)
         {
           var sucursal=b.nombre;
           sucursal=sucursal.replace('-',' ');
           sucursal=sucursal.replace(',','');
           sucursal=sucursal.trim();
          // sucursal=sucursal.replace('.','');

            $("#slcSucursal").append('<option value="'+sucursal+'" id="'+b.id+'">'+sucursal+'</option>')
            ids.push(sucursal);
         }
       });

       //$("#slcSucursal").prepend('<option value="'+ids.join(",")+'" id="todUsua" selected>Todas las sucursales</option>')
        $("#slcSucursal").prepend('<option value="" id="todUsua" selected>Todas las sucursales</option>')
     }
     else {
       $("#slcSucursal").append('<option value="">No cuenta con sucursales</option>');
       $("#slcSucursal").hide();
     }

   }
 }); //ajax
}
function getGruposTickets()
{
  $("#nomcheckgrup").empty();
  $("#slcGrupo").val('');
  $("#slcGrupo").empty();

 $.ajax({
   type: "POST",
   dataType: "JSON",
   url: "./GET/?source1=ticket&source2=mostrarGrupos",
   data: {'source': sessionStorage.getItem("source")},
   success: function(server)
   {
     grGrupo=server;
     if(server.length > 0)
     {
       var ids = [];
       $.each(server,function(a,b)
       {
         $("#slcGrupo").append('<option value="'+b.id+'">'+b.nombre+'</option>')
         ids.push(b.id);
       });

       $("#slcGrupo").prepend('<option value="'+ids.join(",")+'" selected>Todos los grupos</option>')
     }
     else {
       $("#slcGrupo").append("No cuenta con grupos");
     }
   }
 }); //ajax
}
