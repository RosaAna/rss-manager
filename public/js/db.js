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

    // Iniciamos los servicios de Firebase y almacenamos auth y database en variables
    firebase.initializeApp(config);
    var auth = firebase.auth();
    var database = firebase.database();
    
    auth.onAuthStateChanged(function(user) {
        if(user) { // Usuario conectado
            $(".btn-container").fadeOut(400);
            $(".logout-button").fadeIn(400);
            $(".login-form").fadeOut(400);
            console.log("Conectado");
            
            // Cargamos toda la base de datos de RSS públicos
            var query = database.ref('/public/');
            query.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var data = childSnapshot.val();
                    
                    appendData(data.name, data.date, data.type, childSnapshot.key);
                    
                });  
            });
            
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
                        
                    } else {
                        console.log("Tu email no existe en la base de datos.");
                    }
                });
            });
            
            // Buscamos en los registros de favoritos el email correspondiente al usuario
            var favRef = database.ref('/favourites/');
            favRef.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var favData = childSnapshot.val();
                    var userEmail = favData.email;
                    
                    if(userEmail == user.email) {
                        localStorage.removeItem("childKeyFav");
                        localStorage.childKeyFav = childSnapshot.key;
                        
                        return true;
                        
                    } else {
                        console.log("Tu email no existe en la base de datos.");
                    }
                });
            });
            
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
                            }
                        }
                    });
                });
            });
            
            /* HAY UN ERROR CON LOS SELECTORES DE LAS ESTRELLAS, NO SE DETECTAN Y DEBERÍAN CAMBIAR DE CLASE,
               SE DETECTAN TODOS LOS ELEMENTOS MENOS ESTOS, INVESTIGAR ORDEN DE RENDERIZADO O PROBLEMAS DE OTRO TIPO */
            
        } else { // Usuario desconectado
            $(".btn-container").fadeIn(400);
            $(".logout-button").fadeOut(400);
            console.log("Desconectado");
            
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

function errorPopup() {
    $(".error-ntf").fadeIn(400);
    setTimeout(function() {
        $(".error-ntf").fadeOut(400);
    }, 6000);
    
}

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
        errorPopup();
        check = false;
    } else {
        $("#register-name").css("background-color", "white");
    }
    
    if((isEmail(email) === false) || email == "") {
        $("#register-email").css("background-color", "#ef5350");
        errorPopup();
        check = false;
    } else {
        $("#register-email").css("background-color", "white");
    }
    
    if(password.length < 5 || password.length > 15) {
        $("#register-password").css("background-color", "#ef5350");
        errorPopup();
        check = false;
    } else {
        $("#register-password").css("background-color", "white");
    }
    
    if(checkRegisterPass() == false) {
        $("#register-confirm-password").css("background-color", "#ef5350");
        $("#register-password").css("background-color", "#ef5350");
        errorPopup();
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
    };
    
    path.push(userData);
    
    var favPath = firebase.database().ref("/favourites/");
    var favData = {
        'email': email,
    };
    
    favPath.push(favData);
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
    
    var formatDate = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
    
    firebase.database().ref("/" + key).push({
        "name": name,
        "url": url,
        "type": type.toUpperCase(),
        "date": formatDate,
        "isFav": false,
    });
    
    var addQuery = firebase.database().ref("/" + key);
    addQuery.on("value", function(snapshot) {
        var addKey = snapshot.key;
        var deleteKey = snapshot.key + "-del";
        appendData(name, formatDate, type, addKey);
        appendDataDelete(name, formatDate, type, deleteKey);
    });
    
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
                    appendData(data.name, data.date, data.type, childSnapshot.key);
                    appendDataToFavourites(data.name, data.date, data.type, childSnapshot.key);
                } else {
                    appendData(data.name, data.date, data.type, childSnapshot.key);
                }
            } else {
                return false;
            }

        });
    });
    
    // Cargamos toda la base de datos de RSS añadidos por el usuario en la tabla para borrar
    var deleteSourceQuery = firebase.database().ref("/" + localStorage.getItem("childKey"));
    deleteSourceQuery.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var data = childSnapshot.val();

            if(data.name != undefined && data.date != undefined && data.type != undefined) {
                appendDataDelete(data.name, data.date, data.type, childSnapshot.key);
            } else {
                return false;
            }
        });
    });
    
}