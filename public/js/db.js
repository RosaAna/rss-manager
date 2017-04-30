// Iniciamos Firebase
$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyBMUcuPjZlAxuXZqzsxNqipyq_WkLwvJqA",
        authDomain: "rssmanager-46f51.firebaseapp.com",
        databaseURL: "https://rssmanager-46f51.firebaseio.com",
        projectId: "rssmanager-46f51",
        storageBucket: "rssmanager-46f51.appspot.com",
        messagingSenderId: "14631434929"
    };
    
    var authLock = false;
    
    // Iniciamos los servicios de Firebase y almacenamos auth y database en variables
    firebase.initializeApp(config);
    var auth = firebase.auth();
    var database = firebase.database();
    
    auth.onAuthStateChanged(function(user) {
        if(user) { // Usuario conectado
            if(authLock == false) {
                $(".btn-container").fadeOut(400);
                $(".logout-button").fadeIn(400);
                $(".login-form").fadeOut(400);
                $.animWrapper.enableElements();
                
                appendTable("table-list", ".list-container");
                appendTable("table-fav", ".list-container-fav");
                appendTableDelete();
                
                // Buscamos en los registros el email correspondiente al usuario
                var emailRef = database.ref('/');
                emailRef.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var userData = childSnapshot.val();
                        var userEmail = userData.email;

                        if(userEmail == user.email) {
                            localStorage.removeItem("childKey");
                            localStorage.childKey = childSnapshot.key;

                            return true;

                        }
                    });
                });

                importPublicSources();
                
                // Leemos RSS del usuario
                readUserSources();

                $(".submit-button").click(function() {
                    if(checkSourceData()) {
                        addSourceLink();
                    }

                });

                // Código para eliminar fuentes de la lista
                $(".delete-button").click(function() {
                    var query = database.ref("/" + localStorage.getItem("childKey"));
                    query.once('value').then(function(snapshot) {
                        snapshot.forEach(function(childSnapshot) {
                            if(childSnapshot.val() != undefined) {
                                if($("." + childSnapshot.key).is(":checked")) {
                                    query.child(childSnapshot.key).remove();
                                    $("." + childSnapshot.key + "-del").fadeOut(400);
                                    $("." + childSnapshot.key).remove();

                                    if(childSnapshot.val().isFav) {
                                        $("." + childSnapshot.key + "-fav").remove();
                                    }
                                }
                            }
                        });
                    });
                });

                // Código para añadir o quitar de favoritos al hacer click en la estrella
                $(".table-list").on("click", ".td-fav", function() {
                    var trKey = $(this).parent().prop('class');
                    var ref = database.ref("/" + localStorage.getItem("childKey") + "/" + trKey);

                    if($(this).children().hasClass("fa-star-o")) {
                        ref.update({'isFav':true,});

                        ref.once("value").then(function(snapshot) {
                            var data = snapshot.val();
                            appendDataToFavourites(data.name, data.date, data.type, data.key);

                        });

                        $(this).children().removeClass("fa-star-o").addClass("fa-star");

                    } else if($(this).children().hasClass("fa-star")) {
                        ref.update({'isFav': false,});
                        $('.' + trKey + '-fav').fadeOut(400);

                        $(this).children().removeClass("fa-star").addClass("fa-star-o");
                    }

                });

                // Aplicamos un código similar al anterior para eliminar de favoritos directamente en la misma lista
                $(".table-fav").on("click", ".td-fav-list", function() {
                    var trKey = $(this).parent().prop('class');
                    var finalKey = trKey.substr(0, trKey.length - 4);

                    var ref = database.ref("/" + localStorage.getItem("childKey") + "/" + finalKey);
                    ref.update({'isFav':false,});

                    $(this).parent().fadeOut(400);
                    $("." + finalKey).find(".fa-star").addClass("fa-star-o").removeClass("fa-star");

                });
                
                var check = 0;
                
                // Código para abrir la noticia al hacer click en los td, no en el de favoritos
                $(".table-list").on("click", ".td-name, .td-type, .td-date", function() {
                    var trClass = $(this).parent().prop("class");
                    var query = database.ref("/" + localStorage.getItem("childKey") + "/" + trClass);
                    query.once("value").then(function(snapshot) {
                        $.feed.cargaNoticia(snapshot.val().url, ".news-container", snapshot.val().type.toLowerCase());
                        $.animWrapper.newsSlideIn(".newspage", ".listpage", snapshot.val().name);

                    });
                    check = 1;
                    
                });
                
                // Mismo código del anterior pero ahora para acceder desde la pantalla de favoritos
                $(".table-fav").on("click", ".td-name, .td-type, .td-date", function() {
                    var trClass = $(this).parent().prop("class");
                    var newTrClass = trClass.substr(0, trClass.length - 4);
                    var query = database.ref("/" + localStorage.getItem("childKey") + "/" + newTrClass);
                    query.once("value").then(function(snapshot) {
                        $.feed.cargaNoticia(snapshot.val().url, ".news-container", snapshot.val().type.toLowerCase());
                        $.animWrapper.newsSlideIn(".newspage", ".listpage-fav", snapshot.val().name);

                    });
                    
                    check = 2;
                    
                });
                
                // Código que detecta si estás en la página de favoritos o en la lista y actua en consecuencia
                $(".news-backarrow").click(function() {
                    if(check == 1) {
                        $.animWrapper.newsSlideOut(".listpage", ".newspage");
                    } else if(check == 2) {
                        $.animWrapper.newsSlideOut(".listpage-fav", ".newspage");
                    }
                    
                });

                authLock = true;
                
            } else {
                return true;
            }
            
        } else { // Usuario desconectado
            $(".btn-container").fadeIn(400);
            $(".logout-button").fadeOut(400);
            cleanElements();
            $.animWrapper.disableElements();
            authLock = false;
            
        }
    });
        
    // Iniciamos la autentificación con correo y contraseña cuando se pulse el botón
    $(".submit-register").click(function() {

        if(checkRegisterForm() == true) {
            var email = $("#register-email").val();
            var password = document.getElementById("register-password").value;
            
            auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                
            });
            
            writeUserData(email);
            $(".register-form").fadeOut(400);
        }

    });
    
    $(".logout-button").click(function() {
        auth.signOut(); 
        
    });
    
    $(".connect-button").click(function() {
        if(checkLoginForm()) {
            var email = $(".user-input").val();
            var password = document.getElementById("password-input").value;
            
            auth.signInWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                
                if(errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found" || errorCode === "auth/user-disabled" 
                  || errorCode === "auth/invalid-email") {
                    wrongPassPopup();
                    
                } 
            });
        }  
    });
});

