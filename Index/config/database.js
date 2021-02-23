const mysql = require('mysql');
module.exports = function(){
    return mysql.create({ //Criando conexão com banco
        host: "us-cdbr-east-03.cleardb.com",
        user: "b6981eeb6b1980",
        password: "a495a6fd",
        database: "heroku_6cf099ec35994cc"
    });
}

mysql.createPO