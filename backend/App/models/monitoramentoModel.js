module.exports = function(){
    this.getMonitoramento = function (connection, callback){
        connection.query("SELECT * FROM  monitoramento",callback);
    }

    this.setMonitoramento = function (q1, q2, q3, connection, callback){
        connection.query(`INSERT INTO monitoramento (q1, q2, q3) values ('${q1}', '${q2}', '${q3}')`, callback);
    }

    return this;
}
