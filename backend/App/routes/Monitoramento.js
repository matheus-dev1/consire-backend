module.exports = function (app){
    app.get('/monitoramento/retorna', (req, res)=>{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //https://conscire-front.herokuapp.com

        var connection = app.app.config.database;
        var monitoramentoModel = app.app.models.monitoramentoModel;
        monitoramentoModel.getMonitoramento(connection, 
            function(errors, results){
                res.json(results)  
            }
        );
    })

    app.post('/monitoramento/register', (req, res)=>{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //https://conscire-front.herokuapp.com

        var {q1, q2, q3} = req.body;
        var connection = app.app.config.database;
        var monitoramentoModel = app.app.models.monitoramentoModel;
        monitoramentoModel.setMonitoramento(q1, q2, q3, connection, function(error,results){
        });
        monitoramentoModel.getMonitoramento(connection, 
            function(errors, results){
                const newLocal = "Agradecemos pelo seu feedback!!";
                res.json({auth: false, validacao:errors, message: newLocal})
            }
        );
    }); 
}
