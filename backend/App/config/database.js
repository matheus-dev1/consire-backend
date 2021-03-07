const mysql = require('mysql');
module.exports = function(){
    return mysql.createConnection({ //Criando conexão com banco
        host: "localhost",
        user: "root",
        password: "",
        database: "squad5"
    });
}