function wrongPassPopup() {
    $(".auth-error-ntf").fadeIn(400);
    setTimeout(function() {
        $(".auth-error-ntf").fadeOut(400);
    }, 6000);
    
}

// Función que comprueba la validez del email introducido
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
    
}

function checkRegisterPass() {    
    var password = document.getElementById("register-password").value;
    var confirm = document.getElementById("register-confirm-password").value;
    
    if(password === "" || confirm === "") {
        return false;
        
    } else if(password === confirm) {
        return true;
    } else {
        return false;
    }  
}

function registerErrorPopup() {
    $(".error-ntf").fadeIn(400);
    setTimeout(function() {
        $(".error-ntf").fadeOut(400);
    }, 6000);
    
}

// Función que muestra una notificación cuando haya un error al iniciar sesión
function errorLoginPopup() {
    $(".login-error-ntf").fadeIn(400);
    setTimeout(function() {
        $(".login-error-ntf").fadeOut(400);
    }, 6000);
    
}

// Función que comprueba los campos del formulario de registro
function checkRegisterForm() {
    var user = $("#register-name").val();
    var email = $("#register-email").val();
    var password = $("#register-password").val();
    var passConfirm = $("#register-confirm-password").val();
    var check = true;
    
    if(user.length < 5 || user.length > 15) {
        $("#register-name").css("background-color", "#ef5350");
        registerErrorPopup();
        check = false;
    } else {
        $("#register-name").css("background-color", "white");
    }
    
    if((isEmail(email) === false) || email == "") {
        $("#register-email").css("background-color", "#ef5350");
        registerErrorPopup();
        check = false;
    } else {
        $("#register-email").css("background-color", "white");
    }
    
    if(password.length < 5 || password.length > 15) {
        $("#register-password").css("background-color", "#ef5350");
        registerErrorPopup();
        check = false;
    } else {
        $("#register-password").css("background-color", "white");
    }
    
    if(checkRegisterPass() == false) {
        $("#register-confirm-password").css("background-color", "#ef5350");
        $("#register-password").css("background-color", "#ef5350");
        registerErrorPopup();
        check = false;
    } else {
        $("#register-confirm-password").css("background-color", "white");
        $("#register-password").css("background-color", "white");
    }
    
    return check;
    
}

