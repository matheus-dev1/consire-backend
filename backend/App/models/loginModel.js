module.exports = function(){
    this.getLogin = function (email, connection, callback){
        connection.query(`SELECT * FROM login WHERE email = '${email}'`,callback);
    }

    this.setLogin = function (nome, email, hash, connection, callback){
        connection.query(`INSERT INTO login (NOME, EMAIL, SENHA) values ('${nome}', '${email}', '${hash}')`, callback);
    }

    // this.deleteLogin = function (email, connection, callback){
    //     connection.query("DELETE FROM login WHERE email = "+email,callback);
    // }

    return this;
}