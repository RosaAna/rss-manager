/*jslint browser:true, devel:true, white:true, vars:true*/
/*global $:false, intel:false*/

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
  
    $.feed.cargaNoticia("http://www.ideal.es/jaen/rss/2.0/portada", "#caja1", "rss");
    
    // Ocultamos todos los elementos que no sean la página principal de la aplicación
    $(".listpage").hide();
    
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
    
});

$.feed = {};

// Carga el canal con id "caja"

$.feed.cargaNoticia = function(urlCanal, caja, tipo) {
    
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql",

        jsonp: "callback",

        dataType: "jsonp",

        data: {
            q: "select * from " + tipo + " where url=\"" + urlCanal + "\"",
            format: "json"
        },

        success: function( response ) {
            var cantidad = response.query.count;
            var arrayNoticias = response.query.results.item;
            console.log(response);
            $(caja).empty();
            
            for(var i = 0; i < cantidad; i++) {
                
                var item = $("<div></div>");
                
                var ancla = $('<a href="' + arrayNoticias[i].link + '">' + arrayNoticias[i].title + '</a>');
                item.append(ancla);
                var fecha = $('<p>' + arrayNoticias[i].pubDate + '</p>');
                item.append(fecha);
                var description = $('<p>' + arrayNoticias[i].description + '</p>');
                item.append(description);
             
                $(caja).append(item);
                
            }
            
        }
    });
};