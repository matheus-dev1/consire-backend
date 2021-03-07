module.exports = function(){
    this.getComentario = function (connection, callback){
        connection.query("SELECT * FROM  comentarios",callback);
    }
    
    this.setComentario = function (nome, sobrenome, msg, connection, callback){
        connection.query(`INSERT INTO comentarios (nome, sobrenome, msg) values ('${nome}', '${sobrenome}', '${msg}')`, callback); 
    }  

    return this;
}

