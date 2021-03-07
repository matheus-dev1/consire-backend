module.exports = function(){
    this.getAudit = function (email, connection, callback){
        connection.query(`SELECT AUDIT FROM login WHERE email='${email}'`,callback);
    }

    this.updateAudit = function (resultado, email, connection, callback){
        connection.query(`UPDATE login SET AUDIT = '${resultado}' WHERE EMAIL='${email}'`,callback);
    }

    return this;
}