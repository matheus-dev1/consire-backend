const {check, validationResult } = require("express-validator");
module.exports = function (app){
    app.get('/comentarios/retorna', (req, res)=>{
        res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //https://conscire-front.herokuapp.com
        var connection = app.app.config.database;
        var comentarioModel = app.app.models.comentarioModel;
        comentarioModel.getComentario(connection, 
            function(errors, results){
                console.log(errors)
                res.json(results)  
            }
        );

    })
    

    app.get('/comentarios/envia', (req, res)=>{
        res.json( {auth: false, validacao:{errors:{},}, dados:{}});  
    })
    
    app.post('/comentarios/envia', [ 
        check('nome', 'Nome é obrigatório com pelo menos 3 caracteres').exists().isLength({min:3}),
        check('sobrenome', 'Sobrenome é obrigatório com pelo menos 3 caracteres').exists().isLength({min:3}),
        check('msg', 'A mensagem precisa ter pelo menos 3 caracteres').exists().isLength({min:3}),
    ], (req, res)=>{

        res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //https://conscire-front.herokuapp.com

        var {nome, sobrenome, msg} = req.body

        var errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({auth: false, validacao:errors, dados: [nome, sobrenome, msg]})
            console.log(errors);
            return;
        }
        var connection = app.app.config.database;
        var comentarioModel = app.app.models.comentarioModel;
        comentarioModel.setComentario(nome, sobrenome, msg, connection, function(error,results){
        });
        comentarioModel.getComentario(connection, 
            function(errors, results){
                console.log(errors,results)
                const newLocal = "Agradecemos pela mensagem!!";
                res.json({auth: false, validacao:errors, message: newLocal})
            }
        );
    }); 
}