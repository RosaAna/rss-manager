// DOCUMENTO PARA EL CÓDIGO SOBRE FIREBASE

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

    firebase.initializeApp(config);
    var auth = firebase.auth();
    
    auth.onAuthStateChanged(function(user) {
        if(user) { // Usuario conectado
            $(".btn-container").fadeOut(400);
            $(".logout-button").fadeIn(400);
            $(".login-form").fadeOut(400);
            console.log("Conectado");
            
            var database = firebase.database();
            
            var ref = database.ref('/public/');
            
            // Cargamos toda la base de datos de RSS públicos
            var query = database.ref('/public/');
            query.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var data = childSnapshot.val();
                    
                    appendData(data.name, data.date, data.type);
                    
                });  
            });
            
            // Cargamos toda la base de datos de RSS añadidos por el usuario
            
            var addSourceQuery = database.ref("/" + localStorage.getItem("childKey"));
            addSourceQuery.once('value').then(function(snapshot) {                
                snapshot.forEach(function(childSnapshot) {
                    var data = childSnapshot.val();
                    
                    if(data.name != undefined && data.date != undefined && data.type != undefined) {
                        appendData(data.name, data.date, data.type);
                    } else {
                        return false;
                    }
                    
                });
            });
            
            // Cargamos la base de datos de RSS añadidos por el usuario en la tabla para borrar
            var deleteSourceQuery = database.ref("/" + localStorage.getItem("childKey"));
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
            
            $(".submit-button").click(function() {
                if(checkSourceData()) {
                    addSourceLink();
                }
                
            });
            
            $(".delete-button").click(function() {
                var query = database.ref("/" + localStorage.getItem("childKey"));
                query.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        if(childSnapshot.val() != undefined) {
                            // TODO HACER ALGORITMO PARA BORRAR FUENTES
                            
                        }
                    })
                })
                
            });

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
    
    /*TODO
    
    - Hacer boton de recuperar contraseña
    - Hacer menu de configuración para cambiar correo y contraseña
    - etc...*/

    
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
    });
    
    $(".addsource").fadeOut(400);
}