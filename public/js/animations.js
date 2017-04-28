// Creamos el objeto para envolver las funciones
$.animWrapper = {};

$(document).ready(function() {
    
    // Ocultamos todos los elementos que no sean la página principal de la aplicación
    $.animWrapper.hideElements();
    
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
    
    // EFECTOS BOTONES PARA ADDSOURCE
    $(".rss").click(function() {
        $(".atom-clicked").removeClass("atom-clicked").addClass("atom");
        $(".rss").removeClass("rss").addClass("rss-clicked");        
    });
    
    $(".atom").click(function() {
        $(".rss-clicked").removeClass("rss-clicked").addClass("rss");
        $(".atom").removeClass("atom").addClass("atom-clicked");        
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
    
    // EFECTO PARA LA LISTA DE FAVORITOS
    $(".favourites").click(function() {
        $("html, body").animate({
            scrollTop: 0,
        }, 600);
        
        $(".flex-icons").fadeOut(400, function() {
            $(".listpage-fav").fadeIn(400);
            
            $(".listheader").animate({
                height: "50px",
            }, 400);
            
        });

    });
    
    // Efecto contrario para volver a la página principal
    $(".backarrow-fav").click(function() {    
        $("html, body").animate({
            scrollTop: 0,
        }, 600);
        
        $(".listheader").animate({
            height: "0px",
        }, 400);
        
        $(".listpage-fav").fadeOut(400, function() {
            $(".flex-icons").fadeIn(400);
            
        });
        
    });
    
    // EFECTOS PARA LOS BOTONES DE LOGIN
    
    $(".login-btn").hover(function() {
        $(".login-btn-icon").removeClass("fa-user-o").addClass("fa-user");
    }, function() {
        $(".login-btn-icon").removeClass("fa-user").addClass("fa-user-o");
    });
    
    // ANIMACIONES PARA EL POPUP DE INICIO DE SESIÓN
    $(".login-btn").click(function() {
        $(".login-form").fadeIn(400);
        $(".user-input").val("");
        $("#password-input").val("");
    });
    
    $(".login-quit").click(function() {
        $(".login-form").fadeOut(400);
        $(".user-input").val("");
        $("#password-input").val("");
    });
    
    // ANIMACIONES PARA EL POPUP DE REGISTRO
    $(".signup-btn").click(function() {
        $(".register-form").fadeIn(400);
        $("#register-name").val("");
        $("#register-email").val("");
        $("#register-password").val("");
        $("#register-confirm-password").val("");
        
    });
    
    $(".register-quit").click(function() {
        $(".register-form").fadeOut(400);
        $("#register-name").val("");
        $("#register-email").val("");
        $("#register-password").val("");
        $("#register-confirm-password").val("");
    });
    
    // ANIMACIONES PARA EL POPUP DE AÑADIR FUENTE
    $(".add").click(function() {
        $(".sourcename").val("");
        $(".sourcelink").val("");
    });

});

// Función que oculta todos los elementos que no se tienen que ver en la página
$.animWrapper.hideElements = function() {
    $(".listpage").hide();
    $(".addsource").hide();
    $(".listpage-delete").hide();
    $(".login-form").hide();
    $(".register-form").hide();
    $(".error-ntf").hide();
    $(".login-error-ntf").hide();
    $(".btn-container").hide();
    $(".logout-button").hide();
    $(".auth-error-ntf").hide();
    $(".addsource-error-ntf").hide();
    $(".listpage-fav").hide();
    $(".newspage").hide();
    $(".news-error-ntf").hide();
}

$.animWrapper.newsSlideIn = function(cajaEntrada, cajaSalida, title) {
    $("html, body").animate({
        scrollTop: 0,
    }, 600);

    $(cajaSalida).fadeOut(400, function() {
        $(cajaEntrada).fadeIn(400);

        $(".newsheader").animate({
            height: "50px",
        }, 400);
        
        $(".newsheader-title").empty();
        $(".newsheader-title").append(title);

    });
}

$.animWrapper.newsSlideOut = function(cajaEntrada, cajaSalida) {
    $("html, body").animate({
        scrollTop: 0,
    }, 600);

    $(".newsheader").animate({
        height: "0px",
    }, 400);

    $(cajaSalida).fadeOut(400, function() {
        $(cajaEntrada).fadeIn(400);

    });
    
    $(".news-container").empty();
    
}

$.animWrapper.disableElements = function() {
    $(".list, .add, .delete, .favourites").css({
        "cursor": "wait",
        "pointer-events": "none",
    });
    
    $(".list, .add, .delete, .favourites").fadeTo('slow', 0.6);
    
}

$.animWrapper.enableElements = function() {
    $(".list, .add, .delete, .favourites").css({
        "cursor": "pointer",
        "pointer-events": "all",
    });
    
    $(".list, .add, .delete, .favourites").fadeTo('slow', 1);
    
}