module.exports = function (app){
    app.put('/audit/atualiza', (req, res) =>{
        const email = req.body.email;
        console.log(email)
        
        var q1 = parseInt(req.body.q1);
        var q2 = parseInt(req.body.q2);
        var q3 = parseInt(req.body.q3);
        var q4 = parseInt(req.body.q4);
        var q5 = parseInt(req.body.q5);
        var q6 = parseInt(req.body.q6);
        var q7 = parseInt(req.body.q7);
        var q8 = parseInt(req.body.q8);
        var q9 = parseInt(req.body.q9);
        var q10 = parseInt(req.body.q10);
        
        var resultado = q1+q2+q3+q4+q5+q6+q7+q8+q9+q10;
        
        var connection = app.app.config.database;
        var auditModel = app.app.models.auditModel;
        auditModel.updateAudit(resultado, email, connection, function(errors,results){
            if(errors){
                console.log(errors)
            }
            const newLocal = "Resultado do teste Audit foi atualizado";
            res.json({auth: true, message: newLocal})
        });  
    })
    
    app.post('/audit/retorna', function(req,res){ 
        const email = req.body.email;
        console.log(email)
        var connection = app.app.config.database;
        var auditModel = app.app.models.auditModel;
    
        auditModel.getAudit(email, connection, 
            function(errors, resultado){
                if(errors){
                    console.log(errors)
                }
                console.log(resultado[0].AUDIT)
                const audit = parseInt(resultado[0].AUDIT)
                if (audit <= 7){
                    const message =["Zona de Risco I", 
                    "*DEFINIÇÃO: Pessoas que se localizam na Zona I geralmente fazem uso de baixo risco de álcool ou são abstêmias. De uma forma geral, são pessoas que bebem menos de duas doses-padrão por dia ou que não ultrapassam a quantidade de cinco doses-padrão em uma única ocasião. A intervenção adequada nesse nível é a educação em saúde, para que haja a manutenção do padrão de uso atual",
                    "*INTERVENÇÃO: Educação sobre o Álcool – Informações sobre o álcool é necessário, por exemplo, para contribuir para a conscientização geral dos riscos do álcool, uma vez que, pode contribuir para evitar o consumo de risco ou nocivo no futuro. Continue assim e tente manter sempre o seu consumo de bebidas alcoólicas abaixo, ou ao mesmo nível, das diretrizes de baixo risco.",
                    "*Para essa intervenção, nós da Conscire, sugerimos também que podem ser explorados os materiais disponibilizados aqui em nosso site!"] 
                    res.json({message: message});
                }
                else if (audit >= 8 && audit <= 15){     
                const message =["Zona de Risco II", 
                    "*DEFINIÇÃO: Pessoas que pontuam nessa zona são consideradas usuários de risco; são pessoas que fazem uso acima de duas doses-padrão todos os dias ou mais de cinco doses-padrão numa única ocasião, porém não apresentam nenhum problema decorrente disso. A intervenção adequada nesse nível é a Orientação Básica sobre o uso de baixo risco e sobre os possíveis riscos orgânicos, psicológicos ou sociais que o usuário pode apresentar se mantiver esse padrão de uso.",
                    "*INTERVENÇÃO: Aconselhamento Simples – Deve ser prestada atenção ao consumo diário e semanal de bebidas alcoólicas, no sentido de determinar se os limites de baixo risco estão próximos de serem ultrapassados. Pergunte a si mesmo se apresentou quaisquer sinais de dependência do álcool, como por exemplo, sentir-se enjoado ou com tremores matinais, ou se consegue ingerir grandes quantidade de álcool sem que pareça que está embriagado. Pode não ser fácil reduzir o seu nível de consumo de bebidas alcoólicas. Se ultrapassar os limites em determinada ocasião, faça um esforço por compreender por que o fez e elabore um plano para não cair no mesmo erro. Pode ser listado motivos para reduzir o consumo ou deixar de beber; os riscos que está sendo exposto; e formas de ultrapassar. Se tiver sempre presente como é importante reduzir o seu risco relacionado com o álcool, vai ver que é capaz.",  
                    "*Para entrar em contato com um profissional da saúde, para um diagnóstico, pode ser consultado: Lista de Caps-AD (Centros de Atenção Psicossocial em SP): https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/atencao_basica/index.php?p=204204."]  
                    res.json({message: message});
                }
               
                else if (audit >= 16  && audit <= 19 ){
                    const message =["Zona de Risco III", 
                    "*DEFINIÇÃO: Nessa zona de risco estão os usuários com padrão de uso nocivo; ou seja, pessoas que consomem álcool em quantidade e frequência acima dos padrões de baixo risco e já apresentam problemas decorrentes do uso de álcool. Por outro lado, essas pessoas não apresentam a quantidade de sintomas necessários para o diagnóstico de dependência.", 
                    "*INTERVENÇÃO: Aconselhamento Breve e Monitorização Constante –  Entre em contato comum profissional da saúde para o diagnóstico e identificação dos Estados de Mudança e Elementos de intervenção, para avaliar a sua vontade em alterar os seus hábitos de consumo de bebidas alcoólicas: pré-contemplação; contemplação; preparação; acção; manutenção.",
                    "*Para entrar em contato com um profissional da saúde, para um diagnóstico, pode ser consultado: Lista de Caps-AD (Centros de Atenção Psicossocial em SP): https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/atencao_basica/index.php?p=204204."]
                    res.json({message: message});
                }
                    
                else if (audit  >= 20){
                    const message =["Zona de Risco IV", 
                    "*DEFINIÇÃO: Pessoas que se encontram nesse nível apresentam grande chance de ter um diagnóstico de dependência. Nesse caso, é preciso fazer uma avaliação mais cuidadosa e, se confirmado o diagnóstico, deve-se motivar o usuário a procurar atendimento especializado para acompanhamento e encaminhá-lo ao serviço adequado.", 
                    "*INTERVENÇÃO: Encaminhamento para Diagnóstico, Avaliação e Tratamento Especializados – Entre em contato com um profissional especializado. De modo geral, o tratamento para a dependência do álcool é eficaz, mas poderá exigir um esforço considerável. Sendo inúmeros os benefícios em beber menos, tais como: viver mais; dormir melhor; poupar dinheiro; melhorar relacionamentos pessoais; envelhecer sem danos prematuros no cérebro; melhora o desempenho profissional; serão menores as probabilidades de doença cardíaca ou cancerígena ou problemas no fígado; diminui a probabilidade de morte por incêndio ou afogamento ou acidentes rodoviários; melhora desempenho sexual em homens; reduz a probabilidade de gravidez indesejada para as mulheres.",
                    "*Para entrar em contato com um profissional da saúde, para um diagnóstico, pode ser consultado: Lista de Caps-AD (Centros de Atenção Psicossocial em SP): https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/atencao_basica/index.php?p=204204."]
                    res.json({message: message});
                }                       
            }
        );
    });
}