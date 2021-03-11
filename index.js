const express = require("express"), //IMPORTAÇÕES: EXPRESS, CORS, MYSQL
    server = express(),
    cors = require("cors"),
    mysql = require("mysql");
    bcrypt = require('bcrypt');
    bodyParser = require('body-parser');
    cookie = require('cookie-parser');
    session = require('express-session');
    jwt = require('jsonwebtoken')

const saltRounds = 10


const {check, validationResult } = require("express-validator");
const { response } = require("express");
const connection = require('./Index/config/database');
const database = connection();


//Middlewares
server.use((req, res, next) => {
       res.setHeader("Access-Control-Allow-Origin", "*")
       res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT")
       res.setHeader("Acess-Control-Allow-Headers", "X-Requested-With, content-type,x-acess-token,Authorization,access-x-btc,elegibility,x-buy-token")
       res.setHeader("Access-Control-Allow-Credentials", true)
       return next()
});

    server.use(cors());

    server.use(cookie())

    server.use(bodyParser.urlencoded({extended: true}));

    server.use(express.json()); //Lê dados em json

//Session
    server.use(session({
        key: 'userId',
        secret: 'conscire',
        resave: false,
        saveUninitialized: false,
        cookie:{
            expires: 60 * 60 * 24,
        },
    }))

//Construção de rotas:



server.get("/", (req, res) =>{ //Raiz
    res.end("<html><h1> Hello world </h1> </html>")
})

server.post('/register', [ 
    check('nome', 'Nome é obrigatório com pelo menos 3 caracteres').exists().isLength({min:3}),
    check('email', 'Email é obrigatório').isEmail().normalizeEmail(),
    check('senha', 'A senha precisa ter no mínimo 5 dígitos e no máximo 8!').exists().isLength({min:5,max:8}),
    check('confirme', 'A senha precisa ser igual a digitada anteriormente!').exists().isLength({min:5,max:8}),
], (req, res) =>{
    const nome = req.body.nome;
    const email = req.body.email;
    const senha= req.body.senha;
    const confirme= req.body.confirme;
    var errors = validationResult(req);
        if(!errors.isEmpty()){
            res.json({auth: false, validacao:errors, dados: [nome, email, senha]})
            console.log(errors);
            return;
        }
    if(senha==confirme){
        bcrypt.hash(senha, saltRounds, (error, hash)=>{
            if(error){
                console.log(error)
            }
            const sql = (`SELECT * FROM login WHERE email = '${email}'`)
            database.query(sql, (error, results)=>{
                if(error){
                    console.log(error)
                    res.send({error: error})
                }if (results.length > 0){
                    bcrypt.compare(senha, results[0].SENHA, (errors, response)=>{
                        if(response){
                            const id = results[0].ID
                            const token = jwt.sign({id}, "jwtSecret", {
                                expiresIn: 300,
                            })
                            req.session.user = results;
                            console.log(req.session.user[0].EMAIL)

                            res.json({auth: false, validacao:errors,  token: token, results: results})
                            
                        }else{
                            res.json({auth: false, validacao:errors, message: "Email já cadastrado!"})
                        }
                    })
                }else{
                    const sql = `INSERT INTO login (nome, email, senha) VALUES('${nome}', '${email}', '${hash}')`;
                    database.query(sql, (error, results) =>{    
                        const newLocal = "Cadastro realizado com sucesso";
                        res.json({auth: false, validacao:errors, message: newLocal})
                    })
                }
            })
        })
    }else{
        const newLocal = "As senhas estão diferentes";
        res.json({auth: false, validacao:errors, message: newLocal})
        console.log('As senhas estão diferentes')  
    }
})





server.post('/login', (req, res) =>{
  
    const email = req.body.email;
    const senha= req.body.senha;

    const sql = (`SELECT * FROM login WHERE email = '${email}'`)
    database.query(sql, (error, results)=>{
        if(error){
            console.log(error)
            res.send({error: error})
        }if (results.length > 0){
            bcrypt.compare(senha, results[0].senha, (error, response)=>{
                console.log(results[0].senha)
                if(response){
                    
                    const id = results[0].ID
                    const token = jwt.sign({id}, "jwtSecret", {
                        expiresIn: 300 * 300,
                    })

                    req.session.user = results;
                    EmailSession = req.session.user[0].email
                    console.log(req.session.user[0].nome)

                    res.json({auth: true, token: token, results: EmailSession})                         
                }else{
                    console.log(senha)
                    res.json({auth: false, message: "Senha errada!"})
                }
            })
        }else{
            res.json({auth: false, message: "Este usuário não existe"})
        }
    })
})

