var servidor = '.';
function leerArchivo()
{
    $.LoadingOverlay("show",
    {
    image	: "",
    fontawesome : "fa fa-spinner fa-pulse fa-1x fa-fw",
    text        :  "Cargando.. "
    });
    let destino = '';
    if(sessionStorage.getItem("source") != '031d4e943f78cba56dd84f1146422250e8c72448')
      destino = 'internos';
    $.ajax(
        {
            type: "POST",
            dataType: "JSON",
            contentType: "application/x-www-form-urlencoded;",
            url: "./POST/?source1=importador"+destino,
            data: { 'source1': $("#source1").val(), 'source': sessionStorage.getItem("source")},
            beforeSend: function (event) {
            },
            success: function (server)
            {
              $.LoadingOverlay("hide")
                if (server.estatus == 'ok')
                {
                    alertify.success("Se importaron "+server.registros.length+" registros");
                    crearDropzone(0);
                    $("#source1").val("");
                    getAsignaciones();
                    $("#resInvalidos").empty();
                    if(sessionStorage.getItem("source") != '031d4e943f78cba56dd84f1146422250e8c72448')
                    {
                      if(server.invalidos.length > 0)
                      {
                        $("#resInvalidos").find("tfoot").empty();
                        $.each(server.invalidos,function(a,b)
                        {
                          $("#resInvalidos").append('<tr><td>'+b.sucursal+'</td><td>'+b.grupo+'</td><td>'+b.checklist+'</td><td>'+b.fecha+'</td><td>'+b.fechaf+'</td><td>'+b.usuario+'</td><td>'+b.validos+'</td></tr>')
                        });
                      }
                      else
                      {
                        $("#resInvalidos").find("tfoot").html('<tr><td colspan="6">Sin resultados</td></tr>');
                      }
                    }
                }
                else
                {
                  alertify.error("Hubo error al importar");
                }
            },
            timeout: 60000,
            error: function (e) {
              $.LoadingOverlay("hide");
                if (e.statusText != 'timeout')
                    alertify.error("Ocurrió en el servidor '> " + e.statusText);
                else {
                    alertify.confirm('La petición tardo demasiado ¿deseas volver a intentarlo?', function () {
                        leerArchivo();
                    },
                        function () {
                            alertify.warning('Intentalo más tarde.')
                        });
                }
            }
        });
}
function dropzone(objetivo)
{
 $("#dropzone1").dropzone(
 {
  url: "./POST/?source1=upload",
  dictDefaultMessage:"Arrastre la hoja de calculo aquí para subir o haz clic.",
  autoProcessQueue: true,
  maxFilesize:750,
  maxFiles: 1,
  addRemoveLinks: true,
  dictRemoveFile : "x",
  acceptedFiles:".xls,.xlsx",
  beforeSend: function()
  {
   waitingDialog.show('Subiendo ...', { dialogSize: 'm',  progressType: 'info' });
  },
   success: function (file, response)
   {
     console.log(response.status)
    if(response.status == "ok")
    {
     var ruta = response.nombre;
      if(objetivo == 0)
      {
        $("#source1").val(ruta);
       $("#source1").val(ruta);
      }
      else
      {
       $("#sourcee1").val(ruta);
         crearDropzone(2)
      }
    }
    if(response.status == "existe")
    {
     alert("El archivo existe, cambia el nombre o selecciona otro archivo")
     crearDropzone(objetivo)
    }
   },
   error:function(file,response)
   {
     alert("El archivo tiene un error, demasiado grande o dañado, por favor selecciona otro.")
     crearDropzone(objetivo)
   }
 });
}
function crearDropzone(opt)
{
 $(".dropzone").remove();
 //$("#editarAdjunto").remove();
 if(opt == 0)
  $("#contenedorNuevoDropzone").append('<div class="dropzone" id="dropzone1" style="margin-top:10px;"></div>');
 if(opt == 1)
  $("#contenedorEditarDropzone").append('<div id="editarAdjunto"><br><a href="javascript:mostrarDropzone(2);" id="programaAdjuntado"> Programa adjuntado </a><div class="dropzone" id="myDropzone" style="display:none;"></div></div>');
 if(opt == 2)
  $("#contenedorEditarDropzone").append('<div class="dropzone" id="dropzone1" style="margin-top:10px;"></div>');
 if(opt == 0 || opt == 2)
   dropzone(opt)
}
function mostrarDropzone(opt)
{
 $("#myDropzone").show();
 $("#programaAdjuntado").remove();
 crearDropzone(opt)
}