function checkLoginForm() {
    var email = $(".user-input").val();
    var password = document.getElementById("password-input").value;
    
    var check = true;
    
    if(!isEmail(email)) {
        $(".user-input").css("background-color", "#ef5350");
        errorLoginPopup();
        check = false;
    } else {
        $(".user-input").css("background-color", "white");
    }
    
    if(password.length < 5 || password.length > 15) {
        $("#password-input").css("background-color", "#ef5350");
        errorLoginPopup();
        check = false;
    } else {
        $("#password-input").css("background-color", "white");
    }
    
    return check;
    
}

// Función que crea una entrada en la base de datos para cada usuario con una serie de datos añadidos
function writeUserData(email) {
    var path = firebase.database().ref('/');
    var userData = {
        'email': email,
        'isImported': false,
    };
    
    path.push(userData); 
    
}

function checkSourceData() {
    var check = true;
    var sourceName = $(".sourcename").val();
    var sourceLink = $(".sourcelink").val();
    
    if(sourceName == "") {
        $(".sourcename").css("background-color", "#ef5350");
        addSourceErrorPopup();
        check = false;
    } else {
        $(".sourcename").css("background-color", "white");
    }
    
    if(sourceLink == "") {
        $(".sourcelink").css("background-color", "#ef5350");
        addSourceErrorPopup();
        check = false;
    } else {
        $(".sourcelink").css("background-color", "white");
    }
    
    return check;
    
}

function addSourceErrorPopup() {
    $(".addsource-error-ntf").fadeIn(400);
    setTimeout(function() {
        $(".addsource-error-ntf").fadeOut(400);
    }, 6000);
    
}

function addSourceLink() {
    var name = $(".sourcename").val();
    var url = $(".sourcelink").val();
    var type;
    
    if($(".rss-selector").hasClass("rss-clicked")) {
        type = "rss";
    }
    
    if($(".atom-selector").hasClass("atom-clicked")) {
        type = "atom";
    }
    
    var key = localStorage.getItem("childKey");
    var date = new Date();
    var month = date.getMonth() + 1;

    var formatDate = date.getDate() + '/' + month + '/' + date.getFullYear();

    var newKey = firebase.database().ref("/" + key).push({
        "name": name,
        "url": url,
        "type": type,
        "date": formatDate,
        "isFav": false,
    }).key;

    var deleteKey = newKey + "-del";

    var fav = "fa-star-o";
    appendData(name, formatDate, type, newKey, fav);
    appendDataDelete(name, formatDate, type, deleteKey);

    $(".addsource").fadeOut(400);

}

function readUserSources() {
    // Cargamos toda la base de datos de RSS añadidos por el usuario
    var addSourceQuery = firebase.database().ref("/" + localStorage.getItem("childKey"));
    addSourceQuery.once('value').then(function(snapshot) {                
        snapshot.forEach(function(childSnapshot) {
            var data = childSnapshot.val();

            if(data.name != undefined && data.date != undefined && data.type != undefined) {
                if(data.isFav) {
                    var fav = "fa-star";
                    
                    appendData(data.name, data.date, data.type, childSnapshot.key, fav);
                    appendDataDelete(data.name, data.date, data.type, childSnapshot.key);
                    appendDataToFavourites(data.name, data.date, data.type, childSnapshot.key);
                } else {
                    var fav = "fa-star-o";
                    appendData(data.name, data.date, data.type, childSnapshot.key, fav);
                    appendDataDelete(data.name, data.date, data.type, childSnapshot.key);
                }
            } else {
                return false;
            }

        });
    });
    
}

// Función que importa los RSS públicos al perfil del usuario
function importPublicSources() {
    var ref = firebase.database().ref("/" + localStorage.getItem("childKey"));
    ref.once("value").then(function(snapshot) {

        if(snapshot.val().isImported !== true) {
            var publicRef = firebase.database().ref("/public");
            publicRef.once('value').then(function(publicSnapshot) {
                publicSnapshot.forEach(function(childSnapshot) {
                    var itemValue = childSnapshot.val();
                    var importData = {
                        'name': itemValue.name,
                        'date': itemValue.date,
                        'type': itemValue.type,
                        'url': itemValue.url,
                        'isFav': false,
                    };

                    ref.push(importData);

                });
            });
        }

        ref.update({'isImported': true,});

    });
    
}