const verifyJWT = (req, res, next)=>{
    const token = req.headers['x-acess-token'];

    if(!token){
        res.send("Você não está logado")
    }else{
        jwt.verify(token, "jwtSecret", (err, decoded)=>{
            if(err){
                res.json({auth: false, message: "Falha na autenticação"})
            }else{
                req.userId = decoded.ID;
                next();
            }
        })
    }
}

server.get('/isUserAuth', verifyJWT, (req, res)=>{
    res.send("Usuário autenticado com sucesso, boas vindas ao Projeto Conscire!")
})

server.get('/login', (req, res)=>{
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user})
    }else{
        res.send({loggedIn: false})
    }
})







server.get('/comentarios/retorna', (req, res)=>{
    
    const sql = "SELECT * FROM  comentarios;";
    database.query(sql, (error, results) =>{
        res.json(results)  
    })
})

server.get('/comentarios/envia', (req, res)=>{
    res.json( {auth: false, validacao:{errors:{},}, dados:{}});  
})

server.post('/comentarios/envia', [ 
    check('nome', 'Nome é obrigatório com pelo menos 3 caracteres').exists().isLength({min:3}),
    check('sobrenome', 'Sobrenome é obrigatório com pelo menos 3 caracteres').exists().isLength({min:3}),
    check('msg', 'A mensagem precisa ter pelo menos 3 caracteres').exists().isLength({min:3}),
], (req, res)=>{
    
    const {nome, sobrenome, msg} = req.body; //Desestruturação do corpo da requisiçao em dois elementos que iremos enviar ao bd
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({auth: false, validacao:errors, dados: [nome, sobrenome, msg]})
        console.log(errors);
        return;
    }
    const sql = `INSERT INTO comentarios (nome, sobrenome, msg) values ('${nome}', '${sobrenome}', '${msg}')`;
    database.query(sql, (error, results) =>{
        const newLocal = "Agradecemos pela mensagem - valeu";
        res.json({auth: false, validacao:errors, message: newLocal})

    })
    
})

server.put('/audit/atualiza', (req, res) =>{
    
    const q1 = req.body.q1;
    const q2 = req.body.q2;
    const q3 = req.body.q3;
    const q4 = req.body.q4;    
    const q5 = req.body.q5; 
    const q6 = req.body.q6; 
    const q7 = req.body.q7; 
    const q8 = req.body.q8; 
    const q9 = req.body.q9; 
    const q10 = req.body.q10; 
    const email = req.body.email;
    
    var resultado = q1+q2+q3+q4+q5+q6+q7+q8+q9+q10;  
    console.log(resultado)
    console.log(email)    
   
    const sql = `UPDATE login SET audit = '${resultado}' WHERE email = '${email}'`; 
        database.query(sql, (error, results) =>{
            if(error){
                console.log(error)
            }
        console.log(results)
        const newLocal = "Resultado do teste Audit foi atualizado";
        res.json({auth: true, message: newLocal})
       
    }) 
 
})

