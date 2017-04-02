/*jslint browser: true*/
/*global $, jQuery, alert*/

$(document).ready(function() {
    
    // Objeto que detecta si la página está siendo cargada desde un dispositivo móvil.    
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    
    // Ocultamos todos los elementos que no sean la página principal de la aplicación
    $(".listpage").hide();
    $(".addsource").hide();
    $(".listpage-delete").hide();
    
    // Acción que se realiza para animar los elementos cuando hacemos clic en un botón.
    $(".list").click(function() {
        $("html, body").animate({
            scrollTop: 0,
        }, 600);
        
        $(".flex-icons").fadeOut(400, function() {
            $(".listpage").fadeIn(400);
            
            $(".listheader").animate({
                height: "50px",
            }, 400);
            
        });
        
    });
    
    // Efecto contrario para volver a la página principal
    $(".backarrow").click(function() {    
        $("html, body").animate({
            scrollTop: 0,
        }, 600);
        
        $(".listheader").animate({
            height: "0px",
        }, 400);
        
        $(".listpage").fadeOut(400, function() {
            $(".flex-icons").fadeIn(400);
            
        });
        
    });
    
    $(".add").click(function() {
        $(".addsource").fadeIn(400);
    });
    
    $(".formbox-quit").click(function() {
        $(".addsource").fadeOut(400);
    });
    
    // EFECTOS BOTONES PARA EL POPUP
    $(".rss").click(function() {
        $(".atom-clicked").removeClass("atom-clicked").addClass("atom");
        $(".rss").removeClass("rss").addClass("rss-clicked");
        
        //AÑADIR VALOR EN EL INDEX.JS PARA CUANDO SE HAGA CLICK EN ESTE BOTÓN
    });
    
    $(".atom").click(function() {
        $(".rss-clicked").removeClass("rss-clicked").addClass("rss");
        $(".atom").removeClass("atom").addClass("atom-clicked");
        
        //AÑADIR VALOR EN EL INDEX.JS PARA CUANDO SE HAGA CLICK EN ESTE BOTÓN
    });
    
    $(".submit-button").hover(function() {
        $(".fa-check-circle-o").removeClass("fa-check-circle-o").addClass("fa-check-circle");
    }, function() {
        $(".fa-check-circle").removeClass("fa-check-circle").addClass("fa-check-circle-o");
    });
    
    $(".delete").click(function() {
        $("html, body").animate({
            scrollTop: 0,
        }, 600);
        
        $(".flex-icons").fadeOut(400, function() {
            $(".listpage-delete").fadeIn(400);
            
            $(".listheader-delete").animate({
                height: "50px",
            }, 400);
            
        });
        
    });
    
    // Efecto contrario para volver a la página principal
    $(".backarrow-delete").click(function() {    
        $("html, body").animate({
            scrollTop: 0,
        }, 600);
        
        $(".listheader-delete").animate({
            height: "0px",
        }, 400);
        
        $(".listpage-delete").fadeOut(400, function() {
            $(".flex-icons").fadeIn(400);
            
        });
        
    });
    
});