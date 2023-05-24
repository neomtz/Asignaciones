$( document ).ready(function() 
{
 $( ".input" ).focusin(function() {
  $( this ).find( "span" ).animate({"opacity":"0"}, 200);
 });

 $( ".input" ).focusout(function() {
  $( this ).find( "span" ).animate({"opacity":"1"}, 300);
 });

 $("#exp_login").submit(function(e)
 {
		 e.preventDefault();
 var dataPost =  $("#exp_login").serialize();
	  
  $.ajax(
  {
   type: "POST",
   dataType: "JSON",
   url: "./GET/?source=inicio&source2=login",
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
  	  $("#exp_login").find(".submit i").removeAttr('class').addClass("fa fa-check").css({"color":"#fff"});
	  $(".submit").css({"background":"#2ecc71", "border-color":"#2ecc71"});
	  $(".feedback").removeClass("feedbackError").text('Autenticado correctamente, redireccionando ...').show().animate({"opacity":"1", "bottom":"-80px"}, 400);
      $("input").css({"border-color":"#2ecc71"});
        setTimeout('window.location.href="Asistencia.html"',1000);
	 }
	 else
	 {
	  //$("#exp_login").find(".submit i").removeAttr('class').addClass("fa fa-check");
	  $(".submit").css({"background":"#FF7052", "border-color":"#FF7052"});
	  $(".feedback").addClass("feedbackError").text('Datos de acceso incorrectos ...').show().animate({"opacity":"1", "bottom":"-80px"}, 400);
      $("input").css({"border-color":"#FF7052"});
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