server.post('/audit/retorna', function(req,res){ 
        
        const email = req.body.email;
        console.log(email)
        
        const sql = `SELECT audit FROM login WHERE email='${email}'`;
        database.query(sql, (error, resultado) =>{
            const audit = resultado[0].audit
            if (audit <= 7){
                const message =`Seu resultado no teste Audit foi = ${audit} ---> Zona de Risco I:  
                \n*DEFINIÇÃO: Pessoas que se localizam na Zona I geralmente fazem uso de baixo risco de álcool ou são abstêmias. De uma forma geral, são pessoas que bebem menos de duas doses-padrão por dia ou que não ultrapassam a quantidade de cinco doses-padrão em uma única ocasião. A intervenção adequada nesse nível é a educação em saúde, para que haja a manutenção do padrão de uso atual.
                \n*INTERVENÇÃO: Educação sobre o Álcool – Informações sobre o álcool é necessário, por exemplo, para contribuir para a conscientização geral dos riscos do álcool, uma vez que, pode contribuir para evitar o consumo de risco ou nocivo no futuro. Continue assim e tente manter sempre o seu consumo de bebidas alcoólicas abaixo, ou ao mesmo nível, das diretrizes de baixo risco.
                \n*Para essa intervenção, nós da Conscire, sugerimos também que podem ser explorados os materiais disponibilizados aqui em nosso site!`
                res.json(message);
            }
            else if (audit >= 8 && audit <= 15){  
                const message =`Seu resultado no teste Audit foi = ${audit} ---> Zona de Risco II:  
                \n*DEFINIÇÃO: Pessoas que pontuam nessa zona são consideradas usuários de risco; são pessoas que fazem uso acima de duas doses-padrão todos os dias ou mais de cinco doses-padrão numa única ocasião, porém não apresentam nenhum problema decorrente disso. A intervenção adequada nesse nível é a Orientação Básica sobre o uso de baixo risco e sobre os possíveis riscos orgânicos, psicológicos ou sociais que o usuário pode apresentar se mantiver esse padrão de uso.
                \n*INTERVENÇÃO: Aconselhamento Simples – Deve ser prestada atenção ao consumo diário e semanal de bebidas alcoólicas, no sentido de determinar se os limites de baixo risco estão próximos de serem ultrapassados. Pergunte a si mesmo se apresentou quaisquer sinais de dependência do álcool, como por exemplo, sentir-se enjoado ou com tremores matinais, ou se consegue ingerir grandes quantidades de álcool sem que pareça que está embriagado. Se ultrapassar os limites em determinada ocasião, faça um esforço por compreender por que o fez e elabore um plano para não cair no mesmo erro. Pode ser listado motivos para reduzir o consumo ou deixar de beber; os riscos a que está sendo exposto; e formas de ultrapassar. Se tiver sempre presente como é importante reduzir o seu risco relacionado com o álcool, vai ver que é capaz. 
                \n*Para entrar em contato com um profissional da saúde, para um diagnóstico, pode ser consultado: Lista de Caps-AD (Centros de Atenção Psicossocial em SP): https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/atencao_basica/index.php?p=204204.` 
                res.json(message);
                //console.log(message)
            }
            else if (audit >= 16  && audit <= 19){
                const message =`Seu resultado no teste Audit foi = ${audit} ---> Zona de Risco III: 
                \n*DEFINIÇÃO: Nessa zona de risco estão os usuários com padrão de uso nocivo; ou seja, pessoas que consomem álcool em quantidade e frequência acima dos padrões de baixo risco e já apresentam problemas decorrentes do uso de álcool. Por outro lado, essas pessoas não apresentam a quantidade de sintomas necessários para o diagnóstico de dependência. 
                \n*INTERVENÇÃO: Aconselhamento Breve e Monitorização Constante –  Entre em contato com um profissional da saúde para o diagnóstico e identificação dos Estados de Mudança e Elementos de intervenção, para avaliar a sua vontade em alterar os seus hábitos de consumo de bebidas alcoólicas: pré-contemplação; contemplação; preparação; acção; manutenção.
                \n*Para entrar em contato com um profissional da saúde, para um diagnóstico, pode ser consultado: Lista de Caps-AD (Centros de Atenção Psicossocial em SP): https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/atencao_basica/index.php?p=204204.`
                res.json(message);
            }   
            else if (audit  >= 20){
                const message =`Seu resultado no teste Audit foi = ${audit} ---> Zona de Risco IV:  
                \n*DEFINIÇÃO: Pessoas que se encontram nesse nível apresentam grande chance de ter um diagnóstico de dependência. Nesse caso, é preciso fazer uma avaliação mais cuidadosa e, se confirmado o diagnóstico, deve-se motivar o usuário a procurar atendimento especializado para acompanhamento e encaminhá-lo ao serviço adequado.
                \n*INTERVENÇÃO: Encaminhamento para Diagnóstico, Avaliação e Tratamento Especializados – Entre em contato com um profissional especializado. De modo geral, o tratamento para a dependência do álcool é eficaz, mas poderá exigir um esforço considerável. Sendo inúmeros os benefícios em beber menos, tais como: viver mais; dormir melhor; poupar dinheiro; melhorar relacionamentos pessoais; envelhecer sem danos prematuros no cérebro; melhora o desempenho profissional; serão menores as probabilidades de doença cardíaca ou cancerígena ou problemas no fígado; diminui a probabilidade de morte por incêndio ou afogamento ou acidentes rodoviários; melhora desempenho sexual em homens; reduz a probabilidade de gravidez indesejada para as mulheres.
                \n*Para entrar em contato com um profissional da saúde, para um diagnóstico, pode ser consultado: Lista de Caps-AD (Centros de Atenção Psicossocial em SP): https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/atencao_basica/index.php?p=204204.`
                res.json(message);
            }                       
        }
    );
});

server.get('/monitoramento/retorna', (req, res)=>{
    var sql = "SELECT * FROM  monitoramento"
    database.query(sql, (error, results)=>{ 
        res.json(results) 
    })
});

server.post('/monitoramento/register', (req, res)=>{
    var {q1, q2, q3} = req.body;
    var sql = `INSERT INTO monitoramento (q1, q2, q3) values ('${q1}', '${q2}', '${q3}')`
    database.query(sql, (errors,results)=>{
        const newLocal = "Agradecemos pelo seu feedback!!";
        res.json({auth: false, validacao:errors, message: newLocal})
    })
}); 

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
