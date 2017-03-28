/*jslint browser:true, devel:true, white:true, vars:true*/
/*global $:false, intel:false*/

$(document).ready(function() {
    
    $.feed.cargaNoticia("http://www.ideal.es/jaen/rss/2.0/portada", "#caja1", "rss");
    //$("#pagina1").hide();
    
});

function mostrarContenido() {
        
    $.afui.loadContent("#pagina1", false, false, "up");
    
}

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