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
    
    // Iniciamos la autentificación con correo y contraseña cuando se pulse el botón
    $(".submit-register").click(function() {

        if(checkRegisterForm() == true) {
            var email = $("#register-email").val();
            var password = document.getElementById("register-password").value;
            
            auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                
            });
            
            $(".btn-container").hide();
            $(".register-form").fadeOut(400);
        }

    });
    
    /*TODO
    
    - Hacer boton de recuperar contraseña
    - Hacer menu de configuración para cambiar correo y contraseña
    - Hacer acciones para los botones de logueo y desconexión
    - etc...*/
    
    /*auth.signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            
            console.log("Error code: " + errorCode + " - " + errorMessage);
    });*/
    
    auth.onAuthStateChanged(function(user) {
        if(user) {
            $(".btn-container").hide();
            console.log("Conectado");
            
        } else {
            $(".btn-container").fadeIn();
            console.log("Desconectado");
            
        }
    
    });
    
});

// Función que comprueba la validez del email introducido
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
    
}

function checkPass() {    
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
    
    if(checkPass() == false) {
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