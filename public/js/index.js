/*jslint browser:true, devel:true, white:true, vars:true*/
/*global $:false, intel:false*/

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

// Función para representar los datos de Firebase en la lista
function appendData(name, date, type) {
    var tr = $("<tr></tr>");
    
    var tdName = $("<td>" + name + "</td>");
    var tdType = $("<td>" + type + "</td>");
    var tdDate = $("<td>" + date + "</td>");
    
    tr.append(tdName);
    tr.append(tdType);
    tr.append(tdDate);
    
    $(".table-list").append(tr);
    
}

// Función para representar los datos de Firebase en la lista de borrar
function appendDataDelete(name, date, type, key) {
    var tr = $("<tr></tr>");
    
    var tdName = $("<td>" + name + "</td>");
    var tdType = $("<td>" + type + "</td>");
    var tdDate = $("<td>" + date + "</td>");
    var tdCheckBox = $('<td><input type="checkbox" class=" ' + key + '"></td>');
    
    tr.append(tdName);
    tr.append(tdType);
    tr.append(tdDate);
    tr.append(tdCheckBox);
    
    $(".table-delete-list").append(tr);
    
}