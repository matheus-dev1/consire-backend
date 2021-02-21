const mysql = require('mysql');
module.exports = function(){
    return mysql.createConnection({ //Criando conexão com banco
        host: "mysql-20992-0.cloudclusters.net",
        user: "squad5",
        password: "squad5@@",
        database: "squad5"
    });
}