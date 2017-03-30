// EXAMPLE FILE, THERE'S NOT A DATABASE CONNECTED YET

var db = {};

db.SQLite = window.cordova.require('cordova-sqlite-plugin.SQLite');

db.sqlite = new db.SQLite('example');

db.sqlite.query('CREATE TABLE IF NOT EXIST alimentadores(nombre, url, tipo)', function(err, res) {
    
    if(err) {
        console.log('Error de base de datos.');
        
    }
    
});