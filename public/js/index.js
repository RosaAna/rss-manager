$.feed = {};

// Carga el canal con id "caja"
$.feed.cargaNoticia = function(urlCanal, caja, tipo) {
    
    if(tipo == 'rss') {
        $.ajax({
            url: "http://query.yahooapis.com/v1/public/yql",

            jsonp: "callback",

            dataType: "jsonp",

            data: {
                q: 'select * from rss where url="' + urlCanal + '"',
                format: "json"
            },

            success: function(response) {
                $(caja).empty();

                if(response.query.results !== null) {
                    var cantidad = response.query.count;
                    var arrayNoticias = response.query.results.item;

                    for(var i = 0; i < cantidad; i++) {

                        var anchor = $('<a class="anchor-container" href="' + arrayNoticias[i].link + '"></a>');
                        var item = $('<div class="item"></div>');

                        var ancla = $('<h1 class="atitle">' + arrayNoticias[i].title + '</h1>');
                        item.append(ancla);
                        var fecha = $('<p class="pdate">' + arrayNoticias[i].pubDate + '</p>');
                        item.append(fecha);
                        
                        if(arrayNoticias[i].description !== undefined) {
                            var description = $('<p>' + arrayNoticias[i].description + '</p>');
                            item.append(description);
                        }

                        anchor.append(item);
                        $(caja).append(anchor);

                    }

                } else {
                    $(".news-error-ntf").fadeIn(400);
                    setTimeout(function() {
                        $(".news-error-ntf").fadeOut(400);
                    }, 6000);
                } 
            } 
        });
        
    } else if(tipo == 'atom') {
        $.ajax({
            url: "http://query.yahooapis.com/v1/public/yql",

            jsonp: "callback",

            dataType: "jsonp",

            data: {
                q: 'select * from atom where url="' + urlCanal + '"',
                format: "json"
            },

            success: function(response) {
                $(caja).empty();

                if(response.query.results !== null) {
                    var cantidad = response.query.count;
                    var arrayNoticias = response.query.results.entry;

                    for(var i = 0; i < cantidad; i++) {

                        var anchor = $('<a class="anchor-container" href="' + arrayNoticias[i].link + '"></a>');
                        var item = $('<div class="item"></div>');

                        var ancla = $('<h1 class="atitle">' + arrayNoticias[i].title + '</h1>');
                        item.append(ancla);
                        var fecha = $('<p class="pdate">' + arrayNoticias[i].updated + '</p>');
                        item.append(fecha);
                        
                        if(arrayNoticias[i].summary !== undefined) {
                            var description = $('<p>' + arrayNoticias[i].summary + '</p>');
                            item.append(description);
                        } else {
                            var description = $('<p>' + arrayNoticias[i].summary.content + '</p>');
                            item.append(description);
                        }

                        anchor.append(item);
                        $(caja).append(anchor);

                    }

                } else {
                    $(".news-error-ntf").fadeIn(400);
                    setTimeout(function() {
                        $(".news-error-ntf").fadeOut(400);
                    }, 6000);
                } 
            } 
        });
    }
};

function cleanElements() {
    $(".list-container").empty();
    $(".list-container-fav").empty();
    $(".list-delete-container").empty();
    
}

// Función que crea la tabla al inicio de la aplicación.
function appendTable(tableClass, position) {
    var table = $('<table class="' + tableClass + '"></table>');
    var trTh = $('<tr></tr>');
    
    var thSource = $('<th>Fuente</th>');
    var thType = $('<th>Tipo</th>');
    var thDate = $('<th>Añadido en</th>');
    var thFav = $('<th><i class="fa fa-star fav-header" aria-hidden="true"></i></th>');

    trTh.append(thSource);
    trTh.append(thType);
    trTh.append(thDate);
    trTh.append(thFav);
    
    table.append(trTh);

    $(position).append(table);
}

// Función que crea la tabla de borrar al inicio de la aplicación
function appendTableDelete() {
    var table = $('<table class="table-delete-list"></table>');
    var trTh = $('<tr></tr>');
    
    var thSource = $('<th>Fuente</th>');
    var thType = $('<th>Tipo</th>');
    var thDate = $('<th>Añadido en</th>');
    var thFav = $('<th>Borrar</th>');

    trTh.append(thSource);
    trTh.append(thType);
    trTh.append(thDate);
    trTh.append(thFav);
    
    table.append(trTh);

    $(".list-delete-container").append(table);
    
    var deleteButton = $('<div class="delete-button">Borrar</div>');
    $(".list-delete-container").append(deleteButton);
    
}

// Función para representar los datos de Firebase en la lista
function appendData(name, date, type, key, fav) {
    var tr = $('<tr class="' + key + '"></tr>');
    
    var tdName = $('<td class="td-name">' + name + "</td>");
    var tdType = $('<td class="td-type">' + type.toUpperCase() + "</td>");
    var tdDate = $('<td class="td-date">' + date + "</td>");
    var tdFav = $('<td class="td-fav"><i class="fa ' + fav + ' fav-off" aria-hidden="true"></td>')
    
    tr.append(tdName);
    tr.append(tdType);
    tr.append(tdDate);
    tr.append(tdFav);
    
    $(".table-list").append(tr);
    
}

// Función para representar los datos de Firebase en la lista de borrar
function appendDataDelete(name, date, type, key) {
    var tr = $('<tr class="' + key + '-del"></tr>');
    
    var tdName = $("<td>" + name + "</td>");
    var tdType = $("<td>" + type.toUpperCase() + "</td>");
    var tdDate = $("<td>" + date + "</td>");
    var tdCheckBox = $('<td><input type="checkbox" class=" ' + key + '"></td>');
    
    tr.append(tdName);
    tr.append(tdType);
    tr.append(tdDate);
    tr.append(tdCheckBox);
    
    $(".table-delete-list").append(tr);
    
}

// Función para representar los datos de Firebase en la lista de favoritos
function appendDataToFavourites(name, date, type, key) {
    var tr = $('<tr class="' + key + '-fav"></tr>');
    
    var tdName = $('<td class="td-name">' + name + "</td>");
    var tdType = $('<td class="td-type">' + type.toUpperCase() + "</td>");
    var tdDate = $('<td class="td-date">' + date + "</td>");
    var tdFav = $('<td class="td-fav-list"><i class="fa fa-star fav-on" aria-hidden="true"></td>')
    
    tr.append(tdName);
    tr.append(tdType);
    tr.append(tdDate);
    tr.append(tdFav);
    
    $(".table-fav").append(tr);
    
}